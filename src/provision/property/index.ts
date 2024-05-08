import { Opt, Vec, nat } from "azle";
import { iterableToArray } from "../../common/utils";
import { RequestStore } from "../store";
import { ListPropertiesResult } from "../types";

export function list_properties(): Vec<ListPropertiesResult> {
  return iterableToArray(RequestStore.config.entries())
    .filter(([id, config]) => !!config.token_canister.Some)
    .map(([id, config]) => ({
      id,
      token_canister: config.token_canister.Some!,
      asset_canister: config.asset_canister.Some!,
    }));
}
