import {ReactElement, useContext, useEffect, useState} from "react";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk";
import {AuthenticationContext} from "@/entrypoints/main/FullPageApp.tsx";
import {Wallet} from "@/src/Wallet.tsx";
import {Encoders} from "@/src/Encoders.tsx";
import {Account} from "@/src/Account.tsx";

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
    const activeAccountIndex: number = authentication.activeAccountIndex.unwrap();
    const wallet : Wallet = authentication.wallet.unwrap();



    // state for the name edition
    const [pseudo, setPseudo] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [verifiedEmail, setVerifiedEmail] = useState<boolean>(false);

    // states for the endpoints
    const [dataEndpoint, setDataEndpoint] = useState(wallet.getDataEndpoint());
    const [nodeEndpoint, setNodeEndpoint] = useState(wallet.getNodeEndpoint());


    // states for the user keys
    const [userPrivateKey, setUserPrivateKey] = useState("");
    const [userPublicKey, setUserPublicKey] = useState("");

    // we place the content here to prevent infinite re-rendering
    useEffect(() => {
        const activeAccountIndex : number = authentication.activeAccountIndex.unwrap();
        const activeAccount : Account = wallet.getAccount(activeAccountIndex);
        setPseudo(activeAccount.getPseudo());
        setEmail(activeAccount.getEmail().unwrapOr(""))
        setVerifiedEmail(activeAccount.hasVerifiedEmail())
    }, [wallet]);

    useEffect(() => {
        // load the organization public key
        const seed = wallet.getSeed();
        Carmentis.derivePepperFromSeed(seed).then(pepper => {
            return Carmentis.deriveAuthenticationPrivateKey(pepper).then(privateKey => {
                return Carmentis.getPublicKey(privateKey).then(publicKey => {
                    setUserPrivateKey(Encoders.ToHexa(privateKey));
                    setUserPublicKey(Encoders.ToHexa(publicKey));
                })
            })
        }).catch(error => {
            console.error(error);
            // TODO: Handle error
        })
    }, [wallet]);


    // states for the operator keys
    const [organisationPrivateKey, setOrganisationPrivateKey] = useState<string>("");
    const [organisationPublicKey, setOrganisationPublicKey] = useState<string>("");

    useEffect(() => {
        // load the organization public key
        const seed = wallet.getSeed();
        Carmentis.deriveOrganizationPrivateKey(seed, 1).then( organisationPrivateKey => {
            return Carmentis.getPublicKey(organisationPrivateKey).then(organisationPublicKey => {
                setOrganisationPublicKey(Encoders.ToHexa(organisationPublicKey));
                setOrganisationPrivateKey(Encoders.ToHexa(organisationPrivateKey));
            })
        }).catch(error => {
            console.error(error);
        })
    }, [wallet]);



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



        // update the pseudo
        wallet.updatePseudo( activeAccountIndex, pseudo );

        const updateWallet = authentication.updateWallet.unwrap();
        updateWallet(wallet).then(_ => {

        });
    }

    return <>
        <h1>Parameters</h1>
        <div className="p-4">


            <div className="parameter-section">
                <h2>General</h2>
                <div className="parameter-group">
                    <div className="parameter-title">Account Name</div>
                    <div className="parameter-description">The name of your account.</div>
                    <InputWithDynamicConfirmSaveComponent
                        value={pseudo}
                        onChange={setPseudo}
                        onSave={saveParameters} />

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
                        onSave={saveParameters} />
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
                        onSave={saveParameters} />
                </div>
            </div>
        </div>
    </>
}