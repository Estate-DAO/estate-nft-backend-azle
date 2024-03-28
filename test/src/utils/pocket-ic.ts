import path from "path";
import { IDL } from "@dfinity/candid";
import { Actor, PocketIc } from "@hadronous/pic";
import {
  idlFactory as estateDaoNftIdlFactory,
  init as estateDaoNftInit,
  _SERVICE as estateDaoNftService,
} from "../../dfx_generated/estate_dao_nft/estate_dao_nft.did.js";
import { Principal } from "@dfinity/principal";
import {
  idlFactory as provisionIdlFactory,
  init as provisionInit,
  _SERVICE as provisionService,
} from "../../dfx_generated/provision/provision.did.js";

function createPocketIcInstance(): Promise<PocketIc> {
  if ( process.env.DEBUG )
    return PocketIc.createFromUrl('http://localhost:7000');
  return PocketIc.create();
}

export function initPocketIc<_SERVICE>(
  idlFactory: IDL.InterfaceFactory,
  wasmPath: string,
  initArgs?: ArrayBufferLike,
) {
  let instance: PocketIc;

  const setup = async () => {
    instance = await createPocketIcInstance();
    const fixture = await instance.setupCanister<_SERVICE>({
      idlFactory,
      wasm: wasmPath,
      cycles: 10_000_000_000_000n,
      arg: initArgs,
    });

    return fixture.actor;
  };

  const teardown = async () => {
    await instance?.tearDown();
  };

  return {
    setup,
    teardown,
  };
}

const estateDaoNftInitMetadata = {
  name: "EstateDaoNFT",
  symbol: "EST",
  logo: ["http://estatedao.org/test-image.png"],
  description: [],
  property_owner: Principal.anonymous(),
};

export function initEstateDaoNft(initArgs: any[] = [{}]) {
  const initMetadata = {
    ...estateDaoNftInitMetadata,
    ...initArgs[0],
  };

  const wasm = path.resolve(".azle", "estate_dao_nft", "estate_dao_nft.wasm.gz");
  return initPocketIc<estateDaoNftService>(
    estateDaoNftIdlFactory,
    wasm,
    IDL.encode(estateDaoNftInit({ IDL }), [initMetadata]),
  );
}
export type estateDaoActor = Actor<estateDaoNftService>;

export function initProvisionCanister() {
  const wasm = path.resolve(".azle", "provision", "provision.wasm.gz");
  return initPocketIc<provisionService>(
    provisionIdlFactory,
    wasm,
    IDL.encode(provisionInit({ IDL }), []),
  );
}
export type provisionActor = Actor<provisionService>;