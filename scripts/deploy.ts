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
import { buildCanister, deployCanister, getAgent, getCanisterId } from "./common";

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
    effectiveCanisterId: provisionCanisterId,
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
  }, await agent.getPrincipal());

  console.log("Canister configuration success.");
}

main();
