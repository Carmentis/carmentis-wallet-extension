import {createContext, Dispatch, ReactElement,
    SetStateAction,
    useContext,
    useState
} from "react";
import {Wallet} from "@/src/Wallet.tsx";
import "./global.css"
import {SecureWalletStorage} from "@/src/WalletStorage.tsx";
import {Optional} from "@/src/Optional.tsx";
import pino from "pino";
import {SessionStorage} from "@/src/SessionStorage.tsx";
import Dashboard from "@/src/components/dashboard/Dashboard.tsx";
import {Splashscreen} from "@/src/components/commons/Splashscreen.tsx";
import OnBoarding from "@/src/components/onboarding/OnBoarding.tsx";
import Login from "@/src/components/commons/Login.tsx";
import {CarmentisProvider} from "@/src/providers/carmentisProvider.tsx";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js"

const logger = pino({
    level: "debug",
})

export interface AuthenticationContainer {
    password : Optional<string>,
    setPassword: Optional<Dispatch<SetStateAction<Optional<string>>>>,
    wallet: Optional<Wallet>,
    activeAccountIndex: Optional<number>,
    loadWalletInSession: Optional<(password : string, wallet: Wallet) => Promise<void>>,
    updateWallet: Optional<(wallet: Wallet) => Promise<void>>,
    Disconnect: () => void,
}

// create the different contexts
export const LoggerContext = createContext(logger);
export const ApplicationInitializedContext = createContext<boolean>(false);
export const AccountCreatedContext = createContext<boolean>(false);
export const AuthenticationContext = createContext<AuthenticationContainer>({
    password : Optional.Empty(),
    wallet: Optional.Empty(),
    activeAccountIndex: Optional.Empty(),
    loadWalletInSession: Optional.Empty(),
    updateWallet: Optional.Empty(),
    setPassword: Optional.Empty(),
    Disconnect: () => {
    }
})


function configureEndpointsFromWallet( wallet : Optional<Wallet> ) {
    if (wallet.isEmpty()) {
        console.warn("Endpoints not set since the provided wallet is not defined.")
    } else {
        // configure the SDK based on the wallet preferences
        Carmentis.registerDataEndpoint(wallet.unwrap().getDataEndpoint());
        Carmentis.registerNodeEndpoint(wallet.unwrap().getNodeEndpoint());
    }
}

