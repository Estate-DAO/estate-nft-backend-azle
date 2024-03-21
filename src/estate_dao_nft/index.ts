import { bool, Canister, init, nat, Opt, Principal, query, text, Vec } from "azle";
import { update } from "./utils";
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
  update_property_owner,
  update_collection_metadata,
  update_property_details,
  update_market_details,
  update_financial_details,
  get_property_metadata,
} from "./metadata";
import {
  MetadataResult,
  InitArg,
  Account,
  MintArg,
  TransferResult,
  BurnArg,
  TransferArg,
  ICRC61Standards,
  TxnResult,
  CollectionMetadataArg,
  PropertyDetailsArg,
  MarketDetailsArg,
  FinancialDetailsArg,
  PropertyMetadataResult,
} from "./types";
import { initImpl } from "./base";
import { icrc61_supported_standards } from "./icrc61";
import {
  burn,
  icrc7_balance_of,
  icrc7_owner_of,
  icrc7_token_metadata,
  icrc7_tokens,
  icrc7_tokens_of,
  icrc7_transfer,
  mint,
} from "./token";

export default Canister({
  init: init([InitArg], initImpl),

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

  icrc7_collection_metadata: query([], MetadataResult, icrc7_collection_metadata),
  icrc7_token_metadata: query([Vec(nat)], Vec(Opt(MetadataResult)), icrc7_token_metadata),

  icrc7_owner_of: query([Vec(nat)], Vec(Opt(Account)), icrc7_owner_of),
  icrc7_balance_of: query([Vec(Account)], Vec(nat), icrc7_balance_of),
  icrc7_tokens: query([Opt(nat), Opt(nat)], Vec(nat), icrc7_tokens),
  icrc7_tokens_of: query([Account, Opt(nat), Opt(nat)], Vec(nat), icrc7_tokens_of),
  mint: update([Vec(MintArg)], Vec(Opt(TransferResult)), mint),
  burn: update([Vec(BurnArg)], Vec(Opt(TransferResult)), burn),
  icrc7_transfer: update([Vec(TransferArg)], Vec(Opt(TransferResult)), icrc7_transfer),

  icrc61_supported_standards: query([], ICRC61Standards, icrc61_supported_standards),

  update_property_owner: update([Principal], TxnResult, update_property_owner),
  update_collection_metadata: update(
    [CollectionMetadataArg],
    TxnResult,
    update_collection_metadata,
  ),
  update_property_details: update([PropertyDetailsArg], TxnResult, update_property_details),
  update_market_details: update([MarketDetailsArg], TxnResult, update_market_details),
  update_financial_details: update([FinancialDetailsArg], TxnResult, update_financial_details),
  get_property_metadata: query([], PropertyMetadataResult, get_property_metadata),
});
