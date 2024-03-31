import { Principal, Result, bool, ic, nat64, text } from "azle";
import { RequestStore } from "./store";

export function validateController(id: Principal): Result<bool, text> {
  if (!ic.isController(id)) return Result.Err("Only controllers are allowed");
  return Result.Ok(true);
}

export function validatePropertyRequester(id: Principal): Result<bool, text> {
  if (id.isAnonymous()) return Result.Err("Anonymous users not allowed");
  return Result.Ok(true);
}

export function validatePropertyOwner(id: Principal, propertyId: nat64): Result<bool, text> {
  const property = RequestStore.config.get(propertyId);

  if (!property) return Result.Err("Property does not exist");
  if (property.property_owner.toString() !== id.toString())
    return Result.Err("User is not the property owner");
  return Result.Ok(true);
}
