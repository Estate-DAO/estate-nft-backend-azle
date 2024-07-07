import { Principal } from "azle";
import LedgerIndex from "../icp_ledger_index/index";

export const TRANSFER_FEE = 10_000n;

export function getTokenLedger(principal: Principal) {
  return LedgerIndex(principal);
}
