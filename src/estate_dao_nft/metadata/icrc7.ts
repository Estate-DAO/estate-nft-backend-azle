import { Opt, bool, nat, text } from "azle";
import { MetadataStore } from "../store";
import { toOpt } from "../utils";
import { MetadataResult } from "../types";

export function icrc7_symbol(): text {
  return MetadataStore.store.symbol;
}

export function icrc7_name(): text {
  return MetadataStore.store.name;
}

export function icrc7_description(): Opt<text> {
  return toOpt(MetadataStore.store.description);
}

export function icrc7_logo(): Opt<text> {
  return toOpt(MetadataStore.store.logo);
}

export function icrc7_total_supply(): nat {
  return MetadataStore.store.total_supply;
}

export function icrc7_supply_cap(): Opt<nat> {
  return toOpt(MetadataStore.store.supply_cap);
}

export function icrc7_max_query_batch_size(): Opt<nat> {
  return toOpt(MetadataStore.store.max_query_batch_size);
}

export function icrc7_max_update_batch_size(): Opt<nat> {
  return toOpt(MetadataStore.store.max_update_batch_size);
}

export function icrc7_max_default_take_value(): Opt<nat> {
  return toOpt(MetadataStore.store.default_take_value);
}

export function icrc7_max_take_value(): Opt<nat> {
  return toOpt(MetadataStore.store.max_take_value);
}

export function icrc7_max_memo_size(): Opt<nat> {
  return toOpt(MetadataStore.store.max_memo_size);
}

export function icrc7_atomic_batch_transfers(): Opt<bool> {
  return toOpt(MetadataStore.store.atomic_batch_transfers);
}

export function icrc7_tx_window(): Opt<nat> {
  return toOpt(MetadataStore.store.tx_window);
}

export function icrc7_permitted_drift(): Opt<nat> {
  return toOpt(MetadataStore.store.permitted_drift);
}

export function icrc7_collection_metadata(): MetadataResult {
  const metadata: MetadataResult = [];

  metadata.push(["icrc7:name", { Text: MetadataStore.store.name }]);
  metadata.push(["icrc7:symbol", { Text: MetadataStore.store.symbol }]);
  metadata.push(["icrc7:total_supply", { Nat: MetadataStore.store.total_supply }]);

  if (MetadataStore.store.description)
    metadata.push(["icrc7:description", { Text: MetadataStore.store.description }]);
  
  if (MetadataStore.store.logo)
    metadata.push(["icrc7:logo", { Text: MetadataStore.store.logo }]);

  metadata.push(["estate_dao:property_owner", { Text: MetadataStore.store.property_owner }]);

  return metadata;
}
