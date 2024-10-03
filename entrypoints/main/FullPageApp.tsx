import {createContext, Dispatch, JSXElementConstructor, ReactElement, ReactNode, ReactPortal,
    SetStateAction,
    useContext,
    useState
} from "react";
import {Wallet} from "@/src/Wallet.tsx";
import "./global.css"
import {SecureWalletStorage} from "@/src/WalletStorage.tsx";
import {Account} from "@/src/Account.tsx";
import {Optional} from "@/src/Optional.tsx";
import pino from "pino";
import {SessionStorage} from "@/src/SessionStorage.tsx";
import Dashboard from "@/src/components/dashboard/Dashboard.tsx";
import {Splashscreen} from "@/src/components/commons/Splashscreen.tsx";
import OnBoarding from "@/src/components/onboarding/OnBoarding.tsx";
import Login from "@/src/components/commons/Login.tsx";

const logger = pino({
    level: "debug",
})

export interface AuthenticationContainer {
    wallet: Optional<Wallet>,
    activeAccount: Optional<Account>,
    updateWallet: Dispatch<SetStateAction<Optional<Wallet>>> | null
    clearAuthentication: () => void,
}

// create the different contexts
export const LoggerContext = createContext(logger);
export const ApplicationInitializedContext = createContext<boolean>(false);
export const AccountCreatedContext = createContext<boolean>(false);
export const AuthenticationContext = createContext<AuthenticationContainer>({
    wallet: Optional.Empty(),
    activeAccount: Optional.Empty(),
    updateWallet: null,
    clearAuthentication: () => {
    }
})

export function ContextPage(props: { children: ReactElement }) {
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
        SessionStorage.ContainsWallet().then((isWalletInSession) => {
            // if the wallet exist in session, load the application state from session
            if (isWalletInSession) {
                SessionStorage.GetSessionState().then(result => {
                    logger.info("Wallet open but not active: use the wallet found in session")
                    const sessionWallet = result.state.wallet;
                    const sessionActiveAccount = result.state.activeAccount;
                    setWallet(Optional.From(sessionWallet));
                    setActiveAccount(Optional.From(sessionActiveAccount));
                    setApplicationInitialized(true);
                })

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
    });


    // create the authentication context
    let authenticationData : AuthenticationContainer = {
        wallet: wallet,
        activeAccount: activeAccount,
        updateWallet: setWallet,
        clearAuthentication: () => {
            SessionStorage.Clear();
            setWallet(Optional.Empty());
            setActiveAccount(Optional.Empty());
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
                        { authentication.activeAccount.isEmpty() &&
                            <Login setWallet={authentication.updateWallet}></Login>
                        }
                        { !authentication.activeAccount.isEmpty() &&
                            <Dashboard wallet={authentication.wallet.unwrap()} activeAccount={authentication.activeAccount.unwrap()}></Dashboard>
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