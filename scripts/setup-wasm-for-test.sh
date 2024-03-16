cd .azle/estate_dao_nft

GZIP_FILE=estate_dao_nft.wasm.gz
FILE=estate_dao_nft.wasm

if [ ! -f $GZIP_FILE ]; then
  if [ -f $FILE ]; then
    gzip -k $FILE
  else
    echo "Can't find wasm binary"
    exit 1
  fi
fi