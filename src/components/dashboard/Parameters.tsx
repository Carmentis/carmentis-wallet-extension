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

import React, {ReactElement, useContext, useEffect, useState} from "react";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk";
import {Wallet} from "@/src/Wallet.tsx";
import {Encoders} from "@/src/Encoders.tsx";
import {Optional} from "@/src/Optional.tsx";
import {useNavigate} from "react-router";
import login from "@/src/components/commons/Login.tsx";
import {AuthenticationContext, WalletContext} from "@/src/components/commons/AuthenticationGuard.tsx";
import {EmailValidation} from "@/src/components/dashboard/EmailValidation.tsx";

function InputWithDynamicConfirmSaveComponent(input: {
    value: string,
    onChange:(value: string) => void,
    onSave:() => void,
    protect: boolean
}) : ReactElement {

    const [hasChanged, setHasChanged] = useState<boolean>(false);


    /**
     * Event function fired when the field has changed.
     *
     * @param updatedValue
     */
    function onChange(updatedValue : string): void {
        setHasChanged(true);
        input.onChange(updatedValue);
    }

    /**
     * Event function fired when the user wants to save the field value.
     */
    function onSave() {
        setHasChanged(false);
        input.onSave()
    }

    return <>
        <input type={ input.protect ? "password" : "text" } onChange={e => onChange(e.target.value)}
               className="parameter-input" value={input.value}/>

        { hasChanged &&
            <div className="flex justify-end items-end space-x-1 mt-1">
                <button className="btn-primary btn-highlight" onClick={onSave}>Save</button>
            </div>
        }
    </>;
}

function InputNumberWithDynamicConfirmSaveComponent(input: {
    value: number,
    onChange:(value: number) => void,
    onSave:() => void,
}) : ReactElement {

    const [hasChanged, setHasChanged] = useState<boolean>(false);


    function onChange(updatedValue : number): void {
        setHasChanged(true);
        input.onChange(updatedValue);
    }

    function onSave() {
        setHasChanged(false);
        input.onSave()
    }

    return <>
        <input type="number" onChange={e => onChange(parseInt(e.target.value))}
               className="parameter-input" value={input.value}/>

        { hasChanged &&
            <div className="flex justify-end items-end space-x-1 mt-1">
                <button className="btn-primary btn-highlight" onClick={onSave}>Save</button>
            </div>
        }
    </>;
}

