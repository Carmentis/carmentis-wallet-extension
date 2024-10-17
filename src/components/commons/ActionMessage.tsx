import {ActionMessage, ActionRequest} from "@/src/ActionMessage.tsx";
import React, {createContext, Dispatch, ReactElement, SetStateAction, useContext, useEffect, useState} from "react";
import {SessionStorage} from "@/src/SessionStorage.tsx";
import {Optional} from "@/src/Optional.tsx";
import {Dispatcher} from "undici-types";
import {LoggerContext} from "@/src/components/commons/AuthenticationGuard.tsx";


// from https://stackoverflow.com/questions/58325771/how-to-generate-random-hex-string-in-javascript
const randomHex = (size: number) => {
    let result = [];
    let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    for (let n = 0; n < size; n++) {
        result.push(hexRef[Math.floor(Math.random() * 16)]);
    }
    return result.join('');
}


export class ActionMessageContainer {
    private _actionMessageOption : Optional<ActionMessage[]>;
    private _setActionMessageOption : Optional<Dispatch<SetStateAction<ActionMessage[]>>>

    constructor( actionMessage : Optional<ActionMessage[]>, setActionMessage : Optional<Dispatch<SetStateAction<ActionMessage[]>>> ) {
        this._actionMessageOption = actionMessage;
        this._setActionMessageOption = setActionMessage;
    }


    length() : number {
        return this._actionMessageOption.isEmpty() ?
            0 :
            this._actionMessageOption.unwrap().length
    }


}



export const ActionMessageContext = createContext<{
    actionMessages: ActionMessage[];
    setActionMessages: React. Dispatch<React. SetStateAction<ActionMessage[]>>;
}|null>(null)
let onNewActionMessage : (message: ActionMessage) => void = () => {};

export function ActionMessageHandler(props: { children: ReactElement }) {
    const [actionMessages, setNotification] = useState<ActionMessage[]>([]);
    const [allowMessageWriting, setAllowMessageWriting] = useState<boolean>(false);
    const logger = useContext(LoggerContext);

    /**
     * This function is called when a new message is received by the extension
     * .
     * @param message The received message (
     */
    onNewActionMessage = (message: ActionMessage) => {
        console.log("[action message] update the new action message")
        setNotification([message])
    }

    useEffect(() => {
        SessionStorage.GetActionMessages().then(actionMessages => {
            logger.info(`[popup] loading ${actionMessages.length} messages from session`);
            setNotification(actionMessages)
        });

        return () => {
            setAllowMessageWriting(true)
        }
    }, []);



    useEffect(() => {
        console.log("[popup] Action messages updated:", actionMessages, allowMessageWriting);
        if (allowMessageWriting) {
            logger.info(`[popup] writing ${actionMessages.length} messages to session:`, actionMessages)
            SessionStorage.WriteActionsMessages(actionMessages).then(() => {
                logger.info("[popup] writing done")
            });
        }

    }, [actionMessages]);








    return <>
        <ActionMessageContext.Provider value={{actionMessages, setActionMessages: setNotification}}>
            {props.children}
        </ActionMessageContext.Provider>
    </>
}

// this function is used to be set once and to import messages received from outside of the component.
browser.runtime.onMessage.addListener((message : ActionRequest) => {
    console.info("[popup] Add message:", message)
    onNewActionMessage({
        id: randomHex(12),
        receivedAt: Date.now(),
        action: message.action,
        data: message.data,
        origin: message.origin,
        type: "unknown"
    })
});
