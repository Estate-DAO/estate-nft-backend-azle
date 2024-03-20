import { TxnIndexStoreType } from "../types";

const _txnIndexStore: TxnIndexStoreType = {
  index: 0n,
};

function _increment() {
  _txnIndexStore.index++;
}

export default {
  store: _txnIndexStore as Readonly<TxnIndexStoreType>,
  increment: _increment,
};
