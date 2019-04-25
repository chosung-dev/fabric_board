/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';


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
        create_bord : async function(title, content, callbackFunc){
            try {
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(),'..','ccControl' ,'wallet');
                const wallet = new FileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);

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
                const network = await gateway.getNetwork('mychannel');

                // Get the contract from the network.
                const contract = network.getContract('fabric_border');

                // Submit the specified transaction.
                var args = process.argv;
                console.log(args);
                await contract.submitTransaction('addBord',title, content);
                // Disconnect from the gateway.
                await gateway.disconnect();

                callbackFunc("Success")

            } catch (error) {
                console.error(`Failed to submit transaction: ${error}`);
                process.exit(1);
            }
        }
    };

    return ccControl;
};






