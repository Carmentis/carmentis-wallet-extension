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
import {SecureWalletStorage} from "@/src/WalletStorage.tsx";
import {CarmentisProvider} from "@/src/providers/carmentisProvider.tsx";
import {Wallet} from "@/src/Wallet.tsx";

/**
 * This function should be called to setup the wallet.
 *
 * This component requires to have obtain a seed and a password first. For this reason, if one is missing,
 * the user is redirected to the start page
 *
 * @constructor
 */
export function SetupWallet() {

    const [installed, setInstalled] = useState<boolean>(false);

    // recover the password and seed from given parameters, or back to home if at least one is not provided
    const location = useLocation();
    const navigate = useNavigate();
    if (!location.state || !location.state.password  || !location.state.seed ) {
        useEffect(() => {
           navigate("/");
        });
    }


    // recover the password and seed
    const seed = location.state.seed;
    const password = location.state.password;

    // create the wallet
    const walletContext = Wallet.CreateFromSeed(seed);


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
    SecureWalletStorage.CreateSecureWalletStorage( provider, password )
        .then(storage => {
            storage.writeWalletContextToLocalStorage(walletContext)
                .then(() => {

                    // attempt to read the wallet to ensure that it is correctly installed
                    storage.readContextFromLocalStorage()
                        .then(_ => {
                            setInstalled(true);
                            redirectToMainPage()
                        }).catch(_ => {});




                }).catch(error => {
                    console.log("Wallet error in local storage", error);
            });
        }).catch(error => {
            console.error("wallet storage creation failure", error);
        });
    //


    return (<>
        <div>
            {!installed &&
                <div>
                    <h1>Wallet Installation</h1>
                    <p>Please wait, we are installing your wallet.</p>
                </div>
            }

            {installed &&
                <div>
                    <h1>You are ready!</h1>
                    <p>You wallet has been installed and setup.</p>
                    <button className="btn-primary btn-highlight" onClick={closeCurrentTab}>
                        Close
                    </button>
                </div>
            }
        </div>
    </>);
}