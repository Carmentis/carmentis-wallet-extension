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

import React, {ReactElement, useEffect} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {getUserKeyPair} from "@/entrypoints/main/wallet.tsx";
import {clientRequestSessionState} from "@/entrypoints/states/client-request-session.state.tsx";

import {
    ClientRequestPayload,
} from "@/entrypoints/background.ts";



/**
 * Handles action messages by updating the client request session state and rendering child components.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {ReactElement} props.children - The React child elements to be rendered within the component.
 * @return {JSX.Element} The rendered component containing the child elements.
 */
export function ClientRequestStateWriter(props: { children: ReactElement }): JSX.Element {
    const setClientRequestSession = useSetRecoilState(clientRequestSessionState);

    useEffect(() => {
        const handleMessage = async (message: ClientRequestPayload<unknown>|unknown) => {
            console.log("[client request state writer] Received message:", message)

            // here we only handle new client request
            if ((message as ClientRequestPayload<unknown>).clientRequestType) {
                setClientRequestSession(message)
            }
            /*
            const payload = message.payload as ClientRequestPayload<unknown>;
            const isAwaitingForUserApprove = (payload as ClientRequestPayload<ClientRequestData<unknown>>).clientRequestType === CLIENT_REQUEST_TYPE.ASK_USER_FOR_APPROVE;
            if (isAwaitingForUserApprove) {
                const request = message as BackgroundRequest<ClientRequestPayload<ClientRequestData<unknown>>>;

                const clientRequestPayload = newClientRequestMessage.payload;
                const data = clientRequestPayload.data;
                const preflightClientRequest = {
                    id: randomHex(12),
                    qrId: data.qrId,
                    receivedAt: Date.now(),
                    origin: data.origin,
                    timestamp: data.timestamp,
                    serverUrl: data.serverUrl,
                }


                console.log("[client request] Receiving a client request:", message);
                const keyPair = await getUserKeyPair(wallet, activeAccount);

                console.log("[client request state writer]", response);

                console.log('[client request state writer] put in session the request payload:', request.payload)
                setClientRequestSession(request.payload)
            }
             */

        };

        const listener = (message: ClientRequestPayload<unknown>|unknown, sender, sendResponse) => {
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

