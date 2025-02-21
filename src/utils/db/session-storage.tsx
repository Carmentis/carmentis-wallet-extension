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


import browser from 'webextension-polyfill'
import {Wallet} from '@/entrypoints/main/wallet.tsx';
import {IllegalStateError} from '@/entrypoints/main/errors.tsx';
import {ClientRequest} from '@/utils/client-request.ts';

export interface SessionState {
    wallet: Wallet;
}

export class SessionStorage {
    static ContainsWallet() : Promise<boolean> {
        return new Promise((resolve, reject) => {
            browser.storage.session.get(["state"]).then((result) => {
                resolve(result.state !== undefined);
            })
        })
    }

    static GetSessionState() : Promise<SessionState> {
        return new Promise((resolve, reject) => {
            browser.storage.session.get(["state"]).then((result) => {
                if (result.wallet === undefined) {
                    throw new IllegalStateError("Attempt to read session state but not initialized yet")
                }
                resolve({
                    wallet: result.wallet,
                });
            })
        });
    }

    static WriteSessionState(session : SessionState) : Promise<void> {
        return browser.storage.session.set({
            wallet: session.wallet,
        });
    }


    static GetActionMessages() : Promise<ClientRequest[]> {
        return new Promise((resolve, reject) => {
            browser.storage.session.get(["actionMessages"]).then((result) => {
                if (result.actionMessages === undefined) {
                    resolve([])
                } else {
                    resolve(result.actionMessages);
                }
            })
        });
    }

    static WriteActionsMessages(actionsMessages : ClientRequest[]) : Promise<void> {
        return browser.storage.session.set({
            actionMessages: actionsMessages
        })
    }

    static Clear() {
        browser.storage.session.clear();
    }
}