import { Principal } from "azle";
import { ConfigStoreType, InitArg, MetadataRaw, MetadataStoreType, MetadataUpdateArg } from "../types";
import { Store } from "../../common/types";

export class MetadataStore implements Store {
  private _metadata: MetadataStoreType;
  private _config: ConfigStoreType;

  constructor() {
    this._metadata = {} as MetadataStoreType;
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

  serialize(): string | undefined {
    const toSerialize = {
      metadata: {} as any,
      config: {} as any,
    };

    Object
      .entries(this.metadata)
      .forEach(([key, value]) => {
        let transformedValue;
        
        switch (typeof value) {
          case 'bigint':
            transformedValue = value.toString();
            break;
          
          case 'object':
            if ( value instanceof Principal )
              transformedValue = value.toString();
            transformedValue = value;

          default:
            transformedValue = value;
        }

        toSerialize.metadata[key] = transformedValue;
      })
    
    Object
      .entries(this.metadata)
      .forEach(([key, value]) => {
        let transformedValue;
        
        switch (typeof value) {
          case 'bigint':
            transformedValue = value.toString();
            break;
          
          case 'object':
            if ( value instanceof Principal )
              transformedValue = value.toString();
            transformedValue = value;

          default:
            transformedValue = value;
        }

        toSerialize.config[key] = transformedValue;
      })

    return JSON.stringify(toSerialize);
  }

  deserialize(serialized: string): void {
    const { metadata, config } = JSON.parse(serialized);
    
    this._metadata = metadata;
    this._config = config;
  }
}
