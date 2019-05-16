#!/bin/sh
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
CHANNEL_NAME=mychannel

# remove previous crypto material and config transactions
rm -fr config/*
rm -fr crypto-config/*

# generate crypto material 
cryptogen generate --config=./crypto-config.yaml
if [ "$?" -ne 0 ]; then
  echo "Failed to generate crypto material..."
  exit 1
fi
echo "Sucess to generate crypto meterial"

# generate genesis block for orderer
configtxgen -profile ThreeOrgOrdererGenesis -outputBlock ./config/genesis.block
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi


echo
echo "#################################################################"
echo "### Generating channel configuration transaction 'channel.tx' ###"
echo "#################################################################"
echo
configtxgen -profile ThreeOrgChannel -outputCreateChannelTx ./config/channel.tx -channelID $CHANNEL_NAME
res=$?
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi


echo 
echo "#################################################################"
echo "#######    Generating anchor peer update for Org1MSP   ##########"
echo "#################################################################"
echo
configtxgen -profile ThreeOrgChannel -outputAnchorPeersUpdate ./config/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
res=$?
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Org1MSP..."
  exit 1
fi

echo 
echo "#################################################################"
echo "#######    Generating anchor peer update for Org3MSP   ##########"
echo "#################################################################"
echo
configtxgen -profile ThreeOrgChannel -outputAnchorPeersUpdate ./config/Org3MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org3MSP
res=$?
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Org3MSP..."
  exit 1
fi
