/*
 * Copyright (c) Carmentis. All rights reserved.
 * Licensed under the Apache 2.0 licence.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import {ActionMessage, ActionRequest} from "@/entrypoints/main/ActionMessage.tsx";
import React, {createContext, Dispatch, ReactElement, SetStateAction, useContext, useEffect, useState} from "react";
import {SessionStorage} from "@/entrypoints/main/session-storage.tsx";
import {Optional} from "@/entrypoints/main/Optional.tsx";
import {Dispatcher} from "undici-types";
import {LoggerContext} from "@/entrypoints/components/authentication-manager.tsx";


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
