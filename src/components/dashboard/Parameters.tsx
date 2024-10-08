import {useContext, useEffect, useState} from "react";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk";
import {AuthenticationContext} from "@/entrypoints/main/FullPageApp.tsx";
import {Wallet} from "@/src/Wallet.tsx";
import {Encoders} from "@/src/Encoders.tsx";
import {Account} from "@/src/Account.tsx";

export default function Parameters() {

    const authentication = useContext(AuthenticationContext);
    const wallet : Wallet = authentication.wallet.unwrap();



    // state for the name edition
    const [pseudo, setPseudo] = useState<string>("");

    // states for the endpoints
    const [dataEndpoint, setDataEndpoint] = useState(wallet.getDataEndpoint());
    const [nodeEndpoint, setNodeEndpoint] = useState(wallet.getNodeEndpoint());


    // states for the user keys
    const [userPrivateKey, setUserPrivateKey] = useState("");
    const [userPublicKey, setUserPublicKey] = useState("");

    useEffect(() => {
        const activeAccountIndex : number = authentication.activeAccountIndex.unwrap();
        const activeAccount : Account = wallet.getAccount(activeAccountIndex);
        setPseudo(activeAccount.getPseudo());
    }, [wallet]);

    useEffect(() => {
        // load the organization public key
        const seed = wallet.getSeed();
        Carmentis.derivePepperFromSeed(seed, 1).then(pepper => {
            return Carmentis.deriveUserPrivateKey(pepper, 1).then(privateKey => {
                return Carmentis.getPublicKey(privateKey).then(publicKey => {
                    setUserPrivateKey(Encoders.ToHexa(privateKey));
                    setUserPublicKey(Encoders.ToHexa(publicKey));
                })
            })
        }).catch(error => {
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
        
    }

    return <>
        <h1>Parameters</h1>
        <div className="p-4">


            <div className="parameter-section">
                <h2>General</h2>
                <div className="parameter-group">
                    <div className="parameter-title">Account Name</div>
                    <div className="parameter-description">The name of your account.</div>
                    <input type="text" onChange={e => setPseudo(e.target.value)}
                           className="parameter-input" value={pseudo}/>
                </div>

            </div>

            <div className="parameter-section">
                <h2>User Keys</h2>
                <div className="parameter-group">
                    <div className="parameter-title">User Private Key</div>
                    <div className="parameter-description">Your private signature key.</div>
                    <input type="text" onClick={() => {
                        navigator.clipboard.writeText(userPrivateKey);
                    }}
                           className="parameter-input" readOnly={true} value={userPrivateKey}/>
                </div>
                <div className="parameter-group">
                    <div className="parameter-title">User Public Key</div>
                    <div className="parameter-description">Your public signature key.</div>
                    <input type="text" onClick={() => {
                        navigator.clipboard.writeText(userPublicKey);
                    }}
                           className="parameter-input" readOnly={true} value={userPublicKey}/>
                </div>
            </div>


            <div className="parameter-section">
                <h2>Organisation Keys</h2>
                <div className="parameter-group">
                    <div className="parameter-title">Organization Private Key</div>
                    <div className="parameter-description">The private signature key of the operator.</div>
                    <input type="text" onClick={() => {
                        navigator.clipboard.writeText(organisationPrivateKey);
                    }}
                           className="parameter-input" readOnly={true} value={organisationPrivateKey}/>
                </div>
                <div className="parameter-group">
                    <div className="parameter-title">Organization Public Key</div>
                    <div className="parameter-description">The public signature key of the operator.</div>
                    <input type="text" onClick={() => {
                        navigator.clipboard.writeText(organisationPublicKey);
                    }}
                           className="parameter-input" readOnly={true} value={organisationPublicKey}/>
                </div>
            </div>


            <div className="parameter-section">
                <h2>Endpoints</h2>
                <div className="parameter-group">
                    <div className="parameter-title">Data Endpoint</div>
                    <div className="parameter-description">The endpoint of the data server.</div>
                    <input type="text"
                           className="parameter-input" value={dataEndpoint}
                           onChange={event => setDataEndpoint(event.target.value)}/>
                </div>
                <div className="parameter-group">
                    <div className="parameter-title">Node Endpoint</div>
                    <div className="parameter-description">The endpoint of the node server.</div>
                    <input type="text" onChange={event => setNodeEndpoint(event.target.value)}
                           className="parameter-input" value={nodeEndpoint}/>
                </div>
            </div>

            <div className="items-end">
                <button className="btn-primary btn-highlight" onClick={saveParameters()}>Save</button>
            </div>
        </div>
    </>
}