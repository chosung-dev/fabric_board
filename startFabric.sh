#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
CC_RUNTIME_LANGUAGE=golang
CC_SRC_PATH=github.com/fabric_board/go

# clean the keystore
rm -rf ./hfc-key-store

# launch network; create channel and join peer to channel
cd fabric-samples/basic-network
./start.sh

# Now launch the CLI container in order to install, instantiate chaincode
# and prime the ledger with our 10 cars
#docker-compose -f ./docker-compose.yml up -d cli
#docker ps -a

export PEER0_ORG1_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export PEER0_ORG3_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt

# chaincode install
echo "chaincode install in the peer0.org1.example.com"
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" \
           -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
           cli peer chaincode install -n fabric_board -v 1.0 -p "$CC_SRC_PATH"
echo "chaincode install in the peer0.org3.example.com"
docker exec -e "CORE_PEER_LOCALMSPID=Org3MSP" \
           -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp" \
           -e "CORE_PEER_CA_ROOTCERT_FILE=$PEER0_ORG3_CA" \
           -e "CORE_PEER_ADDRESS=peer0.org3.example.com:7051" \
           cli peer chaincode install -n fabric_board -v 1.0 -p "$CC_SRC_PATH"

#chaincode instantiate
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" \
           -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
           cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n fabric_board -v 1.0 -c '{"Args":[]}' -P "OR('Org1MSP.member', 'Org3MSP.member')" 
sleep 10

# call initLedger
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" \
           -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
           cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n fabric_board -c '{"function":"initLedger","Args":[]}'

cat <<EOF

EOF
