import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { exec as execCommand } from "child_process";
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import { readFileSync } from "fs";
import { createActor as createAssetProxyActor } from "../test/dfx_generated/asset_proxy";
import { createActor as createAssetActor } from "../test/dfx_generated/asset";
import { createActor as createProvisionActor } from "../test/dfx_generated/provision";
import { Principal } from "@dfinity/principal";
import { ASSET_CANISTER_WASM, TOKEN_CANISTER_WASM, getModuleHash, loadWasmChunksToCanister } from "../test/src/utils/wasm";
import { managementActor, managementCanisterIdlPatched } from "../test/src/utils/pocket-ic";

async function getAgent(): Promise<HttpAgent> {
  const host = process.env.DFX_NETWORK === 'ic' ? 'https://icp-api.io' : 'http://127.0.0.1:4943';
  const identityPemFilePath = process.env.IDENTITY_PEM_FILE!;
  const identity = Secp256k1KeyIdentity.fromPem(
    readFileSync(identityPemFilePath, {encoding: 'utf8'})
  )
  
  const agent = new HttpAgent({ host, identity: identity as Identity });
  if ( process.env.DFX_NETWORK !== 'ic' ) {
    await agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
  }

  return agent;
}

function exec(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    execCommand(cmd, {
      encoding: 'utf8',
    }, (err, stdout, stderr) => {
      if ( err ) reject(stderr);
      resolve(stdout.trim());
    });
  });
}

async function deployCanister(canisterName: string) {
  console.log(`Deploying ${canisterName}...`);
  const networkFlag = process.env.DFX_NETWORK === 'ic' ? '--ic' : '';
  await exec(`dfx deploy ${canisterName} ${networkFlag}`);
  const id = await exec(`dfx canister id ${canisterName} ${networkFlag}`);
  console.log(`Deployed ${canisterName} canister: ${id}`);

  return id;
}

async function buildCanister(canisterName: string) {
  console.log(`Building ${canisterName}...`);
  await exec(`dfx canister create ${canisterName}`);
  await exec(`dfx build ${canisterName}`);
  console.log(`Built ${canisterName} canister`);
}

async function getCanisterId(canisterName: string) {
  const networkFlag = process.env.DFX_NETWORK === 'ic' ? '--ic' : '';
  const id = await exec(`dfx canister id ${canisterName} ${networkFlag}`);
  return id;
}

async function addCanisterController(canisterName: string, principal: Principal) {
  const networkFlag = process.env.DFX_NETWORK === 'ic' ? '--ic' : '';
  await exec(`dfx canister update-settings --add-controller ${principal.toText()} ${canisterName} ${networkFlag}`);
}

async function main() {
  const agent = await getAgent();
  const provisionCanisterId = Principal.fromText(await deployCanister('provision'));
  const assetProxyCanisterId = Principal.fromText(await deployCanister('asset_proxy'));
  const tempAssetCanisterId = Principal.fromText(await deployCanister('asset'));
  await buildCanister("estate_dao_nft");

  const assetProxyActor = createAssetProxyActor(assetProxyCanisterId, { agent });
  const tempAssetActor = createAssetActor(tempAssetCanisterId, { agent });
  const provisionActor = createProvisionActor(provisionCanisterId, { agent });
  const managementActor: managementActor = Actor.createActor(managementCanisterIdlPatched, {
    canisterId: Principal.fromText('aaaaa-aa'),
    agent
  });

  await tempAssetActor.grant_permission({
    to_principal: assetProxyCanisterId,
    permission: {
      Commit: null
    }
  });

  console.log('Granted temp_asset write permission to asset_proxy.');

  await assetProxyActor.set_provision_canister(provisionCanisterId);
  await assetProxyActor.set_temp_asset_canister(tempAssetCanisterId);
  
  console.log('Set up done for asset_proxy canister.');

  const assetWasmChunks = await loadWasmChunksToCanister(managementActor, ASSET_CANISTER_WASM, provisionCanisterId);
  const tokenWasmChunks = await loadWasmChunksToCanister(managementActor, TOKEN_CANISTER_WASM, provisionCanisterId);
  
  console.log('Loaded wasm chunks in provision canister.');

  await provisionActor.set_asset_proxy_canister(assetProxyCanisterId);
  await addCanisterController('provision', provisionCanisterId);
  
  await provisionActor.set_asset_canister_wasm({
    moduleHash: await getModuleHash(ASSET_CANISTER_WASM),
    chunkHashes: assetWasmChunks
  });

  await provisionActor.set_token_canister_wasm({
    moduleHash: await getModuleHash(TOKEN_CANISTER_WASM),
    chunkHashes: tokenWasmChunks
  });

  console.log('Set up done for provision canister.');
}

main();
