## 작업환경 구성

#### 01.설치 및 환경 설정

fabric-board 다운로드

```
git clone https://github.com/chosung-dev/fabric_board
```

fabric-samples 디렉토리에 hyperledger/fabric-samples/basic-network(https://github.com/hyperledger/fabric-samples/basic-network) 디렉토리를 복사해서 집어넣는다. 
```
cd fabric_board
git clone https://github.com/hyperledger/fabric-samples
cd fabric-samples
git checkout release-1.4
find . ! -name basic-network -delete
```
설치된 최종 디렉토리 경로는 `fabric_board/fabric-samples/basic-network`이다.

basic-network/docker-compose.yml 파일을 다음과 같이 수정

 -변경전

```
service.cli.volume:
		- ./../chaincode/:/opt/gopath/src/github.com/
```

 -변경후

```
service.cli.volume:
		- ./../../chaincode/:/opt/gopath/src/github.com/
```



#### 02.컨테이너 생성 및 서버 오픈

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
