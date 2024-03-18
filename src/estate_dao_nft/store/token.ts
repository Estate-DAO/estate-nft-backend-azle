import MetadataStore from "./metadata";
import {
  OwnerToTokenIndexType,
  OwnerToTokensIndexReadonlyType,
  Subaccount,
  TokenStoreReadonlyType,
  TokenStoreType,
} from "../types";
import { toAccountId } from "../utils";

let _tokenIndexCounter = 1;
const _tokenStore: TokenStoreType = new Map();
const _ownerToTokenIndex: OwnerToTokenIndexType = new Map();

export function _mint(principal: string, subaccount?: Subaccount) {
  const accountId = toAccountId(principal, subaccount);
  const tokenId = _tokenIndexCounter;
  _tokenIndexCounter++;

  let userTokenIndex = _ownerToTokenIndex.get(accountId);
  if (!userTokenIndex) {
    userTokenIndex = new Map();
    _ownerToTokenIndex.set(accountId, userTokenIndex);
  }

  _tokenStore.set(tokenId, {
    owner: {
      principal,
      subaccount: subaccount,
    },
  });
  userTokenIndex.set(tokenId, true);
  MetadataStore.incrementSupply();
}

export function _burn(tokenId: number) {
  const token = _tokenStore.get(tokenId);
  if (!token) return;

  const owner = token.owner;
  const accountId = toAccountId(owner.principal, owner.subaccount);

  _ownerToTokenIndex.get(accountId)?.delete(tokenId);
  _tokenStore.delete(tokenId);
  MetadataStore.decrementSupply();
}

export function _transfer(tokenId: number, principal: string, subaccount?: Subaccount) {
  const token = _tokenStore.get(tokenId);
  if (!token) return;

  const holderAccountId = toAccountId(token.owner.principal, token.owner.subaccount);
  const receiverAccountId = toAccountId(principal, subaccount);

  let receiverTokenIndex = _ownerToTokenIndex.get(receiverAccountId);
  if (!receiverTokenIndex) {
    receiverTokenIndex = new Map();
    _ownerToTokenIndex.set(receiverAccountId, receiverTokenIndex);
  }

  token.owner.principal = principal;
  token.owner.subaccount = subaccount;

  _ownerToTokenIndex.get(holderAccountId)!.delete(tokenId);
  receiverTokenIndex.set(tokenId, true);
}

export default {
  store: _tokenStore as TokenStoreReadonlyType,
  ownerToTokenIndex: _ownerToTokenIndex as OwnerToTokensIndexReadonlyType,
  mint: _mint,
  burn: _burn,
  transfer: _transfer,
};
