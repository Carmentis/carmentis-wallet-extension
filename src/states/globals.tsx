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

import {atom, AtomEffect, selector} from "recoil";
import {PublicSignatureKey} from "@cmts-dev/carmentis-sdk/client";
import {useAccountKeyPairLoader} from "@/hooks/useAccountKeyPairLoader.tsx";
import {SignatureKeyPair} from "@/types/SignatureKeyPair.tsx";
import {Account} from "@/types/Account.tsx";
import {Wallet} from "@/types/Wallet.ts";

function walletSessionStorageEffect<T>(key: string): AtomEffect<T> {
    return ({ setSelf, onSet }) => {
        // Initialize atom from chrome.storage.session
        chrome.storage.session.get([key], (result) => {
            console.log("[walletSession] obtained result:", result)
            if (result[key] !== undefined) {
                setSelf(result[key] as T);
            } else {
                setSelf(undefined);
            }
        });

        // Save atom updates to chrome.storage.session
        onSet((newValue) => {
            console.log("[walletSession] Updating wallet:", newValue)
            if (newValue === undefined) {
                chrome.storage.session.remove([key]);
            } else {
                chrome.storage.session.set({ [key]: newValue });
            }
        });
    };
}

export const walletState = atom<Wallet | undefined>({
    key: "wallet",
    effects: [walletSessionStorageEffect<Wallet | undefined>("walletSession")],
})
export const passwordState = selector<string | undefined>({
    key: "password",
    get: ({get}) => {
        const wallet = get(walletState);
        return wallet?.password;
    }
})
export const activeAccountState = selector<Account | undefined>({
    key: 'activeAccount',
    get: ({get}) => {
        const wallet = get(walletState);
        if (!wallet || !wallet.activeAccountId)
            return undefined;
        return wallet.accounts.find(v => v.id === wallet.activeAccountId);
    }
})
export const activeAccountKeyPairState = selector<SignatureKeyPair | undefined>({
    key: "activeAccountKeyPair",
    get: async ({get}) => {
        const {loadAccountKeyPair} = useAccountKeyPairLoader();
        const wallet = get(walletState);
        const activeAccount = get(activeAccountState)
        if (!wallet || !activeAccount)
            return undefined;
        return await loadAccountKeyPair(wallet, activeAccount);
    }
})
export const activeAccountPublicKeyState = selector<PublicSignatureKey | undefined>({
    key: "activeAccountPublicKey",
    get: ({get}) => {
        const keyPair = get(activeAccountKeyPairState);
        if (!keyPair)
            return undefined;
        return keyPair.publicKey;
    }
})
export const nodeEndpointState = selector({
    key: 'nodeEndpointState',
    get: ({get}) => {
        const wallet = get(walletState);
        return wallet?.nodeEndpoint;
    }
})
