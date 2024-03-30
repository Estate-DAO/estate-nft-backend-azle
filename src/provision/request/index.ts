import { Opt, Result, ic, nat64, text } from "azle";
import { FormMetadata } from "../types";
import { RequestStore } from "../store";
import { validatePropertyRequester } from "../validate";

export function add_property_request(form: FormMetadata): Result<nat64, text> {
  const caller = ic.caller();
  const validationResult = validatePropertyRequester(caller);
  if (validationResult.Err) return validationResult;

  const id = RequestStore.addRequest({
    ...form,
    property_owner: caller,
  });

  return Result.Ok(id);
}

