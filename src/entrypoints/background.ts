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


function processQRCode(origin: string, data: string) {

    const message = {
        action: "popup/processQRCode",
        data: data,
        origin: origin,
    };

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
            browser.runtime.sendMessage(message)
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

        /*
        // occurs when the popup is already opened
        if (error.message === "Failed to open popup.") {
            console.log("[background] Retrying with a send message")
            browser.runtime.sendMessage({
                action: "popup/processQRCode",
                data: data,
                origin: origin,
            })
        }

        // occurs when the navigator requires a user gesture
        if (error.message == "openPopup requires a user gesture") {
            console.log("[background] Retrying with a floating window")
            browser.windows.create({
                url: "popup.html",
                type: 'popup',
                width: 400,
                height: 600,
                left: 0,
                top: 0,
                focused: true
            }).then(() => {
                browser.runtime.sendMessage({
                    action: "popup/processQRCode",
                    data: data,
                    origin: origin,
                })
            }).catch((error) => {
                console.error("[background] An error has been detected when opening the floating popup: ", error)
            });
        }

         */

}

interface IncomingRequest {
    "target": string,
    "request":{
        "isTrusted": boolean
    },
    "data":{
        "action": string,
        "data": string,
        "from": string
    },
    "origin": string,
    "from": string
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
            console.log("[background] message received:", message);

            // we do not execute request coming from tab which are not active
            if (sender.tab && !sender.tab.active) {
                return
            }


            if (message.action == "open") {
                if (message.location == "main") {
                    browser.tabs.create({url: "./main.html"});
                }

                if (message.location == "onboarding") {
                    browser.tabs.create({url: "./main.html"});
                }
            }

            sendResponse({success: true});
            return true;
        });


        browser.runtime.onConnect.addListener((port: Port) => {
            console.log("[background] connected to: ", port);
            port.onMessage.addListener((rawRequest) => {
                console.log("[background] message received from port:", rawRequest);
                const request : IncomingRequest = JSON.parse(rawRequest as string);
                if (request.target !== 'carmentis-wallet/background') {
                    console.warn(`[background] Skipping the execution of incoming request: Invalid request target: got ${request.target}`)
                } else {
                    const message = request.data
                    if (message.action === "processQRCode") {
                        // get the data section
                        let QRCodeData = message.data;
                        processQRCode(request.origin, QRCodeData)
                    } else {
                        console.warn("[background] undefined action: I don't known the desired action: received message: ", message);
                    }
                }

                return true;
            })
        });
    }
});
