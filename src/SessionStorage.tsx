import {Wallet, WalletData} from "@/src/Wallet.tsx";
import {Account} from "@/src/Account.tsx";
import {IllegalStateError} from "@/src/errors.tsx";
import {ActionMessage} from "@/src/ActionMessage.tsx";

export interface SessionState {
    state: {
       wallet: Wallet;
       activeAccount: Account;
    }
}

export class SessionStorage {
    static ContainsWallet() : Promise<boolean> {
        return new Promise((resolve, reject) => {
            chrome.storage.session.get(["state"]).then((result) => {
                resolve(result.state !== undefined);
            })
        })
    }

    static GetSessionState() : Promise<SessionState> {
        return new Promise((resolve, reject) => {
            chrome.storage.session.get(["state"]).then((result) => {
                if (result.state === undefined) {
                    throw new IllegalStateError("Attempt to read session state but not initialized yet")
                }
                resolve({
                    "state": {
                        wallet: Wallet.CreateFromDict( result.state.wallet ),
                        activeAccount: Account.CreateFromDict( result.state.activeAccount ),
                    }
                });
            })
        });
    }

    static WriteSessionState(session : SessionState) : Promise<void> {
        return chrome.storage.session.set({
            state: {
                wallet: session.state.wallet.data,
                activeAccount: session.state.activeAccount.data
            }
        });
    }


    static GetActionMessages() : Promise<ActionMessage[]> {
        return new Promise((resolve, reject) => {
            chrome.storage.session.get(["actionMessages"]).then((result) => {
                if (result.actionMessages === undefined) {
                    resolve([])
                } else {
                    resolve(result.actionMessages);
                }
            })
        });
    }

    static WriteActionsMessages(actionsMessages : ActionMessage[]) : Promise<void> {
        return chrome.storage.session.set({
            actionMessages: actionsMessages
        })
    }

    static Clear() {
        chrome.storage.session.clear();
    }
}