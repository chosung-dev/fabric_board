/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

module.exports = function(){
    const { FileSystemWallet, Gateway } = require('fabric-network');
    const fs = require('fs');
    const path = require('path');

    const ccpPath = path.resolve(__dirname, '..','..','fabric-samples', 'basic-network', 'connection.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);
    var ccControl = {
        query_view : async function(user, callbackFunc){
            try {
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(),'..','ccControl' ,'wallet');
                const wallet = new FileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);

                // Check to see if we've already enrolled the user.
                const userExists = wallet.exists(user);
                if (!userExists) {
                    console.log('An identity for the user "user" does not exist in the wallet');
                    console.log('Run the registerUser.js application before retrying');
                    return;
                }

                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');

                // Get the contract from the network.
                const contract = network.getContract('fabric_board');

                // Evaluate the specified transaction.
                // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
                // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
                // collectionBoard
                // collectionPrivateBoard
                const result = await contract.evaluateTransaction('queryAllBoard', 'collectionBoard');
                try{
                    const result2 = await contract.evaluateTransaction('queryAllBoard', 'collectionPrivateBoard');
                    callbackFunc(result.toString().substring(0,result.toString().length-1)+","+result2.toString().substring(1,result2.toString().length))
                } catch (error){
                    callbackFunc(result)
                }
            } catch (error) {
                callbackFunc("{}")
            }
        }
    };

    return ccControl;
};

