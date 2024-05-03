import { Principal, Result, bool, text } from "azle";

export function validateInvestor(id: Principal): Result<bool, text> {
  if (id.isAnonymous()) return Result.Err("Anonymous users not allowed");
  return Result.Ok(true);
}