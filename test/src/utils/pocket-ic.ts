import path from "path";
import { IDL } from "@dfinity/candid";
import { Actor, PocketIc } from "@hadronous/pic";
import {
  idlFactory as estateDaoNftIdlFactory,
  init as estateDaoNftInit,
  _SERVICE as estateDaoNftService,
} from "../../dfx_generated/query/estate_dao_nft.did.js";
import { Principal } from "@dfinity/principal";

export function initPocketIc<_SERVICE>(
  idlFactory: IDL.InterfaceFactory,
  wasmPath: string,
  initArgs?: ArrayBufferLike,
) {
  let instance: PocketIc;

  const setup = async () => {
    instance = await PocketIc.create();
    const fixture = await instance.setupCanister<_SERVICE>({
      idlFactory,
      wasm: wasmPath,
      cycles: 100_000_000_000_000n,
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
  property_owner: Principal.anonymous()
};

export function initEstateDaoNft(initArgs: any[] = [{}]) {
  const initMetadata = {
    ...estateDaoNftInitMetadata,
    ...initArgs[0],
  }

  const wasm = path.resolve(".azle", "estate_dao_nft", "estate_dao_nft.wasm.gz");
  return initPocketIc<estateDaoNftService>(
    estateDaoNftIdlFactory,
    wasm,
    IDL.encode(estateDaoNftInit({ IDL }), [initMetadata]),
  );
}
export type estateDaoActor = Actor<estateDaoNftService>;
