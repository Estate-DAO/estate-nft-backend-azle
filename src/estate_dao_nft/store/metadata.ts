import { MetadataStoreType, WritableMetadataType } from "../types";

const _metadataStore: MetadataStoreType = {
  symbol: "",
  name: "",
  total_supply: 0n,
};

function _update(args: WritableMetadataType) {
  if (args.symbol) _metadataStore.symbol = args.symbol;
  if (args.name) _metadataStore.name = args.name;
  if (args.description) _metadataStore.description = args.description;
  if (args.logo) _metadataStore.logo = args.logo;
  if (args.supply_cap) _metadataStore.supply_cap = args.supply_cap;
}

function _incrementSupply() {
  _metadataStore.total_supply++;
}

function _decrementSupply() {
  _metadataStore.total_supply--;
}

export default {
  store: _metadataStore as Readonly<MetadataStoreType>,
  update: _update,
  incrementSupply: _incrementSupply,
  decrementSupply: _decrementSupply,
};
