/*
 * Copyright (c) Carmentis. All rights reserved.
 * Licensed under the Apache 2.0 licence.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import {useLocation, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {SecureWalletStorage} from "@/entrypoints/main/WalletStorage.tsx";
import {CarmentisProvider} from "@/src/providers/carmentisProvider.tsx";
import {CreateFromPseudoAndSeed} from '@/entrypoints/main/wallet.tsx';


/**
 * Sets up a wallet using the provided pseudo, password, and seed from the application's state.
 * Handles wallet creation, local storage of wallet context, and redirects the user on successful setup.
 *
 * The wallet is installed securely in the local storage and validated to ensure its setup is correct.
 * If the required parameters are missing, the user is redirected to the home page.
 *
 * This function also features UI feedback to inform the user when the wallet installation is in progress
 * or completed successfully.
 */
export function SetupWallet() {

    const [installed, setInstalled] = useState<boolean>(false);

    // recover the password and seed from given parameters, or back to home if at least one is not provided
    const location = useLocation();
    const navigate = useNavigate();
    if (!location.state || !location.state.password || !location.state.seed || !location.state.pseudo) {
        useEffect(() => {
            navigate("/");
        });
    }


    // recover the pseudo, password and seed
    const pseudo = location.state.pseudo;
    const password = location.state.password;
    const seed = location.state.seed;

    // create the wallet
    const walletContext = CreateFromPseudoAndSeed(pseudo, seed, password);


    function redirectToMainPage() {
        (async () => {
            browser.runtime.sendMessage({
                action: "open",
                location: "main"
            }).then(
                closeCurrentTab
            );
        })();
    }

    function closeCurrentTab() {
        window.close()
    }

    // store the seed in the wallet
    const provider = new CarmentisProvider();
    SecureWalletStorage.CreateSecureWalletStorage(provider, password)
        .then(storage => {
            storage.writeWalletToStorage(walletContext)
                .then(() => {

                    // attempt to read the wallet to ensure that it is correctly installed
                    storage.readWalletFromStorage()
                        .then(_ => {
                            setInstalled(true);
                            redirectToMainPage()
                        }).catch(_ => {
                    });


                }).catch(error => {
                console.log("Wallet error in local storage", error);
            });
        }).catch(error => {
        console.error("wallet storage creation failure", error);
    });



    if (!installed) {
        return <div>
            <h1>Wallet Installation</h1>
            <p>Please wait, we are installing your wallet.</p>
        </div>;
    }


    return <div>
        <h1>You are ready!</h1>
        <p>You wallet has been installed and setup.</p>
        <button className="btn-primary btn-highlight" onClick={closeCurrentTab}>
            Close
        </button>
    </div>
}