import path from "path";
import { IDL } from "@dfinity/candid";
import {
  Actor,
  CanisterFixture,
  CreateInstanceOptions,
  PocketIc,
  PocketIcServer,
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
  icpLedgerInit,
  icpLedgerService,
  managementIdl,
  managementService,
  provisionIdl,
  provisionInit,
  provisionService,
} from "./canister";
import { AccountIdentifier } from "@dfinity/ledger-icp";

type PocketIcInstance = {
  instance: PocketIc;
  server: PocketIcServer;
};

async function createPocketIcInstance(options?: CreateInstanceOptions): Promise<PocketIcInstance> {
  const server = await PocketIcServer.start(
    process.env.DEBUG ?
    {
      showCanisterLogs: true,
      showRuntimeLogs: true,
    } :
    {}
  );

  return {
    instance: await PocketIc.create(server.getUrl(), options),
    server
  };
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
  let pic: PocketIcInstance;

  const deployProvisionCanister = async (args?: Partial<SetupCanisterOptions>) => {
    return deployCanister<provisionService>(
      pic.instance,
      provisionIdl,
      path.resolve(".azle", "provision", "provision.wasm.gz"),
      IDL.encode(provisionInit({ IDL }), [[]]),
      args,
    );
  };

  const deployAssetCanister = async (args?: Partial<SetupCanisterOptions>) => {
    return deployCanister<assetService>(
      pic.instance,
      assetIdl,
      path.resolve("test", "asset-canister", "assetstorage.wasm.gz"),
      IDL.encode(assetInit({ IDL }), [[{ Init: {} }]]),
      args,
    );
  };

  const deployAssetProxyCanister = async (args?: Partial<SetupCanisterOptions>) => {
    return deployCanister<assetProxyService>(
      pic.instance,
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
      pic.instance,
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
      pic.instance,
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

  const setup = async (options?: CreateInstanceOptions) => {
    pic = await createPocketIcInstance(options);
  };

  const teardown = async () => {
    await pic.instance.tearDown();
    await pic.server.stop();
  };

  const attachToTokenCanister = (principal: Principal): estateDaoActor => {
    return pic.instance.createActor(estateDaoNftIdl, principal);
  };

  const attachToAssetCanister = (principal: Principal): assetActor => {
    return pic.instance.createActor(assetIdl, principal);
  };

  const attachToManagementCanister = (): managementActor => {
    return pic.instance.createActor(managementIdl, Principal.fromText("aaaaa-aa"));
  };

  const attachToIcpLedgerCanister = (principal: Principal): icpLedgerActor => {
    return pic.instance.createActor(icpLedgerIdl, principal);
  };

  const getInstance = (): PocketIc => {
    return pic.instance;
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
