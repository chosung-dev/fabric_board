package com.example.fabric_board.fabric;


import com.example.fabric_board.controller.JsonController;
import org.hyperledger.fabric.sdk.*;
import org.hyperledger.fabric.sdk.exception.InvalidArgumentException;
import org.hyperledger.fabric.sdk.exception.ProposalException;
import org.hyperledger.fabric.sdk.exception.TransactionException;
import org.hyperledger.fabric.sdk.security.CryptoSuite;
import org.hyperledger.fabric_ca.sdk.HFCAClient;
import org.hyperledger.fabric_ca.sdk.RegistrationRequest;
import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.TimeUnit;


public class FabricController {
    private static Logger logger = LoggerFactory.getLogger(FabricController.class) ;
    private static String dockerIp = "13.125.108.193";
    private static String chaincodeName = "fabric_board";
    private static String channelName = "mychannel";

    // build cc id providing the chaincode name. Version is omitted here.
    private static ChaincodeID myccCCId;

    AppUser admin;
    AppUser appUser;
    User user;
    HFClient client;
    Channel channel;

    public FabricController() throws Exception {
        // create fabric-ca client
        HFCAClient caClient = getHfCaClient("http://"+dockerIp+":7054", null);

        // enroll or load admin
        admin = getAdmin(caClient);

        // register and enroll new user
        logger.info("========================== Register and Enroll =========================");
        appUser = getUser(caClient, admin, "admin");
        logger.info("======================== Register and Enroll End =======================");

        // get HFC client instance
        client = getHfClient();

        // set user context
        user = client.setUserContext(admin);

        // get HFC channel using the client
        logger.info("============================ Set Channel ===============================");
        channel = getChannel(client);
        logger.info("========================== Set Channel Done =============================");

        myccCCId = ChaincodeID.newBuilder().setName(chaincodeName).build();
    }

    static void serialize(AppUser appUser) throws IOException {
        try (ObjectOutputStream oos = new ObjectOutputStream(Files.newOutputStream(
                Paths.get(appUser.getName() + ".jso")))) {
            oos.writeObject(appUser);
        }
    }

    static AppUser deserialize(String name) throws Exception {
        try (ObjectInputStream decoder = new ObjectInputStream(
                Files.newInputStream(Paths.get(name + ".jso")))) {
            return (AppUser) decoder.readObject();
        }
    }

    static AppUser tryDeserialize(String name) throws Exception {
        logger.info(String.valueOf(Paths.get(name + ".jso")));
        if (Files.exists(Paths.get(name + ".jso"))) {
            return deserialize(name);
        }
        return null;
    }

    static AppUser getUser(HFCAClient caClient, AppUser registrar, String userId) throws Exception {
        AppUser appUser = tryDeserialize(userId);
        logger.info("userId:"+userId+"   appUser:"+appUser);
        if (appUser == null) {
            RegistrationRequest rr = new RegistrationRequest(userId, "org1");
            String enrollmentSecret = caClient.register(rr, registrar);
            Enrollment enrollment = caClient.enroll(userId, enrollmentSecret);
            appUser = new AppUser(userId, "org1", "Org1MSP", enrollment);
            serialize(appUser);
        }
        return appUser;
    }

    static Channel getChannel(HFClient client) throws InvalidArgumentException, TransactionException {
        // initialize channel
        // peer name and endpoint in fabcar network
        Peer peer1 = client.newPeer("peer0.org1.example.com", "grpc://"+dockerIp+":7051");
        Orderer orderer = client.newOrderer("orderer.example.com", "grpc://"+dockerIp+":7050");
        // channel name in fabcar network
        Channel channel = client.newChannel(channelName);
        channel.addPeer(peer1);
        channel.addOrderer(orderer);
        channel.initialize();
        return channel;
    }
    public JSONArray query(String FcnName) throws ProposalException, InvalidArgumentException {
        logger.info("============================== Query ===================================");
        // create chaincode request
        QueryByChaincodeRequest qpr = client.newQueryProposalRequest();

        qpr.setChaincodeID(myccCCId);
        // CC function to be called
        qpr.setFcn(FcnName);
        Collection<ProposalResponse> res = channel.queryByChaincode(qpr);
        // display response
        for (ProposalResponse pres : res) {
            String stringResponse = new String(pres.getChaincodeActionResponsePayload());
            logger.info(stringResponse);
            JSONArray jsonArr = new JSONArray(stringResponse);
            logger.info("============================= Query Done ===============================");
            return jsonArr;
        }
        return null;
    }

