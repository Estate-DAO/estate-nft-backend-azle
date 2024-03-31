import { Opt, Principal, Result, bool, ic, text } from "azle";
import { AdminStore } from "../store";
import { validateAdmin } from "../validate";

export function is_admin(principal: Opt<Principal>): bool {
  const user = (principal.Some ?? ic.caller()).toString();
  return !!AdminStore.admins.get(user);
}

export function add_admin(principal: Principal): Result<bool, text> {
  const validationResult = validateAdmin(ic.caller());
  if ( validationResult.Err ) return validationResult;

  AdminStore.addAdmin(principal.toString());
  return Result.Ok(true);
}