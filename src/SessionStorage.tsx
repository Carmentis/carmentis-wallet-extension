import {Wallet} from "@/src/Wallet.tsx";
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
                let state : SessionState = result.state;
                resolve(state);
            })
        });
    }

    static WriteSessionState(session : SessionState) : Promise<void> {
        return chrome.storage.session.set({
            state: session
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