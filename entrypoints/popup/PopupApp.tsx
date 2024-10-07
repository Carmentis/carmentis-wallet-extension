import '@/entrypoints/style.css'
import {createContext, ReactElement,useContext, useEffect, useState} from "react";
import {Splashscreen} from "@/src/components/commons/Splashscreen.tsx";
import {
    AccountCreatedContext,
    ApplicationInitializedContext, AuthenticationContext,
    AuthenticationContainer,
    ContextPage, LoggerContext
} from "@/entrypoints/main/FullPageApp.tsx";
import Login from "@/src/components/commons/Login.tsx";
import {PopupDashboard} from "@/src/components/popup/PopupDashboard.tsx";
import {NoWalletDetected} from "@/src/components/popup/NoWalletDetected.tsx";
import {ActionMessage, ActionRequest} from "@/src/ActionMessage.tsx";
import {SessionStorage} from "@/src/SessionStorage.tsx";

// from https://stackoverflow.com/questions/58325771/how-to-generate-random-hex-string-in-javascript
const randomHex = (size: number) => {
    let result = [];
    let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    for (let n = 0; n < size; n++) {
        result.push(hexRef[Math.floor(Math.random() * 16)]);
    }
    return result.join('');
}


export interface ActionMessageContainer {
    actionMessages: ActionMessage[];
    clearMessages: () => void;
}

export class EmptyActionMessageContainer implements ActionMessageContainer {
    actionMessages: ActionMessage[] = [];

    clearMessages(): void {
    }
}

export const ActionMessageContext = createContext<ActionMessageContainer>(new EmptyActionMessageContainer())




let onNewActionMessage : (message: ActionMessage) => void = () => {};

export function ActionMessageHandler(props: { children: ReactElement }) {
    const [actionMessageContainer, setNotification] = useState<ActionMessageContainer>(new EmptyActionMessageContainer());
    const [allowMessageWriting, setAllowMessageWriting] = useState<boolean>(false);
    const logger = useContext(LoggerContext);

    /**
     * This function is called when a new message is received by the extension
     * .
     * @param message The received message (
     */
    onNewActionMessage = (message: ActionMessage) => {
        setNotification({
            actionMessages: [message],
            clearMessages: () => {
                setNotification(new EmptyActionMessageContainer())
            }
        })
    }

    useEffect(() => {
        SessionStorage.GetActionMessages().then(actionMessages => {
            logger.info(`[popup] loading ${actionMessages.length} messages from session`);
            setNotification({
                actionMessages: actionMessages,
                clearMessages: () => { setNotification(new EmptyActionMessageContainer()) }
            })
        });

        return () => {
            setAllowMessageWriting(true)
        }
    }, []);


    useEffect(() => {
        if (allowMessageWriting) {
            logger.info(`[popup] writing ${actionMessageContainer.actionMessages.length} messages to session`)
            SessionStorage.WriteActionsMessages(actionMessageContainer.actionMessages).then(() => {
                logger.info("[popup] writing done")
            });
        }

    }, [actionMessageContainer]);






    return <>
        <ActionMessageContext.Provider value={actionMessageContainer}>
            {props.children}
        </ActionMessageContext.Provider>
    </>
}
// TODO include the origin
// this function is used to be set once and to import messages received from outside of the component.
browser.runtime.onMessage.addListener((message : ActionRequest) => {
    console.info("[popup] Add message:", message)
    onNewActionMessage({
        id: randomHex(12),
        receivedAt: Date.now(),
        action: message.action,
        data: message.data,
        origin: message.origin
    })
});



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

    let actionMessages : ActionMessage[] = useContext(ActionMessageContext);

    return <>
        { !applicationInitialized &&
            <Splashscreen></Splashscreen>
        }
        { applicationInitialized &&
            <>
                { accountCreated &&
                    <>
                        { authentication.activeAccount.isEmpty() &&
                            <Login></Login>
                        }
                        { !authentication.activeAccount.isEmpty() &&
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
