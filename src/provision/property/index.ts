import { Opt, Vec, nat } from "azle";
import { PropertyStatus } from "../types";
import { get_pending_requests } from "../request";
import { iterableToArray } from "../../common/utils";
import { RequestStore } from "../store";

export function list_properties(status: Opt<PropertyStatus>): Vec<nat> {
  const filter_status = status.Some ?? PropertyStatus.Published;

  if ("Draft" in filter_status) {
    return get_pending_requests();
  } else {
    // Published
    return iterableToArray(RequestStore.config.entries())
      .filter(([id, config]) => !!config.token_canister.Some)
      .map(([id, config]) => id);
  }
}