export function ContextPage(props: { children: ReactElement }) {
    let [applicationInitialized, setApplicationInitialized] = useState<boolean>(false);
    let [accountCreated, setAccountCreated] = useState<boolean>(false);
    let [activeAccountIndex, setActiveAccountIndex] = useState<Optional<number>>(Optional.Empty());
    let [wallet, setWallet] = useState<Optional<Wallet>>(Optional.Empty());
    let [password, setPassword] = useState<Optional<string>>(Optional.Empty());



    let logger = useContext(LoggerContext);

    /**
     * This function is used to load a wallet.
     *
     * This function write the wallet in session storage but **not** in local storage.
     *
     * @param password
     * @param wallet
     */
    function loadWalletInSession( password : string, wallet : Wallet ) : Promise<void> {
        console.log("[context page] Load wallet in session")

        return new Promise((resolve, reject) => {
            SessionStorage.WriteSessionState({
                state: {
                    activeAccountIndex: 0,
                    wallet: wallet,
                    password: password
                }
            }).then(_ => {
                // update the wallet
                setActiveAccountIndex(Optional.From(0))
                setPassword(Optional.From(password))
                setWallet(Optional.From(wallet))
                configureEndpointsFromWallet(Optional.From(wallet))
                resolve();
            }).catch(error => {
                reject(error)
            });
        })
    }

    /**
     * This function is called when the user update the wallet and store it in local.
     *
     * This function is generally used when the session is already initialized and when an update of the wallet
     * is required for the long-term (using the local storage).
     * @constructor
     */
    function updateWallet( wallet : Wallet ) : Promise<void> {
        console.log("[context page] Update of the wallet:", wallet)
        return new Promise((resolve, reject) => {
            // store the wallet in the storage session
            const provider = new CarmentisProvider();
            SecureWalletStorage.CreateSecureWalletStorage(provider, password.unwrap()).then(storage => {
                storage.writeWalletContextToLocalStorage( wallet ).then(() => {

                    // store the wallet in session
                    SessionStorage.WriteSessionState({
                        state: {
                            activeAccountIndex: activeAccountIndex.unwrap(),
                            wallet: wallet,
                            password: password.unwrap()
                        }
                    }).then(_ => {
                        // update the wallet
                        setWallet(Optional.From(wallet))
                        configureEndpointsFromWallet(Optional.From(wallet))
                        resolve();
                    }).catch(error => {
                        reject(error)
                    });
                }).catch(error => {
                    reject(error)
                })
            });
        });
    }

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
        if ( !wallet.isEmpty() && !activeAccountIndex.isEmpty() ) {
            setApplicationInitialized(true);
            return
        }

        // search in session if a wallet exists
        SessionStorage.ContainsWallet().then((isWalletInSession) => {
            // if the wallet exist in session, load the application state from session
            if (isWalletInSession) {
                SessionStorage.GetSessionState().then(result => {
                    logger.info("Wallet open but not active: use the wallet found in session")
                    const sessionWallet = result.state.wallet;
                    const sessionActiveAccountIndex = result.state.activeAccountIndex;
                    const sessionPassword = result.state.password;
                    setWallet(Optional.From(sessionWallet));
                    configureEndpointsFromWallet(Optional.From(sessionWallet));
                    setActiveAccountIndex(Optional.From(sessionActiveAccountIndex));
                    setPassword(Optional.From(sessionPassword));
                    setApplicationInitialized(true);
                })

            } else {
                // otherwise, try with the wallet returned by the login page
                if (!wallet.isEmpty()) {
                    logger.info("Wallet open but no active account chosen: affect to the first one")
                    const walletObject : Wallet = wallet.unwrap();
                    const activeAccountIndex = 0

                    // store the account in session
                    SessionStorage.WriteSessionState({
                        state: {
                            activeAccountIndex: activeAccountIndex,
                            wallet: walletObject,
                            password: password.unwrap()
                        }
                    }).then(_ => {
                        // and update the application state
                        setActiveAccountIndex(Optional.From(activeAccountIndex))
                        setApplicationInitialized(true);
                    });
                } else {
                    setApplicationInitialized(true);
                }
            }
        })




    }).catch(error => {
        console.error("An error occured while initializing the application: ", error)
    });


    // create the authentication context
    let authenticationData : AuthenticationContainer = {
        password: password,
        wallet: wallet,
        activeAccountIndex: activeAccountIndex,
        loadWalletInSession: Optional.From(loadWalletInSession),
        updateWallet: Optional.From(updateWallet),
        setPassword: Optional.From(setPassword),
        Disconnect: () => {
            SessionStorage.Clear();
            setWallet(Optional.Empty());
            setActiveAccountIndex(Optional.Empty());
            setPassword(Optional.Empty());
        }
    }

    return <>
    <LoggerContext.Provider value={logger}>
        <AuthenticationContext.Provider value={authenticationData}>
                <AccountCreatedContext.Provider value={accountCreated}>
                    <ApplicationInitializedContext.Provider value={applicationInitialized}>
                        {props.children}
                    </ApplicationInitializedContext.Provider>
                </AccountCreatedContext.Provider>
        </AuthenticationContext.Provider>
    </LoggerContext.Provider>
    </>;


}

export function FullPageEntrypoint() {
    return <ContextPage>
        <FullPageApp></FullPageApp>
    </ContextPage>
}


function FullPageApp() {


    let applicationInitialized = useContext(ApplicationInitializedContext);
    let accountCreated = useContext(AccountCreatedContext);
    let authentication : AuthenticationContainer = useContext(AuthenticationContext);


    return <>
        { applicationInitialized &&
            <>
                { accountCreated &&
                    <>
                        { authentication.activeAccountIndex.isEmpty() &&
                            <Login></Login>
                        }
                        { !authentication.activeAccountIndex.isEmpty() &&
                            <Dashboard></Dashboard>
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
    </>;


}

export default FullPageApp;