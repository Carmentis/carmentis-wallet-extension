import '@/entrypoints/style.css'
import {useContext} from "react";
import {Splashscreen} from "@/src/components/commons/Splashscreen.tsx";
import Login from "@/src/components/commons/Login.tsx";
import {PopupDashboard} from "@/src/components/popup/PopupDashboard.tsx";
import {NoWalletDetected} from "@/src/components/popup/NoWalletDetected.tsx";
import {ActionMessageHandler} from "@/src/components/commons/ActionMessage.tsx";
import {AccountSelection} from "@/src/components/commons/AccountSelection.tsx";
import {
    AccountCreatedContext,
    ApplicationInitializedContext, AuthenticationContainer, AuthenticationContext,
    AuthenticationGuard
} from "@/src/components/commons/AuthenticationGuard.tsx";


/**
 *
 * @constructor
 */
export function PopupAppEntrypoint() {
    return <>
        <AuthenticationGuard>
            <ActionMessageHandler>
                <PopupApp></PopupApp>
            </ActionMessageHandler>
        </AuthenticationGuard>
    </>
}


function PopupApp() {


    let applicationInitialized = useContext(ApplicationInitializedContext);
    let accountCreated = useContext(AccountCreatedContext);
    let authentication : AuthenticationContainer = useContext(AuthenticationContext);


    return <>
        { !applicationInitialized &&
            <Splashscreen></Splashscreen>
        }
        { applicationInitialized &&
            <>
                { accountCreated &&
                    <>
                        { authentication.wallet.isEmpty() &&
                            <Login></Login>
                        }
                        { !authentication.wallet.isEmpty() &&
                          <>
                              { !authentication.wallet.unwrap().getActiveAccount().isEmpty() &&
                                  <PopupDashboard></PopupDashboard>
                              }
                              { authentication.wallet.unwrap().getActiveAccount().isEmpty() &&
                                  <AccountSelection></AccountSelection>
                              }

                          </>

                        }
                    </>
                }
                { !accountCreated &&
                    <NoWalletDetected/>
                }
            </>
        }

    </>;
}

export default PopupApp;
