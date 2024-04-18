import { Principal } from "azle";
import managementCanister from "../management/index";

export const managementCanisterExtended = managementCanister(Principal.fromText('aaaaa-aa'));