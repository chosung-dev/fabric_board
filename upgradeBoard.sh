#!/bin/bash
#
set -e

export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
CC_RUNTIME_LANGUAGE=golang
CC_SRC_PATH=github.com/fabric_board/go

versionData=$(docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode list --instantiated -C mychannel | grep "Version")

versionData2=${versionData#*Version: }
currentVersion=${versionData2%%,*}
#echo $currentVersion
echo "Current Version : "$currentVersion
up=0.1
upVersion=`echo $currentVersion + $up|bc`
#echo $upVersion
echo "Up Version : "$upVersion

# go file build
rm -r -f ./chaincode/fabric_board/go/go
cd ./chaincode/fabric_board/go
go build

echo 'go build success'

# 이전 버전 chaincode 컨테이너 삭제
container=$(docker ps -aq -f name='dev-peer0.org1.example.com-fabric_board-*')
cntContainer=`echo $container | wc -c`
if [[ ${cntContainer} > 1 ]];then
        docker rm -f $(docker ps -aq -f name=dev-peer0.org1.example.com-fabric_board-*)
        echo 'delete previous version'
fi


# chaincode install
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n fabric_board -v $upVersion -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"
echo 'chaincode install success'
# chaincode upgrade
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode upgrade -o orderer.example.com:7050 -C mychannel -n fabric_board -l "$CC_RUNTIME_LANGUAGE" -v $upVersion -c '{"Args":[]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
echo 'chaincode upgrade success'

cat <<EOF

EOF
