import { None, Opt, Principal, Result, Some, Vec, bool, ic, nat, text } from "azle";
import { PropertyMetadata, RequestInfo } from "../types";
import { RequestStore } from "../store";
import { validateAdmin, validatePropertyRequester } from "../validate";
import { isErr, isOk, iterableToArray } from "../../common/utils";
import { deploy_collection } from "../token";

export function add_property_request(metadata: PropertyMetadata): Result<nat, text> {
  const caller = ic.caller();
  const validationResult = validatePropertyRequester(caller);
  if (validationResult.Err) return validationResult;

  const id = RequestStore.addRequest(
    {
      ...metadata,
    },
    caller,
  );

  return Result.Ok(id);
}

// TODO: add pagination
export function get_pending_requests(): Vec<nat> {
  const ids = iterableToArray(RequestStore.metadata.keys());
  return ids;
}

export function get_request_info(id: nat): Opt<RequestInfo> {
  const requestMetadata = RequestStore.metadata.get(id);
  const requestConfig = RequestStore.config.get(id);
  if ( !requestConfig ) return None;
  
  const requestInfo: RequestInfo = {
    metadata: (
      requestMetadata ? Some(requestMetadata) : None
    ),
    ...requestConfig
  }

  return Some(requestInfo);
}

export async function approve_request(id: nat): Promise<Result<bool, text>> {
  const validationResult = validateAdmin(ic.caller());
  if (validationResult.Err) return validationResult;

  const requestConfig = RequestStore.config.get(id);
  const requestMetadata = RequestStore.metadata.get(id);

  if (!requestConfig || !requestMetadata)
    return Result.Err("No request exists with the given id.");
  
  if (requestConfig.approval_status.Pending !== undefined)
    return Result.Err("Request already processed.");

  const deployResult = await deploy_collection({
    ...requestMetadata,
    property_owner: requestConfig.property_owner,
  });
  if (isErr(deployResult)) return deployResult;

  RequestStore.approveRequest(id, deployResult.Ok);
  return Result.Ok(true);
}

export function reject_request(id: nat): Result<bool, text> {
  const validationResult = validateAdmin(ic.caller());
  if (validationResult.Err) return validationResult;

  const requestConfig = RequestStore.config.get(id);
  if (!requestConfig) return Result.Err("No request exists with the given id.");
  if (requestConfig.approval_status.Pending !== undefined)
    return Result.Err("Request already processed.");

  RequestStore.rejectRequest(id);
  return Result.Ok(true);
}
