import { None, Opt, Principal, Result, Some, Vec, bool, ic, nat, text } from "azle";
import { PropertyMetadata, RequestApprovalStatus } from "../types";
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

export function get_request_metadata(id: nat): Opt<PropertyMetadata> {
  const metadata = RequestStore.metadata.get(id);
  if (metadata) return Some(metadata);
  return None;
}

// TODO: add pagination
export function get_pending_requests(): Vec<nat> {
  const ids = iterableToArray(RequestStore.metadata.keys());
  return ids;
}

export async function approve_request(id: nat): Promise<Result<bool, text>> {
  const validationResult = validateAdmin(ic.caller());
  if (validationResult.Err) return validationResult;

  const requestConfig = RequestStore.config.get(id);
  const requestMetadata = RequestStore.metadata.get(id);
  if (!requestConfig || !requestMetadata) return Result.Err("No request exists with the given id.");
  if (requestConfig.approval_status !== RequestApprovalStatus.PENDING)
    return Result.Err("Request already processed.");

  const deployResult = await deploy_collection({
    ...requestMetadata,
    property_owner: Principal.fromText(requestConfig.property_owner),
  });
  if (isErr(deployResult)) return deployResult;

  RequestStore.approveRequest(id, deployResult.Ok.toString());
  return Result.Ok(true);
}

export function reject_request(id: nat): Result<bool, text> {
  const validationResult = validateAdmin(ic.caller());
  if (validationResult.Err) return validationResult;

  const requestConfig = RequestStore.config.get(id);
  if (!requestConfig) return Result.Err("No request exists with the given id.");
  if (requestConfig.approval_status !== RequestApprovalStatus.PENDING)
    return Result.Err("Request already processed.");

  RequestStore.rejectRequest(id);
  return Result.Ok(true);
}
