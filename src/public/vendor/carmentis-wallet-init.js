try {
    console.log("Landing of the wallet on the page...")
    const CarmentisWallet = class {
        openPopup = async function (data) {
            console.log('Input to Carmentis Wallet:', data);
            window.postMessage({
                action: "carmentis/clientRequest",
                data: data,
                from: 'carmentis-wallet-init.js'
            }, "*"
            );

        }

        /**
         * Asynchronously authenticates using a public key method based on the provided challenge.
         *
         * @function
         * @async
         * @param {Object} challenge - The challenge data required for public key authentication.
         * @returns {Promise<{publicKey: string, signature: string}>} Resolves with the result of the authentication process.
         */
        authenticateByPublicKey = async function (challenge)  {
            console.log('Authentication by public key required with the following challenge:', challenge);
            window.postMessage({
                action: "carmentis/clientRequest",
                challenge: challenge,
            }, '*')

            return new Promise((resolve, reject) => {
                window.addEventListener('message', function(event) {
                    console.log("[carmentis wallet init] Receiving an event:", event)
                    const response = event.data
                    if (response.data && response.data.publicKey && response.data.signature) {
                        resolve(response.data)
                    } else {
                        console.warn("[carmentis wallet init] Ignored event:", event)
                    }
                }, false);
            })
        }
    };
    console.log("Landing of the wallet on the page..", CarmentisWallet)


    if(!window.carmentisWallet) {
        window.carmentisWallet = new CarmentisWallet;
    };
} catch (e) {
    console.warn('Carmentis Wallet already defined');
}
