import path from "path";
import { IDL } from "@dfinity/candid";
import { Actor, CanisterFixture, PocketIc, SetupCanisterOptions } from "@hadronous/pic";
import { Principal } from "@dfinity/principal";
import * as estateDaoNft from "../../dfx_generated/estate_dao_nft/estate_dao_nft.did.js";
import * as provision from "../../dfx_generated/provision/provision.did.js";
import * as asset from "../../dfx_generated/asset/asset.did.js";
import * as assetProxy from "../../dfx_generated/asset_proxy/asset_proxy.did.js";
import { SamplePropertyInit } from "./sample";
import { ActorMethod, ManagementCanisterRecord } from "@dfinity/agent";
import managementCanisterIdl from "@dfinity/agent/lib/cjs/canisters/management_idl.js";
import { InterfaceFactory } from "@dfinity/candid/lib/cjs/idl.js";

export const managementCanisterIdlPatched: InterfaceFactory = ({ IDL }) => (
  IDL.Service({
    ...(managementCanisterIdl({ IDL }) as IDL.ServiceClass)
        ._fields
        .reduce((acc, curr) => {
          acc[curr[0]] = curr[1];
          return acc;
        }, {} as any),
    upload_chunk: IDL.Func([
      IDL.Record({
          chunk: IDL.Vec(IDL.Nat8),
          canister_id: IDL.Principal,
      }),
    ], [], []),
  })
);

function createPocketIcInstance(): Promise<PocketIc> {
  if (process.env.DEBUG) return PocketIc.createFromUrl("http://localhost:7000");
  return PocketIc.create();
}

async function deployCanister<_SERVICE>(
  instance: PocketIc,
  idlFactory: IDL.InterfaceFactory,
  wasm: string,
  initArgs: ArrayBufferLike,
  args?: Partial<SetupCanisterOptions>,
) {
  return await instance.setupCanister<_SERVICE>({
    ...(args ?? {}),
    idlFactory,
    wasm,
    cycles: 10_000_000_000_000n,
    arg: initArgs,
  });
}

export function initTestSuite() {
  let instance: PocketIc;

  const deployProvisionCanister = async (args?: Partial<SetupCanisterOptions>) => {
    return deployCanister<provision._SERVICE>(
      instance,
      provision.idlFactory,
      path.resolve(".azle", "provision", "provision.wasm.gz"),
      IDL.encode(provision.init({ IDL }), []),
      args,
    );
  };

  const deployAssetCanister = async (args?: Partial<SetupCanisterOptions>) => {
    return deployCanister<asset._SERVICE>(
      instance,
      asset.idlFactory,
      path.resolve("test", "asset-canister", "assetstorage.wasm.gz"),
      IDL.encode(asset.init({ IDL }), [[{ Init: {} }]]),
      args,
    );
  };

  const deployAssetProxyCanister = async (args?: Partial<SetupCanisterOptions>) => {
    return deployCanister<assetProxy._SERVICE>(
      instance,
      assetProxy.idlFactory,
      path.resolve(".azle", "asset_proxy", "asset_proxy.wasm.gz"),
      IDL.encode(assetProxy.init({ IDL }), []),
      args,
    );
  };

  const deployEstateDaoNftCanister = async (
    initArgs: any,
    args?: Partial<SetupCanisterOptions>,
  ) => {
    const initMetadata = {
      ...SamplePropertyInit,
      name: "EstateDaoNFT",
      symbol: "EST",
      logo: "http://estatedao.org/test-image.png",
      ...initArgs,
    };

    return deployCanister<estateDaoNft._SERVICE>(
      instance,
      estateDaoNft.idlFactory,
      path.resolve(".azle", "estate_dao_nft", "estate_dao_nft.wasm.gz"),
      IDL.encode(estateDaoNft.init({ IDL }), [initMetadata]),
      args,
    );
  };

  const setup = async () => {
    instance = await createPocketIcInstance();
  };

  const teardown = async () => {
    await instance?.tearDown();
  };

  const attachToTokenCanister = (principal: Principal): estateDaoActor => {
    return instance.createActor(estateDaoNft.idlFactory, principal);
  };

  const attachToAssetCanister = (principal: Principal): assetActor => {
    return instance.createActor(asset.idlFactory, principal);
  };

  const attachToManagementCanister = (): managementActor => {
    return instance.createActor(managementCanisterIdlPatched, Principal.fromText("aaaaa-aa"));
  }

  const getInstance = (): PocketIc => {
    return instance;
  }

  return {
    getInstance,
    setup,
    teardown,
    deployProvisionCanister,
    deployEstateDaoNftCanister,
    deployAssetCanister,
    deployAssetProxyCanister,
    attachToTokenCanister,
    attachToAssetCanister,
    attachToManagementCanister,
  };
}

export type estateDaoFixture = CanisterFixture<estateDaoNft._SERVICE>;
export type estateDaoActor = Actor<estateDaoNft._SERVICE>;
export type provisionFixture = CanisterFixture<provision._SERVICE>;
export type provisionActor = Actor<provision._SERVICE>;
export type assetFixture = CanisterFixture<asset._SERVICE>;
export type assetActor = Actor<asset._SERVICE>;
export type assetProxyFixture = CanisterFixture<assetProxy._SERVICE>;
export type assetProxyActor = Actor<assetProxy._SERVICE>;
export type managementFixture = CanisterFixture<ManagementCanisterRecord>;
export type managementActor = Actor<Omit<ManagementCanisterRecord, 'upload_chunk'> & {
  upload_chunk: ActorMethod<[{
    chunk: Uint8Array | number[];
    canister_id: Principal;
  }], undefined>
}>;
