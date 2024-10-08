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
    const walletContext = Wallet.CreateFromBytes(seed);


    function redirectToMainPage() {
        (async () => {
            await  browser.runtime.sendMessage({
                action: "open",
                location: "main"
            });
        })();
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
                    <p>You will be redirected to the main page.</p>
                </div>
            }
        </div>
    </>);
}