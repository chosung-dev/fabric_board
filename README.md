## 작업환경 구성

#### 01.설치 및 환경 설정

fabric-board 다운로드

```
git clone https://github.com/chosung-dev/fabric_board
```


#### 02-1.컨테이너 생성 및 Fabric 실행

기존 fabric 환경 없이 docker를 활용해 간단하게 테스트 하려면 다음을 따라간다.

기존 fabric 환경이 있을경우 02-2번 항목으로 이동한다. 

startFabric.sh를 통해 컨테이너 생성 및 체인코드 입력.

```
./startFabric.sh
```

다음과 같은 컨테이너를 확인 할 수 있다.

```
CONTAINER ID        IMAGE                                                                                                          COMMAND                  CREATED              STATUS              PORTS                                            NAMES
4c9ce1252178        dev-peer0.org1.example.com-fabric_board-1.0-47efc121b52d2ddebdf3614a86156e23d4fcba28e8b83a3ad4b5d40389c2abf8   "chaincode -peer.add…"   28 seconds ago       Up 27 seconds                                                        dev-peer0.org1.example.com-fabric_board-1.0
d4d6a75b8dc2        hyperledger/fabric-tools                                                                                       "/bin/bash"              About a minute ago   Up About a minute                                                    cli
a4a8c3975e54        hyperledger/fabric-peer                                                                                        "peer node start"        2 minutes ago        Up 2 minutes        0.0.0.0:7051->7051/tcp, 0.0.0.0:7053->7053/tcp   peer0.org1.example.com
3c9ed7a155b1        hyperledger/fabric-couchdb                                                                                     "tini -- /docker-ent…"   2 minutes ago        Up 2 minutes        4369/tcp, 9100/tcp, 0.0.0.0:5984->5984/tcp       couchdb
d0f67b94d03c        hyperledger/fabric-orderer                                                                                     "orderer"                2 minutes ago        Up 2 minutes        0.0.0.0:7050->7050/tcp                           orderer.example.com
e7c51dbbff39        hyperledger/fabric-ca                                                                                          "sh -c 'fabric-ca-se…"   2 minutes ago        Up 2 minutes        0.0.0.0:7054->7054/tcp
```

#### 02-2.기존 Fabric 환경에 연결

기존 Fabric 환경에 fabric board를 연결할 경우.

`basic-network/connection.json`파일을 환경에 맞게 수정한다.

지원하는 fabric 환경은 다음과 같다

```
fabric 1.4
1 channel
1 ca
n peer
n orderer
```


#### 03.Fabric board 실행

npm install 진행

```
npm install
```

fabric_board/bin/www 실행하여 http://localhost:3000 접속 확인.
```
cd bin
node www
```

![readmeImage01.png](./readmeImage/readmeImage01.png)
