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
    QRDataClientRequest
} from "@/entrypoints/background.ts";

function handleClientRequest(requestData: QRCodeRequestData, origin: string) {
    console.log("[content] Sending client request to background: requestData", requestData, "origin:", origin)
    const request: BackgroundRequest<QRDataClientRequest> = {
        backgroundRequestType: BACKGROUND_REQUEST_TYPE.CLIENT_REQUEST,
        payload: {
            timestamp: new Date().getTime(),
            origin: origin,
            data: requestData
        }
    }

    browser.runtime.sendMessage(request)
}

export default defineContentScript({
    matches: ['*://*/*'],
    main(ctx) {

        const port = browser.runtime.connect({name: 'carmentis-wallet'});
        port.onMessage.addListener((msg) => {
            console.log(msg.type);
        });


        browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log("[content] message received from onMessage:", message)
            window.postMessage({
                data: message,
                from: "carmentis/walletResponse"
            }, "*")

        })

        window.addEventListener('message', async (message) => {
            console.log("[content] message received from port:", message);
            // send to background
            if (message.data.action === "carmentis/clientRequest") {
                handleClientRequest(message.data.request, message.origin)
            }
        });



        const ui = createIntegratedUi(ctx, {
            position: 'inline',
            onMount: (container) => {
                console.log('Carmentis Wallet mounted');

                const script = document.createElement('script');
                script.type = 'module'; // Optional, if using ES6 modules
                script.src = browser.runtime.getURL('/wallet-init.js');
                container.append(script);

            },
        });

        ui.mount();
    },
});