export default function Parameters() {

    const authentication = useContext(AuthenticationContext);
    const setWallet = authentication.setWallet.unwrap();
    const walletOption = useContext(WalletContext);
    const wallet : Wallet = walletOption.unwrap();
    const activeAccount = wallet.getActiveAccount().unwrap();


    // state for the pseudo, email and nonce edition
    const [pseudo, setPseudo] = useState<string>(wallet.getActiveAccount().unwrap().getPseudo());
    const [email, setEmail] = useState<string>(activeAccount.getEmail().unwrapOr(""));
    const [verifiedEmail, setVerifiedEmail] = useState<boolean>(activeAccount.hasVerifiedEmail());
    const [nonce, setNonce] = useState<number>(activeAccount.getNonce());
    const [showPrivateKeys, setShowPrivateKeys] = useState<boolean>(false);

    // state for account deletion
    const [accountDeletionPseudo, setAccountDeletionPseudo] = useState<string>("");


    // states for the endpoints
    const [dataEndpoint, setDataEndpoint] = useState(wallet.getDataEndpoint());
    const [nodeEndpoint, setNodeEndpoint] = useState(wallet.getNodeEndpoint());
    const [webSocketNodeEndpoint, setWebSocketNodeEndpoint] = useState(wallet.getWebSocketNodeEndpoint());


    // states for the user keys
    const [userPrivateKey, setUserPrivateKey] = useState("");
    const [userPublicKey, setUserPublicKey] = useState("");

    useEffect(() => {
        const activeAccount = wallet.getActiveAccount().unwrap();

        // change the pseudo
        console.log("Account:", activeAccount)
        setPseudo(activeAccount.getPseudo());
        setEmail(activeAccount.getEmail().unwrapOr(""));
        setVerifiedEmail(activeAccount.hasVerifiedEmail());
        setNonce(activeAccount.getNonce());

        // load the authentication key pair
        wallet.getAccountAuthenticationKeyPair(activeAccount)
            .then(keyPair => {
                setUserPrivateKey(Encoders.ToHexa(keyPair.privateKey));
                setUserPublicKey(Encoders.ToHexa(keyPair.publicKey));
            })

    }, [wallet]);



    const navigate = useNavigate();
    function goToMain() {
        navigate("/")
    }


    /**
     * Event function called when the user saves the parameters.
     */
    function saveParameters() {
        // prevent invalid parameters
        if ( pseudo === "" ) {
            // TODO notify the user
            console.error("[parameters] cannot update the active account pseudo with an empty pseudo")
            return
        }



        // update the wallet
        setWallet(walletOption => {
            const wallet = walletOption.unwrap();
            const activeAccountIndex = wallet.getActiveAccountIndex().unwrap();

            // update pseudo, nonce and endpoints
            wallet.updatePseudo( activeAccountIndex, pseudo );
            wallet.updateNonce( activeAccountIndex, nonce );
            wallet.setEndpoints(
                nodeEndpoint,
                dataEndpoint,
                webSocketNodeEndpoint
            );

            return Optional.From(wallet)
        });
    }

    /**
     * This function is fired when the user wants to delete the current active account.
     */
    function deleteActiveAccount() {
        if ( activeAccount.getPseudo() === accountDeletionPseudo ) {
            console.log(`[g] deleting ${activeAccount.getPseudo()}`)
            setWallet(walletOption => {
                const wallet = walletOption.unwrap();
                wallet.deleteActiveAccount();
                return Optional.From(wallet)
            })
        }
    }

    return <>
        <div className="md:container md:mx-auto">

            <div className="flex justify-between mb-2">
                <h1>Parameters</h1>
                <button onClick={goToMain} className="btn-primary btn-highlight">
                    Menu
                </button>
            </div>


            <EmailValidation/>

            <div className="parameter-section">
                <h2>General</h2>
                <div className="parameter-group">
                    <div className="parameter-title">Account Name</div>
                    <div className="parameter-description">The name of your account.</div>
                    <InputWithDynamicConfirmSaveComponent
                        protect={false}
                        value={pseudo}
                        onChange={setPseudo}
                        onSave={saveParameters}/>

                </div>

                <div className="parameter-group">
                    <div className="parameter-title">Account Nonce</div>
                    <div className="parameter-description">
                        The nonce of your account.
                        The nonce is used to derive a different key pair for each account.
                    </div>
                    <InputNumberWithDynamicConfirmSaveComponent
                        value={nonce}
                        onChange={setNonce}
                        onSave={saveParameters}/>

                </div>


            </div>

            <div className="parameter-section">
                <h2>User Keys</h2>
                <div className="parameter-group">
                    <div className="parameter-title">User Authentication Private Key</div>
                    <div className="parameter-description">Your private signature authentication key.</div>

                    <div className="parameter-icon-input bg-gray-200 flex flex-column p-2 rounded-md ">
                        <svg onClick={() => setShowPrivateKeys(!showPrivateKeys)}
                             xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="pr-2 mr-2 w-6 h-6 border-r-2 border-gray-300 hover:cursor-pointer"
                             viewBox="0 0 16 16">
                            <path
                                d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                            <path
                                d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                        </svg>

                        <input className="block w-full bg-gray-200"
                            type={showPrivateKeys ? "text" : "password"} onClick={() => {
                            navigator.clipboard.writeText(userPrivateKey);
                        }}  readOnly={true} value={userPrivateKey}/>
                    </div>


                </div>
                <div className="parameter-group">
                    <div className="parameter-title">User Authentication Public Key</div>
                    <div className="parameter-description">Your public signature authentication key.</div>
                    <input  type="text" onClick={() => {
                        navigator.clipboard.writeText(userPublicKey);
                    }}
                           className="parameter-input mb-2" readOnly={true} value={userPublicKey}/>
                    { userPublicKey &&
                        <div className="flex items-end">
                            <button
                                className="btn-primary btn-highlight"
                                onClick={() => {
                                    window.open(`mailto:?subject=Public%20key&body=Hey%20!%0A%0AHere%20is%20my%20public%20key%3A%0A%0A${userPublicKey}`)
                                }}>
                                Share your public key
                            </button>
                        </div>
                    }
                </div>
            </div>

            <div className="parameter-section">
                <h2>Oracles</h2>
                <div className="parameter-group">
                    <div className="parameter-title">Email</div>
                    <div className="parameter-description">
                        The email linked with account. {verifiedEmail &&
                        <span className="text-green-600">(Verified with the Carmentis email verification oracle)</span>}
                    </div>
                    <input type="text"
                           className="parameter-input" readOnly={true} value={email}/>
                </div>
                <div className="parameter-group">
                    <div className="parameter-title">Oracle Data Endpoint</div>
                    <div className="parameter-description">The endpoint of the oracle data server.</div>
                    <InputWithDynamicConfirmSaveComponent
                        protect={false}
                        value={dataEndpoint}
                        onChange={setDataEndpoint}
                        onSave={saveParameters}/>
                </div>
            </div>


            <div className="parameter-section">
                <h2>Network</h2>

                <div className="parameter-group">
                    <div className="parameter-title">Carmentis Node Endpoint</div>
                    <div className="parameter-description">
                        The endpoint of the carmentis node server.
                        Make sure that this node belongs to the Carmentis network.
                    </div>

                    <InputWithDynamicConfirmSaveComponent
                        protect={false}
                        value={nodeEndpoint}
                        onChange={setNodeEndpoint}
                        onSave={saveParameters}/>
                </div>

                <div className="parameter-group">
                    <div className="parameter-title">Node Web Socket Endpoint</div>
                    <div className="parameter-description">
                        The endpoint of the web socket node server.
                        Make sure that the node belongs to Carmentis network.
                    </div>

                    <InputWithDynamicConfirmSaveComponent
                        protect={false}
                        value={webSocketNodeEndpoint}
                        onChange={setWebSocketNodeEndpoint}
                        onSave={saveParameters}/>
                </div>
            </div>

            {wallet.getAllAccounts().length !== 1 &&
                <div className="parameter-section">
                    <h2>Dangerous Zone</h2>

                    <div className="parameter-group text-red-500">
                        <div className="parameter-title">Account Deletion</div>
                        <div className="parameter-description">
                            Delete the current account named <b>{activeAccount.getPseudo()}</b>.
                            Write your account name below to confirm the deletion.
                        </div>
                        <input type="text" className="parameter-input" value={accountDeletionPseudo}
                               onChange={e => setAccountDeletionPseudo(e.target.value)}/>
                        <div className="flex justify-end items-end space-x-1 mt-1">
                            <button className="btn-primary bg-red-500" onClick={deleteActiveAccount}>Delete</button>
                        </div>

                    </div>
                </div>
            }
        </div>
    </>
}