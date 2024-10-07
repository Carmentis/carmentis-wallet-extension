import {Wallet} from "@/src/Wallet.tsx";
import {Optional} from "@/src/Optional.tsx";

const DEFAULT_ACCOUNT_NAME = "Account"

/**
 * The AccountData interface is used to include a
 */
export interface AccountData {
    pseudo: string;
    email: string | undefined;
}


export class Account {

    data : AccountData

    constructor(pseudo: string, email: string | undefined) {
        this.data = {
            pseudo : pseudo,
            email:  email,
        };
    }

    getPseudo() : string {
        return this.data.pseudo;
    }

    getEmail() : Optional<string> {
        if (this.data.email == undefined) {
            return Optional.Empty();
        }
        return Optional.From(this.data.email);
    }


    static Default() : Account {
        return new Account(DEFAULT_ACCOUNT_NAME, undefined);
    }

    static CreateFromDict(account : AccountData) : Account {
        return new Account( account.pseudo, account.email );
    }
}