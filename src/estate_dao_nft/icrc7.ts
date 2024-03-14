import { Opt, bool, nat, text } from "azle";
import { Metadata } from "./state";
import { toOpt } from "./utils";
import { CollectionMetadata } from "./types";

export function icrc7_symbol(): text {
  return Metadata.symbol;
}

export function icrc7_name(): text {
  return Metadata.name;
}

export function icrc7_description(): Opt<text> {
  return toOpt(Metadata.description);
}

export function icrc7_logo(): Opt<text> {
  return toOpt(Metadata.logo);
}

export function icrc7_total_supply(): nat {
  return Metadata.total_supply;
}

export function icrc7_supply_cap(): Opt<nat> {
  return toOpt(Metadata.supply_cap);
}

export function icrc7_max_query_batch_size(): Opt<nat> {
  return toOpt(Metadata.max_query_batch_size);
}

export function icrc7_max_update_batch_size(): Opt<nat> {
  return toOpt(Metadata.max_update_batch_size);
}

export function icrc7_max_default_take_value(): Opt<nat> {
  return toOpt(Metadata.default_take_value);
}

export function icrc7_max_take_value(): Opt<nat> {
  return toOpt(Metadata.max_take_value);
}

export function icrc7_max_memo_size(): Opt<nat> {
  return toOpt(Metadata.max_memo_size);
}

export function icrc7_atomic_batch_transfers(): Opt<bool> {
  return toOpt(Metadata.atomic_batch_transfers);
}

export function icrc7_tx_window(): Opt<nat> {
  return toOpt(Metadata.tx_window);
}

export function icrc7_permitted_drift(): Opt<nat> {
  return toOpt(Metadata.permitted_drift);
}

export function icrc7_collection_metadata(): CollectionMetadata {
  const metadata: CollectionMetadata = [];

  metadata.push(["icrc7:name", { Text: Metadata.name }]);
  metadata.push(["icrc7:symbol", { Text: Metadata.symbol }]);
  metadata.push(["icrc7:total_supply", { Nat: Metadata.total_supply }]);

  if (Metadata.description) metadata.push(["icrc7:description", { Text: Metadata.description }]);
  if (Metadata.logo) metadata.push(["icrc7:logo", { Text: Metadata.logo }]);

  return metadata;
}
