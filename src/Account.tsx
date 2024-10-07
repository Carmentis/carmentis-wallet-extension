import {Wallet} from "@/src/Wallet.tsx";
import {Optional} from "@/src/Optional.tsx";

const DEFAULT_ACCOUNT_NAME = "Account"

export interface EmailValidationProofData {
    ts: number,
    email: string,
    publicKey: string,
    signature: string,
}

/**
 * The AccountData interface is used to include a
 */
export interface AccountData {
    pseudo: string;
    email: string | undefined;
    emailValidationProof: EmailValidationProofData | undefined
}



export class Account {

    data : AccountData

    constructor(pseudo: string, email: string | undefined, emailValidationProof: EmailValidationProofData | undefined) {
        this.data = {
            pseudo : pseudo,
            email:  email,
            emailValidationProof: emailValidationProof,
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
        return this.data.emailValidationProof !== undefined;
    }


    static Default() : Account {
        return new Account(DEFAULT_ACCOUNT_NAME, undefined, undefined);
    }

    static CreateFromDict(account : AccountData) : Account {
        return new Account( account.pseudo, account.email, account.emailValidationProof );
    }
}