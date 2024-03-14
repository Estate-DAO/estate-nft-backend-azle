import { Opt, bool, nat, text } from "azle";
import { ICRC7MetadataStore } from "./state";
import { convertToOpt } from "./utils";

export function icrc7_symbol(): text {
  return ICRC7MetadataStore.symbol;
}

export function icrc7_name(): text {
  return ICRC7MetadataStore.name;
}

export function icrc7_description(): Opt<text> {
  return convertToOpt(ICRC7MetadataStore.description);
}

export function icrc7_logo(): Opt<text> {
  return convertToOpt(ICRC7MetadataStore.logo);
}

export function icrc7_total_supply(): nat {
  return ICRC7MetadataStore.total_supply;
}

export function icrc7_supply_cap(): Opt<nat> {
  return convertToOpt(ICRC7MetadataStore.supply_cap);
}

export function icrc7_max_query_batch_size(): Opt<nat> {
  return convertToOpt(ICRC7MetadataStore.max_query_batch_size);
}

export function icrc7_max_update_batch_size(): Opt<nat> {
  return convertToOpt(ICRC7MetadataStore.max_update_batch_size);
}

export function icrc7_max_default_take_value(): Opt<nat> {
  return convertToOpt(ICRC7MetadataStore.default_take_value);
}

export function icrc7_max_take_value(): Opt<nat> {
  return convertToOpt(ICRC7MetadataStore.max_take_value);
}

export function icrc7_max_memo_size(): Opt<nat> {
  return convertToOpt(ICRC7MetadataStore.max_memo_size);
}

export function icrc7_atomic_batch_transfers(): Opt<bool> {
  return convertToOpt(ICRC7MetadataStore.atomic_batch_transfers);
}

export function icrc7_tx_window(): Opt<nat> {
  return convertToOpt(ICRC7MetadataStore.tx_window);
}

export function icrc7_permitted_drift(): Opt<nat> {
  return convertToOpt(ICRC7MetadataStore.permitted_drift);
}
