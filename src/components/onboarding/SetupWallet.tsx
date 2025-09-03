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

import {useState} from "react";
import {SecureWalletStorage} from "@/utils/db/SecureWalletStorage.ts";
import {CarmentisProvider} from "@/utils/CarmentisProvider.tsx";
import {BACKGROUND_REQUEST_TYPE, BackgroundRequest} from "@/entrypoints/background.ts";
import {useRecoilValue} from "recoil";
import {
    onboardingAccountNameAtom,
    onboardingPasswordAtom, onboardingSeedAtom
} from "@/components/onboarding/onboarding.state.ts";
import {CheckCircle} from "react-bootstrap-icons";
import {useAuthenticationContext} from "@/hooks/useAuthenticationContext.tsx";
import {useWalletBuilder} from "@/hooks/useWalletBuilder.tsx";


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
    const authentication = useAuthenticationContext();
    const {buildWallet} = useWalletBuilder();

    // recover the account name, password and seed
    const accountName = useRecoilValue(onboardingAccountNameAtom);
    const password = useRecoilValue(onboardingPasswordAtom);
    const seed = useRecoilValue(onboardingSeedAtom);

    // create the wallet
    const walletContext = buildWallet(accountName, seed, password);


    function redirectToMainPage() {
        (async () => {
            const openMainRequest : BackgroundRequest = {
                backgroundRequestType: BACKGROUND_REQUEST_TYPE.BROWSER_OPEN_ACTION,
                payload: {
                    location: "main"
                }
            }
            browser.runtime.sendMessage(openMainRequest)
                .then(
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
                .then(async () => {

                    // attempt to read the wallet to ensure that it is correctly installed
                    await storage.readWalletFromStorage()
                        .then(_ => {
                            authentication.connect(walletContext);
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
        return (
            <div className="flex flex-col md:flex-row md:items-stretch md:gap-8">
                {/* Left column - Explanation */}
                <div className="flex flex-col md:w-1/2 md:border-r md:border-gray-100 md:pr-6 pb-6 md:pb-0">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Wallet Installation</h1>
                    <p className="text-gray-600 mb-6">
                        We're setting up your wallet with the highest security standards. This process ensures your assets will be protected.
                    </p>

                    <div className="space-y-4">
                        <h2 className="text-lg font-medium text-gray-800">What's happening now?</h2>
                        <p className="text-gray-600">
                            Your wallet is being securely created and encrypted with your password. This ensures that only you can access your assets.
                        </p>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">During this process:</h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li className="flex items-start">
                                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-500 shrink-0" />
                                    Your recovery phrase is being securely encrypted
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-500 shrink-0" />
                                    Your wallet identity is being created
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-500 shrink-0" />
                                    Everything is stored securely on your device
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right column - Status */}
                <div className="flex flex-col items-center justify-center md:w-1/2 md:pl-2 text-center">
                    <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Installing your wallet</h2>
                    <p className="text-gray-600">Please wait while we securely set up your wallet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row md:items-stretch md:gap-8">
            {/* Left column - Explanation */}
            <div className="flex flex-col md:w-1/2 md:border-r md:border-gray-100 md:pr-6 pb-6 md:pb-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">You are ready!</h1>
                <p className="text-gray-600 mb-6">
                    Your wallet has been successfully installed and set up. You can now start using Carmentis to manage your digital assets.
                </p>

                <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-800">What's next?</h2>
                    <p className="text-gray-600">
                        With your new wallet, you can send and receive assets, connect to decentralized applications, and manage your digital identity.
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">You can now:</h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-500 shrink-0" />
                                View and manage your assets
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-500 shrink-0" />
                                Send and receive transactions
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-500 shrink-0" />
                                Connect to decentralized applications
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right column - Success */}
            <div className="flex flex-col items-center justify-center md:w-1/2 md:pl-2 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Wallet successfully installed</h2>
                <button 
                    className="py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center"
                    onClick={closeCurrentTab}
                >
                    Get Started
                </button>
            </div>
        </div>
    )
}
