import {createContext, useContext, useState} from "react";
import {Wallet} from "@/src/Wallet.tsx";
import '../style.css'
import {SecureWalletStorage} from "@/src/WalletStorage.tsx";
import {Account} from "@/src/Account.tsx";
import {Optional} from "@/src/Optional.tsx";
import pino from "pino";
import {res} from "pino-std-serializers";
import {SessionStorage} from "@/src/SessionStorage.tsx";
import Login from "@/src/components/popup/Login.tsx";
import Dashboard from "@/src/components/dashboard/Dashboard.tsx";
import {Splashscreen} from "@/src/components/commons/Splashscreen.tsx";
import OnBoarding from "@/src/components/onboarding/OnBoarding.tsx";

const noWallet = await SecureWalletStorage.IsEmpty();

const logger = pino({
    level: "debug",
})
export const LoggerContext = createContext(logger);




function App() {

    let [applicationInitialized, setApplicationInitialized] = useState<boolean>(false);
    let [accountCreated, setAccountCreated] = useState<boolean>(false);
    let [activeAccount, setActiveAccount] = useState<Optional<Account>>(Optional.Empty());
    let [wallet, setWallet] = useState<Optional<Wallet>>(Optional.Empty());


    let logger = useContext(LoggerContext);

    // search for installed wallet, if not redirect to onboarding page
    SecureWalletStorage.IsEmpty().then(isEmpty => {
        // if the storage do not contain any wallet, then the user do not have created an account and should be
        // redirected to the wallet creation page

        if (isEmpty) {
            logger.info("Wallet not found on local storage.")
            setAccountCreated(false);
            setApplicationInitialized(true);
            return
        }

        setAccountCreated(true);

        // if there is a wallet and an active account, good!
        if ( !wallet.isEmpty() && !activeAccount.isEmpty() ) {
            setApplicationInitialized(true);
            return
        }

        // search in session if a wallet exists
        SessionStorage.GetSessionState().then((result) => {
            // if the wallet exist in session, load the application state from session
            if (result.state) {
                logger.info("Wallet open but not active: use the wallet found in session")
                const sessionWallet = result.state.wallet;
                const sessionActiveAccount = result.state.activeAccount;
                setWallet(Optional.From(sessionWallet));
                setActiveAccount(Optional.From(sessionActiveAccount));
                setApplicationInitialized(true);
            } else {
                // otherwise, try with the wallet returned by the login page
                if (!wallet.isEmpty()) {
                    logger.info("Wallet open but no active account chosen: affect to the first one")
                    const walletObject : Wallet = wallet.unwrap();
                    const accounts : Account[] = walletObject.accounts;
                    const activeAccount = accounts[0]

                    // store the account in sesssion
                    SessionStorage.WriteSessionState({
                        state: {
                            activeAccount: activeAccount,
                            wallet: walletObject
                        }
                    }).then(_ => {
                        // and update the application state
                        setActiveAccount(Optional.From(activeAccount))
                        setApplicationInitialized(true);
                    });
                } else {
                    setApplicationInitialized(true);
                }
            }
        })




    }).catch(error => {
        console.error("An error occured while initializing the application: ", error)
    })

    return <>
        <LoggerContext.Provider value={logger}>
        { applicationInitialized &&
            <>
                { accountCreated &&
                    <>
                        { activeAccount.isEmpty() &&
                            <Login setWallet={setWallet}></Login>
                        }
                        { !activeAccount.isEmpty() &&
                            <Dashboard wallet={wallet.unwrap()} activeAccount={activeAccount.unwrap()}></Dashboard>
                        }
                    </>
                }

                { !accountCreated &&
                    <OnBoarding></OnBoarding>
                }
            </>
        }
        { !applicationInitialized &&
            <Splashscreen/>
        }
        </LoggerContext.Provider>
    </>;
}

export default App;