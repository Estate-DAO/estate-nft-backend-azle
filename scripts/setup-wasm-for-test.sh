cd .azle

TOKEN_CANISTER_NAME=estate_dao_nft
PROVISION_CANISTER_NAME=provision

GZIP_FILE_TOKEN="${TOKEN_CANISTER_NAME}.wasm.gz"
FILE_TOKEN="${TOKEN_CANISTER_NAME}.wasm"

GZIP_FILE_PROVISION="${PROVISION_CANISTER_NAME}.wasm.gz"
FILE_PROVISION="${PROVISION_CANISTER_NAME}.wasm"

cd $TOKEN_CANISTER_NAME
if [ ! -f $GZIP_FILE_TOKEN ]; then
  if [ -f $FILE_TOKEN ]; then
    gzip -k $FILE_TOKEN
  else
    echo "Can't find wasm binary"
    exit 1
  fi
fi

cd ../$PROVISION_CANISTER_NAME
if [ ! -f $GZIP_FILE_PROVISION ]; then
  if [ -f $FILE_PROVISION ]; then
    gzip -k $FILE_PROVISION
  else
    echo "Can't find wasm binary"
    exit 1
  fi
fi