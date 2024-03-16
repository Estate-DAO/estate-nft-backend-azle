import { Opt, bool, nat, text } from "azle";
import { MetadataStore } from "./state";
import { toOpt } from "./utils";
import { MetadataResponse } from "./types";

export function icrc7_symbol(): text {
  return MetadataStore.symbol;
}

export function icrc7_name(): text {
  return MetadataStore.name;
}

export function icrc7_description(): Opt<text> {
  return toOpt(MetadataStore.description);
}

export function icrc7_logo(): Opt<text> {
  return toOpt(MetadataStore.logo);
}

export function icrc7_total_supply(): nat {
  return MetadataStore.total_supply;
}

export function icrc7_supply_cap(): Opt<nat> {
  return toOpt(MetadataStore.supply_cap);
}

export function icrc7_max_query_batch_size(): Opt<nat> {
  return toOpt(MetadataStore.max_query_batch_size);
}

export function icrc7_max_update_batch_size(): Opt<nat> {
  return toOpt(MetadataStore.max_update_batch_size);
}

export function icrc7_max_default_take_value(): Opt<nat> {
  return toOpt(MetadataStore.default_take_value);
}

export function icrc7_max_take_value(): Opt<nat> {
  return toOpt(MetadataStore.max_take_value);
}

export function icrc7_max_memo_size(): Opt<nat> {
  return toOpt(MetadataStore.max_memo_size);
}

export function icrc7_atomic_batch_transfers(): Opt<bool> {
  return toOpt(MetadataStore.atomic_batch_transfers);
}

export function icrc7_tx_window(): Opt<nat> {
  return toOpt(MetadataStore.tx_window);
}

export function icrc7_permitted_drift(): Opt<nat> {
  return toOpt(MetadataStore.permitted_drift);
}

export function icrc7_collection_metadata(): MetadataResponse {
  const metadata: MetadataResponse = [];

  metadata.push(["icrc7:name", { Text: MetadataStore.name }]);
  metadata.push(["icrc7:symbol", { Text: MetadataStore.symbol }]);
  metadata.push(["icrc7:total_supply", { Nat: MetadataStore.total_supply }]);

  if (MetadataStore.description) metadata.push(["icrc7:description", { Text: MetadataStore.description }]);
  if (MetadataStore.logo) metadata.push(["icrc7:logo", { Text: MetadataStore.logo }]);

  return metadata;
}
