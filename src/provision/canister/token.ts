import { None, Principal, Result, Some, Vec, blob, bool, ic, text } from "azle";
import { managementCanister } from "azle/canisters/management";
import { TokenCanisterWasmStore } from "../store";
import { validateController } from "../validate";
import { encode } from "azle/src/lib/candid/serde";
import { CanisterArgs, InitArg } from "../../estate_dao_nft/types";
import { managementCanisterExtended } from "../../common/management";
import { WasmChunked } from "../types";

export async function deploy_token(args: InitArg): Promise<Result<Principal, text>> {
  const { canister_id } = await ic.call(managementCanister.create_canister, {
    args: [
      {
        settings: {
          Some: {
            controllers: Some([ic.id()]),
            compute_allocation: None,
            memory_allocation: None,
            freezing_threshold: None,
            reserved_cycles_limit: None,
          },
        },
        sender_canister_version: None,
      },
    ],
    cycles: 200_000_000_000n,
  });

  await ic.call(managementCanisterExtended.install_chunked_code, {
    args: [
      {
        mode: {
          install: null,
        },
        target_canister: canister_id,
        store_canister: Some(ic.id()),
        chunk_hashes_list: TokenCanisterWasmStore.wasm.chunkHashes,
        wasm_module_hash: TokenCanisterWasmStore.wasm.moduleHash,
        arg: encode(CanisterArgs, { Init: args }),
        sender_canister_version: None,
      },
    ],
  });

  return Result.Ok(canister_id);
}

export function set_token_canister_wasm(wasm: WasmChunked): Result<bool, text> {
  const validationResult = validateController(ic.caller());
  if (!validationResult.Ok) return validationResult;

  TokenCanisterWasmStore.store(wasm);
  return Result.Ok(true);
}

export function get_token_canister_wasm(): WasmChunked {
  return TokenCanisterWasmStore.wasm;
}
