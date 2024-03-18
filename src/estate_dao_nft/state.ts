import {
  CollectionMetadataStoreType,
  MetadataStoreType,
  OwnerToTokensIndexExportType,
  Subaccount,
  TokensStoreExportType,
  TokensStoreType,
} from "./types";
import { toAccountId } from "./utils";

const _metadataStore: MetadataStoreType = {
  symbol: "",
  name: "",
  total_supply: 0n,
};

const _tokensStore: TokensStoreType = {
  counter: 1,
  store: new Map(),
  ownerToTokenIndex: new Map(),
};

let _transactionIndex = 1n;

export const MetadataStore: Readonly<MetadataStoreType> = _metadataStore;
export const TokensStore: TokensStoreExportType = _tokensStore.store;
export const OwnerToTokensIndex: OwnerToTokensIndexExportType = _tokensStore.ownerToTokenIndex;
export const TxnIndex = _transactionIndex;

export function _incrementTxnIndex() {
  _transactionIndex += 1n;
}

export function _mintToken(principal: string, subaccount?: Subaccount) {
  const accountId = toAccountId(principal, subaccount);
  const tokenId = _tokensStore.counter;
  _tokensStore.counter++;

  let userTokenIndex = _tokensStore.ownerToTokenIndex.get(accountId);
  if (!userTokenIndex) {
    userTokenIndex = new Map();
    _tokensStore.ownerToTokenIndex.set(accountId, userTokenIndex);
  }

  _tokensStore.store.set(tokenId, {
    owner: {
      principal,
      subaccount: subaccount,
    },
  });
  userTokenIndex.set(tokenId, true);
  _metadataStore.total_supply += 1n;
}

export function _burnToken(tokenId: number) {
  const token = _tokensStore.store.get(tokenId);
  if (!token) return;

  const owner = token.owner;
  const accountId = toAccountId(owner.principal, owner.subaccount);

  _tokensStore.ownerToTokenIndex.get(accountId)?.delete(tokenId);
  _tokensStore.store.delete(tokenId);
  _metadataStore.total_supply -= 1n;
}

export function _transferToken(tokenId: number, principal: string, subaccount?: Subaccount) {
  const token = _tokensStore.store.get(tokenId);
  if (!token) return;

  const holderAccountId = toAccountId(token.owner.principal, token.owner.subaccount);
  const receiverAccountId = toAccountId(principal, subaccount);

  let receiverTokenIndex = _tokensStore.ownerToTokenIndex.get(receiverAccountId);
  if (!receiverTokenIndex) {
    receiverTokenIndex = new Map();
    _tokensStore.ownerToTokenIndex.set(receiverAccountId, receiverTokenIndex);
  }

  token.owner.principal = principal;
  token.owner.subaccount = subaccount;

  _tokensStore.ownerToTokenIndex.get(holderAccountId)!.delete(tokenId);
  receiverTokenIndex.set(tokenId, true);
}

export function _updateCollectionMetadata(args: CollectionMetadataStoreType) {
  if (args.symbol) _metadataStore.symbol = args.symbol;
  if (args.name) _metadataStore.name = args.name;
  if (args.description) _metadataStore.description = args.description;
  if (args.logo) _metadataStore.logo = args.logo;
  if (args.supply_cap) _metadataStore.supply_cap = args.supply_cap;
}
