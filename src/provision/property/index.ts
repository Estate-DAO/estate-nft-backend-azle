import { Opt, Result, Vec, bool, ic, nat, text } from "azle";
import { iterableToArray } from "../../common/utils";
import { RequestStore } from "../store";
import { ListPropertiesResult } from "../types";
import { validateController } from "../validate";
import { delete_canister } from "../canister/common";

export function list_properties(): Vec<ListPropertiesResult> {
  return iterableToArray(RequestStore.config.entries())
    .filter(([id, config]) => !!config.token_canister.Some)
    .map(([id, config]) => ({
      id,
      token_canister: config.token_canister.Some!,
      asset_canister: config.asset_canister.Some!,
    }));
}

export async function delete_property(requestId: nat): Promise<Result<bool, text>> {
  const validationResult = validateController(ic.caller());
  if ( validationResult.Err ) return validationResult;

  const collectionConfig = RequestStore.config.get(requestId);
  if ( !collectionConfig ) return Result.Err("No collection exists with given id");
  if ( collectionConfig.approval_status.Pending !== undefined ) return Result.Err("Collection hasn't received admin approval.");

  if ( collectionConfig.approval_status.Approved !== undefined ) {
    let res = await delete_canister(collectionConfig.token_canister.Some!);
    if ( res.Err ) return res;

    res = await delete_canister(collectionConfig.asset_canister.Some!);
    if ( res.Err ) return res;
  }

  RequestStore.deleteRequest(requestId);
  return Result.Ok(true);
}