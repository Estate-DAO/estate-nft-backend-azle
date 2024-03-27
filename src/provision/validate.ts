import { Result, bool, ic, text } from "azle";

export function validateControllerPermissions(): Result<bool, text> {  
  const caller = ic.caller();
  if (!ic.isController(caller)) return Result.Err("Unauthorized");
  
  return Result.Ok(true);
}