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

import {atom, AtomEffect} from "recoil";
import {ClientRequest} from "@/utils/client-request.ts";

function clientRequestStorageEffect<T>(key: string): AtomEffect<T> {
    return ({ setSelf, onSet }) => {
    // Initialize atom from chrome.storage.session
    chrome.storage.session.get([key], (result) => {
        console.log("[clientRequestSession] obtained result:", result)
        if (result[key] !== undefined) {
            setSelf(result[key] as T);
        } else {
            setSelf(undefined);
        }
    });

    // Save atom updates to chrome.storage.session
    onSet((newValue) => {
        console.log("[clientRequestSession] Updating client request sesssoin:", newValue)
        if (newValue === undefined) {
            chrome.storage.session.remove([key]);
        } else {
            chrome.storage.session.set({ [key]: newValue });
        }
    });
};
}

export const clientRequestSessionState = atom<ClientRequest|undefined>({
    key: "clientRequestSession",
    effects: [clientRequestStorageEffect<ClientRequest|undefined>("clientRequestSession")],
})