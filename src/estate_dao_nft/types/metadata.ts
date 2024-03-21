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
} from "azle";
import { Value } from "./common";

export const InitArg = Record({
  symbol: text,
  name: text,
  description: Opt(text),
  logo: Opt(text),
  property_owner: Principal,
});

export type InitArg = typeof InitArg.tsType;


export const MetadataResult = Vec(Tuple(text, Value));
export type MetadataResult = typeof MetadataResult.tsType;

export const CollectionMetadataRaw = {
  symbol: Opt(text),
  name: Opt(text),
  description: Opt(text),
  logo: Opt(text),
};

export const PropertyDetailsRaw = {
  year_built: Opt(nat32),
  occupied: Opt(bool),
  crime_score: Opt(nat32),
  monthly_rent: Opt(float32),
  beds: Opt(nat32),
  affordability: Opt(float32),
  square_footage: Opt(float32),
  flood_zone: Opt(bool),
  price_per_sq_foot: Opt(float32),
  baths: Opt(nat32),
  school_score: Opt(nat32),
  last_renovated: Opt(float32),
};

export const FinancialDetailsRaw = {
  total_monthly_cost: Opt(float32),
  monthly_cash_flow: Opt(float32),
  property_insurance: Opt(float32),
  initial_maintenance_reserve: Opt(float32),
  underlying_asset_price: Opt(float32),
  platform_closing_fee: Opt(float32),
  min_investment: Opt(nat64),
  expense_to_income_ratio: Opt(float32),
  llc_monthly_franchise_tax: Opt(float32),
  vacancy_rate: Opt(float32),
  property_taxes: Opt(float32),
  property_managment_fee: Opt(float32),
  projected_rent: Opt(float32),
  monthly_utilities: Opt(float32),
  average_5_year_roi: Opt(float32),
  yields: Opt(float32),
  total_5_year_irr: Opt(float32),
  projected_appreciation: Opt(float32),
  cap_rate: Opt(float32),
};

export const MarketDetailsRaw = {
  country: Opt(text),
  city: Opt(text),
  market_description: Opt(text),
  state: Opt(text),
  average_rent: Opt(nat32),
  median_home_sale_price: Opt(nat32),
  coordinates: Opt(text),
  annual_popullation_growth: Opt(nat32),
}

export const CollectionMetadataArg = Record(CollectionMetadataRaw);
export type CollectionMetadataArg = typeof CollectionMetadataArg.tsType;

export const PropertyDetailsArg = Record(PropertyDetailsRaw);
export type PropertyDetailsArg = typeof PropertyDetailsArg.tsType;

export const FinancialDetailsArg = Record(FinancialDetailsRaw);
export type FinancialDetailsArg = typeof FinancialDetailsArg.tsType;

export const MarketDetailsArg = Record(MarketDetailsRaw);
export type MarketDetailsArg = typeof MarketDetailsArg.tsType;

export const PropertyMetadataResult = Record({
  ...CollectionMetadataRaw,
  ...FinancialDetailsRaw,
  ...PropertyDetailsRaw,
  ...MarketDetailsRaw,
});
export type PropertyMetadataResult = typeof PropertyMetadataResult.tsType;

export const TxnResult = Variant({
  Ok: nat,
  Err: text,
});
export type TxnResult = typeof TxnResult.tsType;

export type MetadataStoreType = {
  symbol: text;
  name: text;
  description?: text;
  logo?: text;
  total_supply: nat;
  supply_cap?: nat;

  max_query_batch_size?: nat;
  max_update_batch_size?: nat;
  default_take_value?: nat;
  max_take_value?: nat;
  max_memo_size?: nat;
  atomic_batch_transfers?: bool;
  tx_window?: nat;
  permitted_drift?: nat;

  property_owner: text;

  documents?: [text, text][];

  year_built?: nat32;
  occupied?: bool;
  crime_score?: nat32;
  monthly_rent?: float32;
  beds?: nat32;
  affordability?: float32;
  square_footage?: float32;
  flood_zone?: bool;
  price_per_sq_foot?: float32;
  baths?: nat32;
  school_score?: nat32;
  last_renovated?: float32;

  total_monthly_cost?: float32;
  monthly_cash_flow?: float32;
  property_insurance?: float32;
  initial_maintenance_reserve?: float32;
  underlying_asset_price?: float32;
  platform_closing_fee?: float32;
  min_investment?: nat64;
  expense_to_income_ratio?: float32;
  llc_monthly_franchise_tax?: float32;
  vacancy_rate?: float32;
  property_taxes?: float32;
  property_managment_fee?: float32;
  projected_rent?: float32;
  monthly_utilities?: float32;
  average_5_year_roi?: float32;
  yields?: float32;
  total_5_year_irr?: float32;
  projected_appreciation?: float32;
  cap_rate?: float32;

  country?: text;
  city?: text;
  market_description?: text;
  state?: text;
  average_rent?: nat32;
  median_home_sale_price?: nat32;
  coordinates?: text;
  annual_popullation_growth?: nat32;
};

export type PropertyDetailsSlice = Pick<MetadataStoreType, keyof typeof PropertyDetailsRaw>;
export type FinancialDetailsSlice = Pick<MetadataStoreType, keyof typeof FinancialDetailsRaw>;
export type MarketDetailsSlice = Pick<MetadataStoreType, keyof typeof MarketDetailsRaw>;

type UnwritableMetadataKeys =
  | "max_query_batch_size"
  | "max_update_batch_size"
  | "default_take_value"
  | "max_take_value"
  | "max_memo_size"
  | "atomic_batch_transfers"
  | "tx_window"
  | "permitted_drift"
  | "total_supply";
export type WritableMetadataType = Partial<Omit<MetadataStoreType, UnwritableMetadataKeys>>;
