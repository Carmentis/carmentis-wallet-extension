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
import {useRecoilState, useSetRecoilState} from "recoil";

import {
    QRDataClientRequest,
} from "@/entrypoints/background.ts";
import {Runtime} from "webextension-polyfill";
import MessageSender = Runtime.MessageSender;
import {clientRequestSessionState} from "@/states/globals.tsx";



/**
 * Handles action messages by updating the client request session state and rendering child components.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {ReactElement} props.children - The React child elements to be rendered within the component.
 * @return {JSX.Element} The rendered component containing the child elements.
 */
export function ClientRequestListener(props: { children: ReactElement }): JSX.Element {
    const [clientRequestSession, setClientRequestSession] = useRecoilState(clientRequestSessionState);


    useEffect(() => {
        const handleMessage = async (message: QRDataClientRequest) => {
            console.log("[client request state writer] Received message:", message)

            // here we only handle new client request
            if (message.data) {
                if (clientRequestSession === undefined) {
                    setClientRequestSession(message)
                } else {
                    console.warn(`The client request session is already set. Ignoring incoming request:`, message.data);
                }
            }
        };

        const listener = (
            message: QRDataClientRequest,
            sender: MessageSender,
            sendResponse: (message: unknown) => void
        ) => {
            console.log("[client request] Message received:", message);
            handleMessage(message);
            sendResponse({success: true});
            return true;
        };

        browser.runtime.onMessage.addListener(listener);

        return () => {
            browser.runtime.onMessage.removeListener(listener);
        };
    },[]);

    return <> {props.children} </>
}