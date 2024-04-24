import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { exec as execCommand } from "child_process";
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import { readFileSync } from "fs";
import { createActor as createAssetProxyActor } from "../test/dfx_generated/asset_proxy";
import { createActor as createAssetActor } from "../test/dfx_generated/asset";
import { createActor as createProvisionActor } from "../test/dfx_generated/provision";
import { Principal } from "@dfinity/principal";
import { configureCanisters } from "../test/src/utils/deploy";
import { managementIdl, managementService } from "../test/src/utils/canister";

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
  const managementCanisterId = Principal.fromText('aaaaa-aa');
  await buildCanister("estate_dao_nft");

  const assetProxyActor = createAssetProxyActor(assetProxyCanisterId, { agent });
  const tempAssetActor = createAssetActor(tempAssetCanisterId, { agent });
  const provisionActor = createProvisionActor(provisionCanisterId, { agent });
  const managementActor = Actor.createActor<managementService>(managementIdl, {
    canisterId: managementCanisterId,
    agent
  });

  await configureCanisters({
    provision: {
      canisterId: provisionCanisterId,
      actor: provisionActor
    },
    assetProxy: {
      canisterId: assetProxyCanisterId,
      actor: assetProxyActor
    },
    tempAsset: {
      canisterId: tempAssetCanisterId ,
      actor: tempAssetActor
    },
    management: {
      canisterId: managementCanisterId,
      actor: managementActor
    },
  });
}

main();
