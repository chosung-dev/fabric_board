/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

'use strict';

module.exports = function(){
    const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
    const fs = require('fs');
    const path = require('path');

    const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'basic-network', 'connection_org3.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);
    var ccControl = {
        registerUser3 : async function(){
            try {

                // Create a new file system based wallet for managing identities.
                const walletPath = path.join('..','ccControl','wallet');
                const wallet = new FileSystemWallet(walletPath);

                // Check to see if we've already enrolled the user.
                const userExists = await wallet.exists('user3');
                if (userExists) {
                    console.log('An identity for the user "user3" already exists in the wallet');
                    return;
                }

                // Check to see if we've already enrolled the admin user.
                const adminExists = await wallet.exists('admin3');
                if (!adminExists) {
                    console.log('An identity for the admin user "admin3" does not exist in the wallet');
                    console.log('Run the enrollAdmin.js application before retrying');
                    return;
                }

                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccp, { wallet, identity: 'admin3', discovery: { enabled: false } });

                // Get the CA client object from the gateway for interacting with the CA.
                const ca = gateway.getClient().getCertificateAuthority();
                const adminIdentity = gateway.getCurrentIdentity();

                // Register the user, enroll the user, and import the new identity into the wallet.
                const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: 'user3', role: 'client' }, adminIdentity);
                const enrollment = await ca.enroll({ enrollmentID: 'user3', enrollmentSecret: secret });
                const userIdentity = X509WalletMixin.createIdentity('Org3MSP', enrollment.certificate, enrollment.key.toBytes());
                wallet.import('user3', userIdentity);
                console.log('Successfully registered and enrolled admin user "user3" and imported it into the wallet');

            } catch (error) {
                console.error(`Failed to register user "user3": ${error}`);
                process.exit(1);
            }
        }
    };

    return ccControl;
};

