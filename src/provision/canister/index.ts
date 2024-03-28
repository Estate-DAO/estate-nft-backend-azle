import { Result, blob, bool, ic, text } from "azle";
import { managementCanister } from "azle/canisters/management";
import { WasmStore } from "../store";
import { validateControllerPermissions } from "../validate";

export async function deploy_collection(): Promise<Result<text, text>> {
  const { canister_id } = await ic.call(
    managementCanister.create_canister,
    {
      args: [{
        settings: {
          Some: {
            controllers: { Some: [ic.id()] },
            compute_allocation: { None: null },
            memory_allocation: { None: null },
            freezing_threshold: { None: null },
            reserved_cycles_limit: { None: null },
          }
        },
        sender_canister_version: { None: null }
      }],
      cycles: 1_000_000_000_0000n,
    }
  );

  await ic.call(
    managementCanister.deposit_cycles,
    {
      args: [{
        canister_id
      }],
      cycles: 1_000_000_000_0000n,
    }
  );

  await ic.call(
    managementCanister.install_code,
    {
      args: [{
        mode: {
          install: null
        },
        canister_id,
        wasm_module: WasmStore.tokenCanisterWasm,
        arg: new Uint8Array(),
        sender_canister_version: { None: null }
      }],
      cycles: 1_000_000_000_0000n,
    }
  );

  return Result.Ok(canister_id.toString());
}

export function set_token_canister_wasm(wasm: blob): Result<bool, text> {
  const validationResult = validateControllerPermissions();
  if ( !validationResult.Ok ) return validationResult;

  WasmStore.updateTokenCanisterWasm(wasm);
  return Result.Ok(true);
}

export function get_token_canister_wasm(): blob {
  return WasmStore.tokenCanisterWasm;
}