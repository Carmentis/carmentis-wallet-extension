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

import {ClientRequest, IncomingQR} from "@/utils/client-request.ts";
import React, {createContext, Dispatch, ReactElement, SetStateAction, useContext, useEffect, useState} from "react";
import {SessionStorage} from "@/utils/db/session-storage.tsx";
import {Optional} from "@/utils/optional.ts";
import {LoggerContext} from "@/entrypoints/components/authentication-manager.tsx";
import {atom, AtomEffect, useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {getUserKeyPair, Wallet} from "@/entrypoints/main/wallet.tsx";
import {clientRequestSessionState} from "@/entrypoints/states/client-request-session.state.tsx";

import * as sdk from '@cmts-dev/carmentis-sdk/client';
import {activeAccountState, walletState} from "@/entrypoints/contexts/authentication.context.tsx";
import {Encoders} from "@/entrypoints/main/Encoders.tsx";


// from https://stackoverflow.com/questions/58325771/how-to-generate-random-hex-string-in-javascript
/**
 * Generates a random hexadecimal string of the specified size.
 *
 * @param {number} size - The length of the hexadecimal string to generate.
 * @returns {string} A randomly generated hexadecimal string of the specified size.
 */
const randomHex = (size: number) => {
    let result = [];
    let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    for (let n = 0; n < size; n++) {
        result.push(hexRef[Math.floor(Math.random() * 16)]);
    }
    return result.join('');
}




/**
 * A callback function that is triggered when a new action message is received.
 *
 * @type {(message: IncomingQR) => void}
 * @param {IncomingQR} message - The client request message that contains the details of the new action.
 */
let onNewActionMessage : (message: IncomingQR) => void = function () {
};

/**
 * Handles action messages by updating the client request session state and rendering child components.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {ReactElement} props.children - The React child elements to be rendered within the component.
 * @return {JSX.Element} The rendered component containing the child elements.
 */
export function ClientRequestStateWriter(props: { children: ReactElement }): JSX.Element {
    const setClientRequestSession = useSetRecoilState(clientRequestSessionState);
    const wallet = useRecoilValue(walletState);
    const activeAccount= useRecoilValue(activeAccountState);

    useEffect(() => {
        const handleMessage = async (message: IncomingQR) => {
            console.log("[client request] Receiving a client request:", message);
            const keyPair = await getUserKeyPair(wallet, activeAccount);
            // TODO use the used private key
            const sk = sdk.crypto.generateKey256();
            const w = new sdk.wiWallet(sk);
            const data = await w.getRequestInfoFromQrCode(message.data);
            console.log(data);

            setClientRequestSession({
                id: randomHex(12),
                receivedAt: Date.now(),
                action: message.action,
                data: message.data,
                origin: message.origin,
                type: data.type,
            });
        };

        const listener = (message: IncomingQR, sender, sendResponse) => {
            console.log("[client request] Message received:", message);
            handleMessage(message);
            sendResponse({success: true});
            return false;
        };

        browser.runtime.onMessage.addListener(listener);

        return () => {
            browser.runtime.onMessage.removeListener(listener);
        };
    },[]);

    return <> {props.children} </>
}

// this function is used to be set once and to import messages received from outside of the component.
/*
browser.runtime.onMessage.addListener((message : IncomingQR, sender, sendResponse) => {
    console.log("[client request] Message received:", message)
    onNewActionMessage(message);
    sendResponse({success: true});
    return false;
});
 */

