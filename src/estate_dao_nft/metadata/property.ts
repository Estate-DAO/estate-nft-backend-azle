import { Principal, ic } from "azle";
import { MetadataStore, TxnIndexStore } from "../store";
import { PropertyMetadataResult, TxnResult, FinancialDetailsArg, MarketDetailsArg, CollectionMetadataArg, PropertyDetailsArg } from "../types";
import { toOpt } from "../utils";

export function isCallerPropertyOwner(): boolean {
  return ic.caller().toString() === MetadataStore.store.property_owner;
}

export function update_property_owner(property_owner: Principal): TxnResult {
  if ( !isCallerPropertyOwner() ) return { Err: "Unauthorized" };

  MetadataStore.update({
    property_owner: property_owner.toString()
  });

  return { Ok: TxnIndexStore.store.index };
}

export function update_collection_metadata(args: CollectionMetadataArg): TxnResult {
  if ( !isCallerPropertyOwner() ) return { Err: "Unauthorized" };

  MetadataStore.update({
    symbol: args.symbol.Some,
    name: args.name.Some,
    description: args.description.Some,
    logo: args.logo.Some,
  });

  return { Ok: TxnIndexStore.store.index };
}

export function update_property_details(args: PropertyDetailsArg): TxnResult {
  if ( !isCallerPropertyOwner() ) return { Err: "Unauthorized" };

  MetadataStore.update({
    year_built: args.year_built.Some,
    occupied: args.occupied.Some,
    crime_score: args.crime_score.Some,
    monthly_rent: args.monthly_rent.Some,
    beds: args.beds.Some,
    affordability: args.affordability.Some,
    square_footage: args.square_footage.Some,
    flood_zone: args.flood_zone.Some,
    price_per_sq_foot: args.price_per_sq_foot.Some,
    baths: args.baths.Some,
    school_score: args.school_score.Some,
    last_renovated: args.last_renovated.Some,
  });

  return { Ok: TxnIndexStore.store.index };
}

export function update_financial_details(args: FinancialDetailsArg): TxnResult {
  if ( !isCallerPropertyOwner() ) return { Err: "Unauthorized" };

  MetadataStore.update({
    total_monthly_cost: args.total_monthly_cost.Some,
    monthly_cash_flow: args.monthly_cash_flow.Some,
    property_insurance: args.property_insurance.Some,
    initial_maintenance_reserve: args.initial_maintenance_reserve.Some,
    underlying_asset_price: args.underlying_asset_price.Some,
    platform_closing_fee: args.platform_closing_fee.Some,
    min_investment: args.min_investment.Some,
    expense_to_income_ratio: args.expense_to_income_ratio.Some,
    llc_monthly_franchise_tax: args.llc_monthly_franchise_tax.Some,
    vacancy_rate: args.vacancy_rate.Some,
    property_taxes: args.property_taxes.Some,
    property_managment_fee: args.property_managment_fee.Some,
    projected_rent: args.projected_rent.Some,
    monthly_utilities: args.monthly_utilities.Some,
    average_5_year_roi: args.average_5_year_roi.Some,
    yields: args.yields.Some,
    total_5_year_irr: args.total_5_year_irr.Some,
    projected_appreciation: args.projected_appreciation.Some,
    cap_rate: args.cap_rate.Some,
  });

  return { Ok: TxnIndexStore.store.index };
}

export function update_market_details(args: MarketDetailsArg): TxnResult {
  if ( !isCallerPropertyOwner() ) return { Err: "Unauthorized" };

  MetadataStore.update({
    country: args.country.Some,
    city: args.city.Some,
    market_description: args.market_description.Some,
    state: args.state.Some,
    average_rent: args.average_rent.Some,
    median_home_sale_price: args.median_home_sale_price.Some,
    coordinates: args.coordinates.Some,
    annual_popullation_growth: args.annual_popullation_growth.Some,
  });

  return { Ok: TxnIndexStore.store.index };
}

export function get_property_metadata(): PropertyMetadataResult {
  return {
    country: toOpt(MetadataStore.store.country),
    city: toOpt(MetadataStore.store.city),
    market_description: toOpt(MetadataStore.store.market_description),
    state: toOpt(MetadataStore.store.state),
    average_rent: toOpt(MetadataStore.store.average_rent),
    median_home_sale_price: toOpt(MetadataStore.store.median_home_sale_price),
    coordinates: toOpt(MetadataStore.store.coordinates),
    annual_popullation_growth: toOpt(MetadataStore.store.annual_popullation_growth),

    total_monthly_cost: toOpt(MetadataStore.store.total_monthly_cost),
    monthly_cash_flow: toOpt(MetadataStore.store.monthly_cash_flow),
    property_insurance: toOpt(MetadataStore.store.property_insurance),
    initial_maintenance_reserve: toOpt(MetadataStore.store.initial_maintenance_reserve),
    underlying_asset_price: toOpt(MetadataStore.store.underlying_asset_price),
    platform_closing_fee: toOpt(MetadataStore.store.platform_closing_fee),
    min_investment: toOpt(MetadataStore.store.min_investment),
    expense_to_income_ratio: toOpt(MetadataStore.store.expense_to_income_ratio),
    llc_monthly_franchise_tax: toOpt(MetadataStore.store.llc_monthly_franchise_tax),
    vacancy_rate: toOpt(MetadataStore.store.vacancy_rate),
    property_taxes: toOpt(MetadataStore.store.property_taxes),
    property_managment_fee: toOpt(MetadataStore.store.property_managment_fee),
    projected_rent: toOpt(MetadataStore.store.projected_rent),
    monthly_utilities: toOpt(MetadataStore.store.monthly_utilities),
    average_5_year_roi: toOpt(MetadataStore.store.average_5_year_roi),
    yields: toOpt(MetadataStore.store.yields),
    total_5_year_irr: toOpt(MetadataStore.store.total_5_year_irr),
    projected_appreciation: toOpt(MetadataStore.store.projected_appreciation),
    cap_rate: toOpt(MetadataStore.store.cap_rate),

    year_built: toOpt(MetadataStore.store.year_built),
    occupied: toOpt(MetadataStore.store.occupied),
    crime_score: toOpt(MetadataStore.store.crime_score),
    monthly_rent: toOpt(MetadataStore.store.monthly_rent),
    beds: toOpt(MetadataStore.store.beds),
    affordability: toOpt(MetadataStore.store.affordability),
    square_footage: toOpt(MetadataStore.store.square_footage),
    flood_zone: toOpt(MetadataStore.store.flood_zone),
    price_per_sq_foot: toOpt(MetadataStore.store.price_per_sq_foot),
    baths: toOpt(MetadataStore.store.baths),
    school_score: toOpt(MetadataStore.store.school_score),
    last_renovated: toOpt(MetadataStore.store.last_renovated),

    symbol: toOpt(MetadataStore.store.symbol),
    name: toOpt(MetadataStore.store.name),
    description: toOpt(MetadataStore.store.description),
    logo: toOpt(MetadataStore.store.logo),
  }
}