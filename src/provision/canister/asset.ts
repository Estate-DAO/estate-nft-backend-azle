import { None, Principal, Result, Some, blob, bool, ic, text } from "azle";
import { managementCanister } from "azle/canisters/management";
import { AssetCanisterWasmStore } from "../store";
import { validateController } from "../validate";
import { AssetCanisterArgs } from "../types";
import { encode } from "azle/src/lib/candid/serde";

export async function deploy_asset(): Promise<Result<Principal, text>> {
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

  await ic.call(managementCanister.install_code, {
    args: [
      {
        mode: {
          install: null,
        },
        canister_id,
        wasm_module: AssetCanisterWasmStore.getWasm(),
        arg: encode(AssetCanisterArgs, { Init: {} }),
        sender_canister_version: None,
      },
    ],
  });

  return Result.Ok(canister_id);
}

export function set_asset_canister_wasm(wasm: blob): Result<bool, text> {
  const validationResult = validateController(ic.caller());
  if (!validationResult.Ok) return validationResult;

  AssetCanisterWasmStore.updateWasm(wasm);
  return Result.Ok(true);
}

export function get_asset_canister_wasm(): blob {
  return AssetCanisterWasmStore.getWasm();
}
