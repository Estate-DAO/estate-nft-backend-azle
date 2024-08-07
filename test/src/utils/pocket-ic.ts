import path from "path";
import { IDL } from "@dfinity/candid";
import {
  Actor,
  CanisterFixture,
  CreateInstanceOptions,
  PocketIc,
  SetupCanisterOptions,
} from "@hadronous/pic";
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
  icpLedgerIdl,
  icpLedgerIndexIdl,
  icpLedgerIndexInit,
  icpLedgerIndexService,
  icpLedgerInit,
  icpLedgerService,
  managementIdl,
  managementService,
  provisionIdl,
  provisionInit,
  provisionService,
} from "./canister";
import { AccountIdentifier } from "@dfinity/ledger-icp";

function createPocketIcInstance(options?: CreateInstanceOptions): Promise<PocketIc> {
  if (process.env.DEBUG) return PocketIc.createFromUrl("http://localhost:7001", options);
  return PocketIc.create(options);
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
      IDL.encode(provisionInit({ IDL }), [[]]),
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
      IDL.encode(assetProxyInit({ IDL }), [[]]),
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
      IDL.encode(estateDaoNftInit({ IDL }), [{ Init: initMetadata }]),
      args,
    );
  };

  const deployIcpLedgerCanister = async (
    minterPrincipal: Principal,
    args?: Partial<SetupCanisterOptions>,
  ) => {
    return deployCanister<icpLedgerService>(
      instance,
      icpLedgerIdl,
      path.resolve("test", "ledger-canister", "ledger.wasm.gz"),
      IDL.encode(icpLedgerInit({ IDL }), [
        {
          Init: {
            send_whitelist: [],
            token_symbol: [],
            transfer_fee: [],
            minting_account: AccountIdentifier.fromPrincipal({
              principal: minterPrincipal,
            }).toHex(),
            maximum_number_of_accounts: [],
            accounts_overflow_trim_quantity: [],
            transaction_window: [],
            max_message_size_bytes: [],
            icrc1_minting_account: [
              {
                owner: minterPrincipal,
                subaccount: [],
              },
            ],
            archive_options: [],
            initial_values: [],
            token_name: [],
            feature_flags: [],
          },
        },
      ]),
      args,
    );
  };

  const deployIcpLedgerIndexCanister = async (
    ledgerPrincipal: Principal,
    args?: Partial<SetupCanisterOptions>,
  ) => {
    return deployCanister<icpLedgerIndexService>(
      instance,
      icpLedgerIndexIdl,
      path.resolve("test", "index-canister", "index.wasm.gz"),
      IDL.encode(icpLedgerIndexInit({ IDL }), [
        {
          ledger_id: ledgerPrincipal,
        },
      ]),
      args,
    );
  };

  const setup = async (options?: CreateInstanceOptions) => {
    instance = await createPocketIcInstance(options);
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

  const attachToIcpLedgerCanister = (principal: Principal): icpLedgerActor => {
    return instance.createActor(icpLedgerIdl, principal);
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
    deployIcpLedgerCanister,
    deployIcpLedgerIndexCanister,
    attachToTokenCanister,
    attachToAssetCanister,
    attachToManagementCanister,
    attachToIcpLedgerCanister,
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
export type icpLedgerActor = Actor<icpLedgerService>;
export type icpLedgerFixture = CanisterFixture<icpLedgerService>;
export type icpLedgerIndexActor = Actor<icpLedgerIndexService>;
export type icpLedgerIndexFixture = CanisterFixture<icpLedgerIndexService>;
