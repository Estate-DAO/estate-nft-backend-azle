import { bool, Canister, init, nat, Opt, query, text } from "azle";
import {
  icrc7_symbol,
  icrc7_name,
  icrc7_description,
  icrc7_logo,
  icrc7_total_supply,
  icrc7_supply_cap,
  icrc7_max_query_batch_size,
  icrc7_max_update_batch_size,
  icrc7_max_default_take_value,
  icrc7_max_take_value,
  icrc7_max_memo_size,
  icrc7_atomic_batch_transfers,
  icrc7_tx_window,
  icrc7_permitted_drift,
  icrc7_collection_metadata,
} from "./icrc7";
import { CollectionMetadata, InitArgs } from "./types";
import { init_collection } from "./state";

export default Canister({
  init: init([InitArgs], init_collection),

  icrc7_symbol: query([], text, icrc7_symbol),
  icrc7_name: query([], text, icrc7_name),
  icrc7_description: query([], Opt(text), icrc7_description),
  icrc7_logo: query([], Opt(text), icrc7_logo),
  icrc7_total_supply: query([], nat, icrc7_total_supply),
  icrc7_supply_cap: query([], Opt(nat), icrc7_supply_cap),

  icrc7_max_query_batch_size: query([], Opt(nat), icrc7_max_query_batch_size),
  icrc7_max_update_batch_size: query([], Opt(nat), icrc7_max_update_batch_size),
  icrc7_max_default_take_value: query([], Opt(nat), icrc7_max_default_take_value),
  icrc7_max_take_value: query([], Opt(nat), icrc7_max_take_value),
  icrc7_max_memo_size: query([], Opt(nat), icrc7_max_memo_size),
  icrc7_atomic_batch_transfers: query([], Opt(bool), icrc7_atomic_batch_transfers),
  icrc7_tx_window: query([], Opt(nat), icrc7_tx_window),
  icrc7_permitted_drift: query([], Opt(nat), icrc7_permitted_drift),

  icrc7_collection_metadata: query([], CollectionMetadata, icrc7_collection_metadata),
});
