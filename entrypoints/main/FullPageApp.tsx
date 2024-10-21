import Dashboard from "@/src/components/dashboard/Dashboard.tsx";
import {Splashscreen} from "@/src/components/commons/Splashscreen.tsx";
import OnBoarding from "@/src/components/onboarding/OnBoarding.tsx";
import Login from "@/src/components/commons/Login.tsx";
import {
    AccountCreatedContext,
    ApplicationInitializedContext, AuthenticationContainer, AuthenticationContext,
    AuthenticationGuard
} from "@/src/components/commons/AuthenticationGuard.tsx";
import {ReactElement, useContext} from "react";
import {AccountSelection} from "@/src/components/commons/AccountSelection.tsx";

/**
 * This function returns the full page entrypoint called by the main application.
 * The main interest of this component is to encapsulate the full page application inside
 * the AuthenticationGuard component, allowing every component to access numerous contexts.
 *
 * Graphically, we have (root@main.tsx -> FullPageEntrypoint@FullPageApp.tsx)
 * @constructor
 */
export function FullPageEntrypoint() : ReactElement {
    return <AuthenticationGuard>
        <FullPageApp></FullPageApp>
    </AuthenticationGuard>
}


/**
 * This function returns the full page application called by the full page entrypoint.
 *
 * Graphically, we have (root@main.tsx -> (FullPageEntrypoint -> FullPageApp)@FullPageApp.tsx)
 *
 * @constructor
 */
function FullPageApp() : ReactElement {

    let applicationInitialized = useContext(ApplicationInitializedContext);
    let accountCreated = useContext(AccountCreatedContext);
    let authentication : AuthenticationContainer = useContext(AuthenticationContext);


    return <>
        { applicationInitialized &&
            <>
                { accountCreated &&
                    <>
                        { authentication.wallet.isEmpty() &&
                            <Login></Login>
                        }
                        { !authentication.wallet.isEmpty() &&
                            <>
                                { authentication.wallet.unwrap().getActiveAccountIndex().isEmpty() &&
                                    <AccountSelection/>
                                }
                                { authentication.wallet.unwrap().getActiveAccountIndex().isSome() &&
                                    <Dashboard key={authentication.wallet.unwrap().getActiveAccount().unwrap().getId()}></Dashboard>
                                }
                            </>
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