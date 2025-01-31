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

import {
    BACKGROUND_REQUEST_TYPE,
    BackgroundRequest,
    CLIENT_REQUEST_TYPE,
    ClientAuthenticationRequest
} from "@/entrypoints/background.ts";


function handleClientAuthenticationRequest(challenge: string, origin: string,) {
    const authRequest: BackgroundRequest<ClientAuthenticationRequest> = {
        backgroundRequestType: BACKGROUND_REQUEST_TYPE.CLIENT_REQUEST,
        source: "content",
        payload: {
            clientRequestType: CLIENT_REQUEST_TYPE.AUTHENTICATION,
            timestamp: new Date().getTime(),
            origin: origin,
            data: {
                challenge: challenge,
            }
        }
    }
    console.log("[content] Sending authentication message to background")
    //const port = browser.runtime.connect({name: 'carmentis-wallet'});
    //console.log("[content] port created:", port)
    //port.postMessage(authRequest);
    browser.runtime.sendMessage(authRequest)
}

export default defineContentScript({
    matches: ['*://*/*'],
    main(ctx) {

        const port = chrome.runtime.connect({name: 'carmentis-wallet'});
        port.onMessage.addListener((msg) => {
            console.log(msg.type);
        });


        window.addEventListener('message', async (message) => {
            console.log("[content] message received:", message);
            // send to background
            if (message.action === "carmentis/clientRequest" || message.data.action === "carmentis/clientRequest") {
                handleClientAuthenticationRequest(message.data.challenge, message.origin)
            }
        });

        // relay every message into the web page
        browser.runtime.onMessage.addListener((message) => {
            console.log("[content] Having received a message that I will post to the application")
            window.postMessage(message, "*");
        });


        const ui = createIntegratedUi(ctx, {
            position: 'inline',
            onMount: (container) => {
                console.log('Carmentis Wallet mounted');

                const script = document.createElement('script');
                script.type = 'module'; // Optional, if using ES6 modules
                script.src = browser.runtime.getURL('/vendor/carmentis-wallet-init.js');
                container.append(script);

            },
        });

        ui.mount();
    },
});
