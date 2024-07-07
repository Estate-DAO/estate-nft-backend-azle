import {
  Record,
  Principal,
  Opt,
  Variant,
  text,
  nat,
  Vec,
  Tuple,
  bool,
  nat32,
  float32,
  nat64,
  Null,
} from "azle";
import { Value } from "./common";
import { toOptionalSchema } from "../utils";

export const MetadataResult = Vec(Tuple(text, Value));
export type MetadataResult = typeof MetadataResult.tsType;

export const CollectionMetadataRaw = {
  symbol: text,
  name: text,
  description: text,
  logo: text,
  supply_cap: nat,
  price: nat,
  treasury: Principal,
  asset_canister: Principal,
  token: Principal,
  index: Principal,
  images: Vec(text),
  documents: Vec(Tuple(text, text)),
};

export const PropertyDetailsRaw = {
  year_built: nat32,
  occupied: bool,
  crime_score: nat32,
  monthly_rent: float32,
  beds: nat32,
  affordability: float32,
  square_footage: float32,
  flood_zone: bool,
  price_per_sq_foot: float32,
  baths: nat32,
  school_score: nat32,
  last_renovated: float32,
};

export const FinancialDetailsRaw = {
  total_monthly_cost: float32,
  monthly_cash_flow: float32,
  property_insurance: float32,
  initial_maintenance_reserve: float32,
  underlying_asset_price: float32,
  platform_closing_fee: float32,
  min_investment: nat64,
  expense_to_income_ratio: float32,
  llc_monthly_franchise_tax: float32,
  vacancy_rate: float32,
  property_taxes: float32,
  property_management_fee: float32,
  projected_rent: float32,
  monthly_utilities: float32,
  average_5_year_roi: float32,
  yields: float32,
  total_5_year_irr: float32,
  projected_appreciation: float32,
  cap_rate: float32,
};

export const MarketDetailsRaw = {
  country: text,
  city: text,
  market_description: text,
  state: text,
  average_rent: nat32,
  median_home_sale_price: nat32,
  coordinates: text,
  annual_population_growth: nat32,
};

export const ConfigRaw = {
  total_supply: nat,
  // supply_cap: nat,

  // max_query_batch_size: nat,
  // max_update_batch_size: nat,
  // default_take_value: nat,
  // max_take_value: nat,
  // max_memo_size: nat,
  // atomic_batch_transfers: bool,
  // tx_window: nat,
  // permitted_drift: nat,
};

export const MetadataRaw = {
  ...FinancialDetailsRaw,
  ...MarketDetailsRaw,
  ...PropertyDetailsRaw,
  ...CollectionMetadataRaw,

  property_owner: Principal,
};

export const MetadataUpdateRaw = toOptionalSchema({
  ...FinancialDetailsRaw,
  ...MarketDetailsRaw,
  ...PropertyDetailsRaw,
  ...CollectionMetadataRaw,
});

export const PropertyMetadataResultRaw = {
  ...MetadataRaw,

  total_supply: nat,
};

export const MetadataStoreType = Record(MetadataRaw);
export type MetadataStoreType = typeof MetadataStoreType.tsType;

export const ConfigStoreType = Record(ConfigRaw);
export type ConfigStoreType = typeof ConfigStoreType.tsType;

export const InitArg = Record(MetadataRaw);
export type InitArg = typeof InitArg.tsType;

export const CanisterArgs = Variant({
  Init: InitArg,
  Upgrade: Null,
});
export type CanisterArgs = typeof CanisterArgs.tsType;

export const MetadataUpdateArg = Record(MetadataUpdateRaw);
export type MetadataUpdateArg = typeof MetadataUpdateArg.tsType;

export const PropertyMetadataResult = Record(PropertyMetadataResultRaw);
export type PropertyMetadataResult = typeof PropertyMetadataResult.tsType;

export const TxnResult = Variant({
  Ok: nat,
  Err: text,
});
export type TxnResult = typeof TxnResult.tsType;
