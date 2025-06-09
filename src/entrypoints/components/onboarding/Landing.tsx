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

import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import {CarmentisProvider} from "@/providers/carmentisProvider.tsx";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {
    onboardingFirstnameAtom,
    onboardingLastnameAtom,
    onboardingPasswordAtom, onboardingSeedAtom
} from "@/entrypoints/components/onboarding/onboarding.state.ts";

export function Landing() {
    const navigate = useNavigate();
    const {t} = useTranslation();



    if (import.meta.env.MODE === "development") {

        async function populateWithDevWallet() {
            // we create a default wallet
            const setFirstname = useSetRecoilState(onboardingFirstnameAtom);
            const setLastname = useSetRecoilState(onboardingLastnameAtom);
            const setPassword = useSetRecoilState(onboardingPasswordAtom);
            const setSeed = useSetRecoilState(onboardingSeedAtom);

            setFirstname("Dev")
            setLastname("Dev")
            setPassword("aaa")
            const provider = new CarmentisProvider();
            const words = provider.generateWords();
            const defaultWorlds = "cushion shield urge essence fire stable pond minimum monkey quality exit present".split(" ");
            let seed = await provider.generateSeed(words);
            setSeed(seed);
            navigate("/setup-wallet")
        }

        populateWithDevWallet()
    }






    function moveToWalletCreation() {
        navigate("/create-password", {
            state: {
                nextStep: "/recovery-phrase"
            }
        })
    }

    function moveToWalletImportation() {
        navigate("/create-password",{
            state: {
                nextStep: "/import-wallet"
            }
        })
    }

    return (
        <div className="flex flex-col md:flex-row md:items-stretch md:gap-8">
            {/* Left column - Logo and brand */}
            <div className="flex flex-col items-center justify-center md:w-1/2 md:border-r md:border-gray-100 md:pr-6 pb-6 md:pb-0">
                <img 
                    src="https://docs.carmentis.io/img/carmentis-logo-color.png"
                    alt="Carmentis Logo"
                    className="w-20 h-auto mb-4"
                />
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("onboarding.create-wallet.title")}</h1>
                    <p className="text-gray-600">{t("onboarding.create-wallet.subtitle")}</p>
                </div>
            </div>

            {/* Right column - Options */}
            <div className="flex flex-col items-center justify-center md:w-1/2 md:pl-2 space-y-6">
                <div className="flex items-center mb-2 bg-gray-50 p-3 rounded-lg w-full max-w-sm">
                    <input 
                        id="default-checkbox" 
                        type="checkbox" 
                        value=""
                        className="w-4 h-4 text-blue-500 bg-white border-gray-300 rounded focus:ring-blue-400 focus:ring-2"
                    />
                    <label 
                        htmlFor="default-checkbox"
                        className="ms-2 text-sm text-gray-700"
                    >
                        I accept the Usage Conditions of Carmentis.
                    </label>
                </div>

                <div className="flex flex-col w-full max-w-sm space-y-3">
                    <button 
                        id="create-wallet" 
                        className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center"
                        onClick={moveToWalletCreation}
                    >
                        Create your wallet
                    </button>

                    <button 
                        id="import-wallet" 
                        className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-blue-500 font-medium rounded-lg border border-gray-200 shadow-sm transition-all duration-200 flex items-center justify-center"
                        onClick={moveToWalletImportation}
                    >
                        Import a wallet
                    </button>
                </div>
            </div>
        </div>
    );
}
