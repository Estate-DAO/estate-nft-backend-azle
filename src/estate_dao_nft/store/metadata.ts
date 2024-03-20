import { MetadataStoreType, WritableMetadataType } from "../types";

const _metadataStore: MetadataStoreType = {
  symbol: "",
  name: "",
  total_supply: 0n,

  property_owner: "",
};

function _update(args: WritableMetadataType) {
  Object.keys(args)
    .filter((key) => args[key as keyof WritableMetadataType] === undefined)
    .forEach((key) => delete args[key as keyof WritableMetadataType]);

  Object.assign(_metadataStore, args);
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
