import { None, Opt, Result, Some, Vec, ic, nat, text } from "azle";
import { PropertyMetadata } from "../types";
import { RequestStore } from "../store";
import { validatePropertyRequester } from "../validate";
import { iterableToArray } from "../../common/utils";

export function add_property_request(metadata: PropertyMetadata): Result<nat, text> {
  const caller = ic.caller();
  const validationResult = validatePropertyRequester(caller);
  if (validationResult.Err) return validationResult;

  const id = RequestStore.addRequest({
    ...metadata,
  }, caller);

  return Result.Ok(id);
}

export function get_request_metadata(id: nat): Opt<PropertyMetadata> {
  const metadata = RequestStore.metadata.get(id);
  if ( metadata ) return Some(metadata);
  return None;
}

// TODO: add pagination
export function get_pending_requests(): Vec<nat> {
  const ids = iterableToArray(RequestStore.metadata.keys());
  return ids;
}
