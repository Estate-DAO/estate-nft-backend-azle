import { ic } from "azle";
import { AdminStore } from "./store";

export function initImpl() {
  const controller = ic.caller();
  AdminStore.addAdmin(controller);
}
