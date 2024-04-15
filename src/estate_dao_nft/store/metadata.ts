import { Principal } from "azle";
import { ConfigStoreType, InitArg, MetadataStoreType, MetadataUpdateArg } from "../types";

export class MetadataStore {
  private _metadata: MetadataStoreType;
  private _config: ConfigStoreType;

  constructor() {
    this._config = {
      total_supply: 0n,
    };
  }

  get metadata(): Readonly<MetadataStoreType> {
    return this._metadata;
  }

  get config(): Readonly<ConfigStoreType> {
    return this._config;
  }

  private _updateMetadataAttribute<K extends keyof MetadataStoreType>(
    key: K,
    value: MetadataStoreType[K],
  ) {
    this._metadata[key] = value;
  }

  init(args: InitArg) {
    this._metadata = args;
  }

  update(args: MetadataUpdateArg) {
    const keys = Object.keys(args) as (keyof MetadataUpdateArg)[];
    keys.forEach((key) => {
      const val = args[key].Some;
      if (val) this._updateMetadataAttribute(key, val);
    });
  }

  changeOwnership(owner: Principal) {
    this._metadata.property_owner = owner;
  }

  incrementSupply() {
    this._config.total_supply++;
  }

  decrementSupply() {
    this._config.total_supply--;
  }
}
