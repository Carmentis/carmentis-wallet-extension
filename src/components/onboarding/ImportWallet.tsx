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

import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import {CarmentisProvider} from "@/utils/CarmentisProvider.tsx";
import {useRecoilState, useSetRecoilState} from "recoil";
import {onboardingSeedAtom} from "@/components/onboarding/onboarding.state.ts";
import {ShieldLock, CheckCircle, ExclamationTriangle} from "react-bootstrap-icons";

export function ImportWallet() {

    const setSeed = useSetRecoilState(onboardingSeedAtom);
    // ensures that the password is provided and return to the password creation otherwise.
    const navigate = useNavigate();

    // states to import the wallet
    const [words, setWords] = useState<string>("");
    const [error, setError] = useState<string>("");


    /**
     * Event function called with the user attempt to import a wallet
     */
    function attemptImportWallet() {
        // try to separate every word
        let splitedWord = words.split(" ");

        if (splitedWord.length !=  12) {
            setError("Expected 12 words, separated by a whitespace.")
            return
        }

        importWallet( splitedWord ).then();
    }

    /**
     * Function called to import the wallet using the provided seed.
     */
    async function importWallet( words : string[] ) {
        const provider = new CarmentisProvider();
        let seed = await provider.generateSeed(words);
        setSeed(seed);
        navigate("/setup-wallet")
    }

    return (
        <div className="flex flex-col md:flex-row md:items-stretch md:gap-8">
            {/* Left column - Explanation */}
            <div className="flex flex-col md:w-1/2 md:border-r md:border-gray-100 md:pr-6 pb-6 md:pb-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Import your wallet</h1>
                <p className="text-gray-600 mb-6">
                    To import your wallet, insert the 12 words you have obtained during the creation of your wallet.
                    Once imported, your wallet will be restored.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                    <div className="flex items-start">
                        <ShieldLock className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                        <p className="text-sm text-blue-700">
                            Make sure you're in a private location before entering your recovery phrase.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-800">Why import a wallet?</h2>
                    <p className="text-gray-600">
                        Importing your wallet allows you to access your assets on a new device or after reinstalling the application.
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Important Notes:</h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                                Your recovery phrase must be entered in the correct order
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                                All 12 words must be from the official word list
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                                Double-check your spelling before submitting
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right column - Form */}
            <div className="flex flex-col md:w-1/2 md:pl-2">
                <div className="w-full max-w-sm mx-auto">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="words" className="block text-sm font-medium text-gray-700 mb-1">
                                Recovery Phrase
                            </label>
                            <div className="mt-2">
                                <input 
                                    id="words" 
                                    type="text"
                                    value={words}
                                    onChange={(e) => setWords(e.target.value)}
                                    required
                                    placeholder="Enter your 12-word recovery phrase"
                                    className="block w-full py-2.5 px-3 rounded-lg border border-gray-200 text-gray-900 shadow-sm 
                                        placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none 
                                        sm:text-sm transition-all"
                                />
                                <p className="mt-2 text-sm text-gray-500 flex items-center">
                                    <CheckCircle className="h-3 w-3 mr-1 text-gray-400" />
                                    Separate each word with a whitespace.
                                </p>
                                {error !== "" && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <ExclamationTriangle className="h-3 w-3 mr-1 text-red-600" />
                                        {error}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={attemptImportWallet}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg 
                                    shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 
                                    focus:outline-none focus:ring-4 focus:ring-blue-200
                                    transition-all duration-200"
                            >
                                Import your wallet
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
