let _transactionIndex = 1n;

function _increment() {
  _transactionIndex++;
}

export default {
  index: _transactionIndex as Readonly<bigint>,
  increment: _increment,
};
