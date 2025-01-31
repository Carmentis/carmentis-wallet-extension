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

import {Runtime} from "webextension-polyfill";
import Port = Runtime.Port;
import * as sdk from '@cmts-dev/carmentis-sdk/client';
import {undefined} from "zod";


export enum BACKGROUND_REQUEST_TYPE {
    CLIENT_REQUEST = "clientRequest",
    CLIENT_RESPONSE = "clientResponse",
    BROWSER_OPEN_ACTION = "browserAction"
}

export enum CLIENT_REQUEST_TYPE {
    QR_REQUEST = "newClientRequest",
    ASK_USER_FOR_APPROVE = "getDataFromServer",
    RESPONSE_DATA_FROM_SERVER = "responseDataFromServer",
    ACCEPT_AUTHENTICATION_REQUEST = "acceptAuthenticationRequest",
    AUTHENTICATION = "authentication"
}

export type BrowserActionPayload = {
    location: "main" | "onboarding"
}


export type BackgroundRequest<T> = {
    backgroundRequestType: BACKGROUND_REQUEST_TYPE,
    source?: string,
    payload: T
}


export type ClientRequestPayload<T> = {
    clientRequestType: CLIENT_REQUEST_TYPE,
    timestamp: number,
    origin: string,
    data: T
}

export type ClientResponsePayload<T> = {
    clientRequestType: CLIENT_REQUEST_TYPE,
    data: T
}

export type ClientAuthenticationRequest = ClientRequestPayload<{challenge: string}>
export type ClientAuthenticationResponse = ClientResponsePayload<{publicKey: string, signature: string}>





function forwardClientRequest(request: ClientRequestPayload<unknown>) {
    async function notifyExtension() {
        try {
            console.log("Attempting to open the extension...")
            await browser.action.openPopup()
            console.log("Extension open!")
        } catch (e) {
            console.log("Cannot open the extension:", e)
        }

        const trySending = (retryCount: number) => {
            // Envoyer le message
            browser.runtime.sendMessage(request)
                .then(() => console.log("Message sent to extension"))
                .catch((error) => {
                    console.warn(`Try ${retryCount} failed :`, error);
                    if (retryCount <= 0) {
                        console.error("Extension non disponible après plusieurs tentatives.");
                    } else {
                        setTimeout(() => trySending(retryCount - 1), 100);
                    }
                });
        };

        trySending(10)
    }

    notifyExtension()
}

export default defineBackground({
    persistent: true,
    main: () => {
        console.log('background executed');

        browser.runtime.onInstalled.addListener(({reason}) => {
            if (reason === "install") {
                browser.tabs.create({url: "./main.html"});
            }
            return true;
        });


        browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log("[background] onMessage:", message)

            const request = message as BackgroundRequest<unknown>;

            if (request.backgroundRequestType == BACKGROUND_REQUEST_TYPE.BROWSER_OPEN_ACTION) {
                console.log("[background] receiving browser action:", message);
                const payload = request.payload as BrowserActionPayload;
                if (payload.location == "main") {
                    browser.tabs.create({url: "./main.html"});
                }

                if (payload.location == "onboarding") {
                    browser.tabs.create({url: "./main.html"});
                }
            } else if (request.backgroundRequestType == BACKGROUND_REQUEST_TYPE.CLIENT_REQUEST) {
                console.log("[background] handling client request", request)
                const clientRequest = request as BackgroundRequest<ClientRequestPayload<unknown>>;
                forwardClientRequest(clientRequest.payload)
            } else if (request.backgroundRequestType == BACKGROUND_REQUEST_TYPE.CLIENT_RESPONSE) {
                console.log("[background] handling client response", request)
                browser.tabs
                    .query({
                        currentWindow: true,
                        active: true,
                    })
                    .then(tabs => {
                        console.log("[background] tabs:", tabs)
                        if (tabs.length !== 0) {
                            const id = tabs[0].id as number;
                            browser.tabs.sendMessage(id, request.payload)
                        }

                    })
            } else {
                console.warn("[background] unknown request:", request)
            }



            sendResponse({success: true});
            return true;
        });
    }
});
