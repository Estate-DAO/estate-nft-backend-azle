import { None, Principal, Result, Some, blob, bool, ic, text } from "azle";
import { managementCanister } from "azle/canisters/management";
import { AssetCanisterWasmStore } from "../store";
import { validateController } from "../validate";
import { AssetCanisterArgs } from "../types";
import { encode } from "azle/src/lib/candid/serde";
import { getAssetCanister } from "../../common/utils";

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

export async function grant_asset_admin_perms(
  canister: Principal,
  user: Principal,
): Promise<Result<bool, text>> {
  await ic.call(getAssetCanister(canister).grant_permission, {
    args: [
      {
        to_principal: user,
        permission: {
          ManagePermissions: null,
        },
      },
    ],
  });

  return Result.Ok(true);
}

export async function grant_asset_edit_perms(
  canister: Principal,
  user: Principal,
): Promise<Result<bool, text>> {
  await ic.call(getAssetCanister(canister).grant_permission, {
    args: [
      {
        to_principal: user,
        permission: {
          Commit: null,
        },
      },
    ],
  });

  return Result.Ok(true);
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
