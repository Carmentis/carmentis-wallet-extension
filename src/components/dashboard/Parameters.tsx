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
}) : ReactElement {

    const [hasChanged, setHasChanged] = useState<boolean>(false);


    function onChange(updatedValue : string): void {
        setHasChanged(true);
        input.onChange(updatedValue);
    }

    function onSave() {
        setHasChanged(false);
        input.onSave()
    }

    return <>
        <input type="text" onChange={e => onChange(e.target.value)}
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


    // state for the name edition
    const [pseudo, setPseudo] = useState<string>(wallet.getActiveAccount().unwrap().getPseudo());
    const [email, setEmail] = useState<string>(activeAccount.getEmail().unwrapOr(""));
    const [verifiedEmail, setVerifiedEmail] = useState<boolean>(activeAccount.hasVerifiedEmail());

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
        setPseudo(activeAccount.getPseudo());
        setEmail(activeAccount.getEmail().unwrapOr(""));
        setVerifiedEmail(activeAccount.hasVerifiedEmail());

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

            // update the pseudo
            wallet.updatePseudo( activeAccountIndex, pseudo );

            // update the endpoints
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
            console.log(`[parameters] deleting ${activeAccount.getPseudo()}`)
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
                        value={pseudo}
                        onChange={setPseudo}
                        onSave={saveParameters}/>

                </div>


            </div>

            <div className="parameter-section">
                <h2>User Keys</h2>
                <div className="parameter-group">
                    <div className="parameter-title">User Authentication Private Key</div>
                    <div className="parameter-description">Your private signature authentication key.</div>
                    <input type="text" onClick={() => {
                        navigator.clipboard.writeText(userPrivateKey);
                    }}
                           className="parameter-input" readOnly={true} value={userPrivateKey}/>
                </div>
                <div className="parameter-group">
                    <div className="parameter-title">User Authentication Public Key</div>
                    <div className="parameter-description">Your public signature authentication key.</div>
                    <input type="text" onClick={() => {
                        navigator.clipboard.writeText(userPublicKey);
                    }}
                           className="parameter-input" readOnly={true} value={userPublicKey}/>
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