    public JSONArray queryAllBoard() throws ProposalException, InvalidArgumentException {
        JSONArray jsonArr = query("queryAllBoard");
        return JsonController.jsonSort(jsonArr, "Key");
    }

    private  BlockEvent invoke(String FcnName, String...args) throws ProposalException, InvalidArgumentException{
        logger.info("=============================  invoke ===================================");
        Collection<ProposalResponse> successful = new LinkedList<>();
        Collection<ProposalResponse> failed = new LinkedList<>();
        ChaincodeID cid = ChaincodeID.newBuilder().setName(chaincodeName).build();
        BlockEvent.TransactionEvent be = null;
        TransactionProposalRequest tpr = client.newTransactionProposalRequest();
        tpr.setChaincodeLanguage(TransactionRequest.Type.GO_LANG);
        tpr.setChaincodeID(cid);
        tpr.setFcn(FcnName);
        tpr.setArgs(args);
        tpr.setProposalWaitTime(5000);
        Collection<Peer> ePeer = new LinkedList<>();
        for(Peer p : channel.getPeers()){
            ePeer.add(p);
        }
        Collection<ProposalResponse> transactionPropResp = channel.sendTransactionProposal(tpr, channel.getPeers()); // ePeer);//, channel.getPeers());
        for (ProposalResponse response : transactionPropResp) {
            if (response.getStatus() == ProposalResponse.Status.SUCCESS) {
                logger.info("Successful transaction proposal response Txid: " + response.getTransactionID() + " from peer " + response.getPeer().getName() );
                successful.add(response);
            } else {
                failed.add(response);
            }
        }
        try {
            be = channel.sendTransaction(successful). get(15, TimeUnit.SECONDS);
            logger.info("BlockEvent timestamp: " + be.getTimestamp());
        }catch(Exception e){
            e.printStackTrace();
        }
        logger.info("Received " + transactionPropResp.size() + " transaction proposal responses. Successful+verified: " + successful.size() + " . Failed: " + failed.size());
        logger.info("============================= invoke Done ==============================");
        return be.getBlockEvent();
    }

    public BlockEvent addBoard(String tittle, String content) throws ProposalException, InvalidArgumentException {
        return invoke("addBoard",tittle, content);
    }

    public BlockEvent deleteBoard(String boardId) throws ProposalException, InvalidArgumentException {
        return invoke("deleteBoard",boardId);
    }

    public BlockEvent repairBoard(String boardId, String tittle, String content) throws ProposalException, InvalidArgumentException {
        return invoke("createBoard",boardId, tittle, content);
    }

    static HFClient getHfClient() throws Exception {
        // initialize default cryptosuite
        CryptoSuite cryptoSuite = CryptoSuite.Factory.getCryptoSuite();
        // setup the client
        HFClient client = HFClient.createNewInstance();
        client.setCryptoSuite(cryptoSuite);
        return client;
    }

    static HFCAClient getHfCaClient(String caUrl, Properties caClientProperties) throws Exception {
        CryptoSuite cryptoSuite = CryptoSuite.Factory.getCryptoSuite();
        HFCAClient caClient = HFCAClient.createNewInstance(caUrl, caClientProperties);
        caClient.setCryptoSuite(cryptoSuite);
        return caClient;
    }

    static AppUser getAdmin(HFCAClient caClient) throws Exception {
        AppUser admin = tryDeserialize("admin");
        if (admin == null) {
            Enrollment adminEnrollment = caClient.enroll("admin", "adminpw");
            admin = new AppUser("admin", "org1", "Org1MSP", adminEnrollment);
            serialize(admin);
        }
        return admin;
    }

}