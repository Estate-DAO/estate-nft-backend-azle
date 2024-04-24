import path from "path";
import { IDL } from "@dfinity/candid";
import { Actor, CanisterFixture, PocketIc, SetupCanisterOptions } from "@hadronous/pic";
import { Principal } from "@dfinity/principal";
import { SamplePropertyInit } from "./sample";
import {
  assetIdl,
  assetInit,
  assetProxyIdl,
  assetProxyInit,
  assetProxyService,
  assetService,
  estateDaoNftIdl,
  estateDaoNftInit,
  estateDaoNftService,
  managementIdl,
  managementService,
  provisionIdl,
  provisionInit,
  provisionService,
} from "./canister";

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
    return deployCanister<provisionService>(
      instance,
      provisionIdl,
      path.resolve(".azle", "provision", "provision.wasm.gz"),
      IDL.encode(provisionInit({ IDL }), []),
      args,
    );
  };

  const deployAssetCanister = async (args?: Partial<SetupCanisterOptions>) => {
    return deployCanister<assetService>(
      instance,
      assetIdl,
      path.resolve("test", "asset-canister", "assetstorage.wasm.gz"),
      IDL.encode(assetInit({ IDL }), [[{ Init: {} }]]),
      args,
    );
  };

  const deployAssetProxyCanister = async (args?: Partial<SetupCanisterOptions>) => {
    return deployCanister<assetProxyService>(
      instance,
      assetProxyIdl,
      path.resolve(".azle", "asset_proxy", "asset_proxy.wasm.gz"),
      IDL.encode(assetProxyInit({ IDL }), []),
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

    return deployCanister<estateDaoNftService>(
      instance,
      estateDaoNftIdl,
      path.resolve(".azle", "estate_dao_nft", "estate_dao_nft.wasm.gz"),
      IDL.encode(estateDaoNftInit({ IDL }), [initMetadata]),
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
    return instance.createActor(estateDaoNftIdl, principal);
  };

  const attachToAssetCanister = (principal: Principal): assetActor => {
    return instance.createActor(assetIdl, principal);
  };

  const attachToManagementCanister = (): managementActor => {
    return instance.createActor(managementIdl, Principal.fromText("aaaaa-aa"));
  };

  const getInstance = (): PocketIc => {
    return instance;
  };

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

export type estateDaoFixture = CanisterFixture<estateDaoNftService>;
export type estateDaoActor = Actor<estateDaoNftService>;
export type provisionFixture = CanisterFixture<provisionService>;
export type provisionActor = Actor<provisionService>;
export type assetFixture = CanisterFixture<assetService>;
export type assetActor = Actor<assetService>;
export type assetProxyFixture = CanisterFixture<assetProxyService>;
export type assetProxyActor = Actor<assetProxyService>;
export type managementFixture = CanisterFixture<managementService>;
export type managementActor = Actor<managementService>;
