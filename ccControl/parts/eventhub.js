'use strict';
const { FileSystemWallet, Gateway } = require('fabric-network');
const client = require('fabric-client');
const fs = require('fs');
const path = require('path');
// const ccpPath = path.resolve(__dirname, '..', '..', 'config', 'fabric_connection.json');
const ccpPath = path.resolve(__dirname, '..','..','basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
module.exports = {
    blockevent : async function(callbackFunc){
        try {
            const walletPath = path.join(process.cwd(),'..','ccControl' ,'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            const userExists = await wallet.exists('user1');
            if (!userExists) {
                console.log('An identity for the user "user1" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
            const network = await gateway.getNetwork('mychannel');
            const channel = network.getChannel();
            const client = gateway.getClient();
            var peer = client.newPeer("grpc://localhost:7051", { 'ssl-target-name-override': null });
            channel.addPeer(peer);
            const eh = channel.newChannelEventHub(peer);

            eh.connect(true);
            
            eh.registerBlockEvent(
                (block) => {
                    console.log(">> Block Eveint Call");
                    callbackFunc(block);
                },
                (err) => {
                    console.log("Error Point1");
                    console.log(err);
                }
            );
            
            eh.registerChaincodeEvent(
                'fabric_board',
                'myevent',
                (event)=> {
                    console.log(">> ChacinCode Event Call");
                    console.log(event[0].chaincode_event.payload.toString('utf-8'));
                    callbackFunc("events");
                    eh.unregisterChaincodeEvent("fabric_board");
                    callbackFunc(event);
                },
                (err) =>{
                },
                { as_array: true}
           );
            eh.registerChaincodeEvent(
                'fabric_board',
                'deleteevent',
                (event)=> {
                    console.log(">> ChacinCode Event Call");
                    eh.unregisterChaincodeEvent("fabric_board");
                    callbackFunc(event);
                },
                (err) =>{
                    /* process err */
                },
                { as_array: true}
           );
            await gateway.disconnect();
        } catch (error) {
            console.log("Error Point2");
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }
};
//ccControl.eventhub()
