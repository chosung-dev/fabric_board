'use strict';
const { FileSystemWallet, Gateway } = require('fabric-network');
const client = require('fabric-client');
const fs = require('fs');
const path = require('path');
// const ccpPath = path.resolve(__dirname, '..', '..', 'config', 'fabric_connection.json');
const ccpPath = path.resolve(__dirname, '..','..','fabric-samples', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
module.exports = {
    blockevent : async function(callbackFunc){
        try {
            // const walletPath = path.join(process.cwd(),'.','fabric','userRegister','wallet');
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
            eh.connect();
            eh.registerBlockEvent(
                (block) => {
                    console.log("Block added");
                    let first_tx = block.data.data[0];
                    let header = first_tx.payload.header;
                    let channel_id = header.channel_header.channel_id;
                    if ("mychannel" !== channel_id) return;
                    let json = JSON.stringify(first_tx);
                    let tx = JSON.parse(json);
                    let tx_value = tx.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[0].rwset.writes[0].value;

                    callbackFunc(tx_value)
                    //callbackFunc({
                    //'tx_value': tx_value,
                    //'block': block,
                    //'number':block.header.number.toString(),
                    //'previous_hash':block.header.previous_hash,
                    //'data_hash':block.header.data_hash,
                    //'transactions':block.data.data[0]
                    //})
                },
                (err) => {
                    console.log("Error Point1");
                    console.log(err);
                }
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