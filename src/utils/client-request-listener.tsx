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

import {useEffect} from "react";


// from https://stackoverflow.com/questions/58325771/how-to-generate-random-hex-string-in-javascript
const randomHex = (size: number) => {
    let result = [];
    let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    for (let n = 0; n < size; n++) {
        result.push(hexRef[Math.floor(Math.random() * 16)]);
    }
    return result.join('');
}



export const useRuntimeMessageListener = (onNewActionMessage: (message: ClientRequest) => void) => {
    useEffect(() => {
        // Définir la fonction de callback
        const messageListener = (message: IncomingQR) => {
            console.info("[popup] Add message:", message);

            onNewActionMessage({
                id: randomHex(12),
                receivedAt: Date.now(),
                action: message.action,
                data: message.data,
                origin: message.origin,
                type: "unknown"
            });
        };

        // Ajouter le listener au runtime
        browser.runtime.onMessage.addListener(messageListener);

        // Nettoyer le listener sur démontage
        return () => {
            browser.runtime.onMessage.removeListener(messageListener);
        };
    }, [onNewActionMessage]);

    return null; // Ce hook n'a pas de valeur de retour
};
