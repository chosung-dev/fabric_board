## 작업환경 구성

#### 01.설치 및 환경 설정

fabric-board 다운로드

```
git clone https://github.com/chosung-dev/fabric_board
cd fabric_board
git checkout v4.0-java-sdk
git branch
┌───────────── 출력 ────────────┐
   v1.0-onlyboard			   
 * v4.0-java-sdk			   
└──────────────────────────────┘
```

#### 02.컨테이너 생성 및 서버 오픈

startFabric.sh를 통해 컨테이너 생성 및 체인코드 입력.

```
./startFabric.sh
```

다음과 같은 컨테이너를 확인 할 수 있다.

```
docker ps

CONTAINER ID        IMAGE                                                                                                          COMMAND                  CREATED              STATUS              PORTS                                            NAMES
8e73f2c5d4f3        dev-peer0.org1.example.com-fabric_board-1.0-47efc121b52d2ddebdf3614a86156e23d4fcba28e8b83a3ad4b5d40389c2abf8   "chaincode -peer.add…"   34 seconds ago       Up 33 seconds                                                        dev-peer0.org1.example.com-fabric_board-1.0
fab0d9a130f3        hyperledger/fabric-tools                                                                                       "/bin/bash"              About a minute ago   Up About a minute                                                    cli
019b4f636300        hyperledger/fabric-peer                                                                                        "peer node start"        2 minutes ago        Up 2 minutes        0.0.0.0:7051->7051/tcp, 0.0.0.0:7053->7053/tcp   peer0.org1.example.com
2276d693c221        hyperledger/fabric-orderer                                                                                     "orderer"                2 minutes ago        Up 2 minutes        0.0.0.0:7050->7050/tcp                           orderer.example.com
d50235587e55        hyperledger/fabric-couchdb                                                                                     "tini -- /docker-ent…"   2 minutes ago        Up 2 minutes        4369/tcp, 9100/tcp, 0.0.0.0:5984->5984/tcp       couchdb
f2eda8889c3c        hyperledger/fabric-ca                                                                                          "sh -c 'fabric-ca-se…"   2 minutes ago        Up 2 minutes        0.0.0.0:7054->7054/tcp                           ca.example.com
```

#### 03.mvn package진행

```
mvn clean
mvn package
```

실행하여 http://localhost:3000 접속 확인.

```
java -jar target/fabric_board-0.0.1-SNAPSHOT.jar
```

![readmeImage01.png](./readmeImage/readmeImage01.png)
