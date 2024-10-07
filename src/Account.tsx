import {Wallet} from "@/src/Wallet.tsx";
import {Optional} from "@/src/Optional.tsx";

const DEFAULT_ACCOUNT_NAME = "Account"

/**
 * The AccountData interface is used to include a
 */
export interface AccountData {
    pseudo: string;
    email: string | undefined;
    verifiedEmail: boolean | undefined
}


export class Account {

    data : AccountData

    constructor(pseudo: string, email: string | undefined, verifiedEmail: boolean | undefined) {
        this.data = {
            pseudo : pseudo,
            email:  email,
            verifiedEmail: verifiedEmail,
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

    hasVerifiedEmail(): boolean {
        return this.data.verifiedEmail === true;
    }


    static Default() : Account {
        return new Account(DEFAULT_ACCOUNT_NAME, undefined, undefined);
    }

    static CreateFromDict(account : AccountData) : Account {
        return new Account( account.pseudo, account.email, account.verifiedEmail );
    }
}