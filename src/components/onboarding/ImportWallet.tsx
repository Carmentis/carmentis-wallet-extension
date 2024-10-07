import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import {CarmentisProvider} from "@/src/providers/carmentisProvider.tsx";

export function ImportWallet() {

    // ensures that the password is provided and return to the password creation otherwise.
    const location = useLocation();
    const navigate = useNavigate();
    const password = location.state.password
    if (!password) {
        useEffect(() => {
            navigate("/create-password", {
                state: {
                    nextStep: "/import-wallet"
                }
            });
        }, []);

    }

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
        navigate("/setup-wallet", {
            state: {
                password: password,
                seed: seed,
            }
        })
    }

    return (
        <>
            <h1 className="title justify-center align-content-center align-items-center flex">Import your wallet</h1>
            <p className="text-justify mb-8">
                To import your wallet, insert the 12 words you have obtained during the creation of your wallet.

                Once imported, your wallet will be restored.
            </p>

            <div className="flex  flex-wrap mb-4">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="space-y-6 mb-3">
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="words"
                                       className="block text-sm font-medium leading-6 text-gray-900">Passphrase</label>
                            </div>
                            <div className="mt-2">
                                <input id="words" type="text"
                                       value={words}
                                       onChange={(e) => setWords(e.target.value)}
                                       required
                                       className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-300 sm:text-sm sm:leading-6"/>
                                <p className="mt-2">
                                    Separate each word with a whitespace.
                                </p>
                                {error !== "" &&
                                    <p className="mt-2 text-pink-600">
                                        {error}
                                    </p>
                                }
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={attemptImportWallet}
                                className="flex w-full justify-center rounded-md bg-green-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300">
                                Import your wallet
                            </button>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
}