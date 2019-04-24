#!/bin/bash
#
set -e

export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
CC_RUNTIME_LANGUAGE=golang
CC_SRC_PATH=github.com/border/go

# 이전 버전 chaincode 컨테이너 삭제
docker rm -f $(docker ps -aq -f name=dev-peer0.org1.example.com-border-*)

rm -r -f chaincode/fabric_border/go/go
cd chaincode/fabric_border/go
go build

echo 'go build success'


docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n border -v $1 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode upgrade -o orderer.example.com:7050 -C mychannel -n border -l "$CC_RUNTIME_LANGUAGE" -v $1 -c '{"Args":[]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
sleep 10

cat <<EOF

EOF
