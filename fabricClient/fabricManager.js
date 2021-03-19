'use strict';

var { FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
var path = require('path');
var fs = require('fs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class FabricManager{
    //선언자
    constructor(){
        this.contract;
    }

    //contract 연결
    async connectContract(callFunction){
        var ccpPath = path.resolve(__dirname, '..', 'basic-network', 'connection.json');
        const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        const ccp = JSON.parse(ccpJSON);
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(),'..','fabricClient' ,'wallet');
            const wallet = new FileSystemWallet(walletPath);

            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (!userExists) {
                console.log('An identity for the user "user1" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

            // Get the network (channel) our contract is deployed to.
            var channelName = Object.keys(ccp.channels);
            const network = await gateway.getNetwork(channelName[0]);

            // Get the contract from the network.
            this.contract = network.getContract('fabric_board');

            console.log("Contract connect success")
        } catch (error) {
            console.error(`Failed to connect contract: ${error}`);
            process.exit(1);
        }
    }

    async enrollAdmin(callFunction){
        const FabricCAServices = require('fabric-ca-client');
    
        const ccpPath = path.resolve(__dirname, '..', 'basic-network', 'connection.json');
        const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        const ccp = JSON.parse(ccpJSON);
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join('..','fabricClient','wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the admin user.
            const adminExists = await wallet.exists('admin');
            if (adminExists) {
                console.log('An identity for the admin user "admin" already exists in the wallet');
                callFunction(null);
                return;
            }

            // Create a new CA client for interacting with the CA.
            var caName = Object.keys(ccp.certificateAuthorities);
            const caURL = ccp.certificateAuthorities[caName[0]].url;
            const ca = new FabricCAServices(caURL);

            // Enroll the admin user, and import the new identity into the wallet.
            const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
            const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
            wallet.import('admin', identity);
            console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
            await sleep(5000);
            callFunction(null);
        } catch (error) {
            console.error(`Failed to enroll admin user "admin": ${error}`);
            process.exit(1);
        }
    }

    async registerUser(callFunction){
        const ccpPath = path.resolve(__dirname, '..', 'basic-network', 'connection.json');
        const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        const ccp = JSON.parse(ccpJSON);
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join('..','fabricClient','wallet');
            const wallet = new FileSystemWallet(walletPath);

            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (userExists) {
                console.log('An identity for the user "user1" already exists in the wallet');
                callFunction(null);
                return;
            }

            // Check to see if we've already enrolled the admin user.
            const adminExists = await wallet.exists('admin');
            if (!adminExists) {
                console.log('An identity for the admin user "admin" does not exist in the wallet');
                console.log('Run the enrollAdmin application before retrying');
                callFunction(null);
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });

            // Get the CA client object from the gateway for interacting with the CA.
            const ca = gateway.getClient().getCertificateAuthority();
            const adminIdentity = gateway.getCurrentIdentity();

            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: 'user1', role: 'client' }, adminIdentity);
            const enrollment = await ca.enroll({ enrollmentID: 'user1', enrollmentSecret: secret });
            const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
            await wallet.import('user1', userIdentity);
            console.log('Successfully registered and enrolled admin user "user1" and imported it into the wallet');
            gateway.disconnect;
            callFunction(null);
        } catch (error) {
            console.error(`Failed to register user "user1": ${error}`);
            process.exit(1);
        }
    }

    async query_view(callbackFunc){
        const result = await this.contract.evaluateTransaction('queryAllBoard');
        callbackFunc(result)
    }

    async create_board(title, content, callbackFunc){
        await this.contract.submitTransaction('addBoard',title, content);
        callbackFunc("Success")
    }

    async delete_board(id, callbackFunc){
        await this.contract.submitTransaction('deleteBoard',id);
        callbackFunc("Success")
    }

    async get_boardHistory(id, callbackFunc){
        const result = await this.contract.evaluateTransaction('getBoardHistry', id);
        callbackFunc(result)
    }

    async repair_board(id, title, content, callbackFunc){
        await this.contract.submitTransaction('createBoard',id, title, content);
        callbackFunc("Success")
    }
}

const fabricManager = new FabricManager();
module.exports = fabricManager;