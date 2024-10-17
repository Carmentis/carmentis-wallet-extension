import {Wallet} from "@/src/Wallet.tsx";
import {IllegalStateError} from "@/src/errors.tsx";
import {ActionMessage} from "@/src/ActionMessage.tsx";
import browser from 'webextension-polyfill'
import {Optional} from "@/src/Optional.tsx";

export interface SessionState {
    state: {
        password: string;
        wallet: Wallet;
    }
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
                if (result.state === undefined) {
                    throw new IllegalStateError("Attempt to read session state but not initialized yet")
                }
                resolve({
                    "state": {
                        password: result.state.password,
                        wallet: Wallet.CreateFromDict( result.state.wallet ),
                    }
                });
            })
        });
    }

    static WriteSessionState(session : SessionState) : Promise<void> {
        return browser.storage.session.set({
            state: {
                wallet: session.state.wallet.data,
                password: session.state.password,
            }
        });
    }


    static GetActionMessages() : Promise<ActionMessage[]> {
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

    static WriteActionsMessages(actionsMessages : ActionMessage[]) : Promise<void> {
        return browser.storage.session.set({
            actionMessages: actionsMessages
        })
    }

    static Clear() {
        browser.storage.session.clear();
    }
}