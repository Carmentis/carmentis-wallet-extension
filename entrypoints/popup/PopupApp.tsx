import '@/entrypoints/style.css'
import {useContext} from "react";
import {Splashscreen} from "@/src/components/commons/Splashscreen.tsx";
import {
    AccountCreatedContext,
    ApplicationInitializedContext, AuthenticationContext,
    AuthenticationContainer,
    ContextPage
} from "@/entrypoints/main/FullPageApp.tsx";
import Login from "@/src/components/commons/Login.tsx";
import {PopupDashboard} from "@/src/components/popup/PopupDashboard.tsx";
import {NoWalletDetected} from "@/src/components/popup/NoWalletDetected.tsx";
import {ActionMessageHandler} from "@/src/components/commons/ActionMessage.tsx";





export function PopupAppEntrypoint() {
    return <>
        <ContextPage>
            <ActionMessageHandler>
                <PopupApp></PopupApp>
            </ActionMessageHandler>
        </ContextPage>
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
                        { authentication.activeAccountIndex.isEmpty() &&
                            <Login></Login>
                        }
                        { !authentication.activeAccountIndex.isEmpty() &&
                          <>
                              <PopupDashboard></PopupDashboard>
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
