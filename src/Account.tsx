import {Wallet} from "@/src/Wallet.tsx";
import {Optional} from "@/src/Optional.tsx";
import {randomHex} from "@/src/Random.tsx";

const DEFAULT_ACCOUNT_NAME = "Account"
const DEFAULT_NONCE = 0;

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
    id : string,
    nonce : number,
    pseudo: string;
    email: string | undefined;
    emailValidationProof: EmailValidationProofData | undefined
}



export class Account {

    data : AccountData

    constructor(data : AccountData) {
        this.data = data;
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


    /**
     * This function creates a default account.
     *
     * @constructor
     *
     * @return Account The created account.
     */
    static Default() : Account {
        return new Account({
            id: this.GenerateAccountId(),
            pseudo: DEFAULT_ACCOUNT_NAME,
            email: undefined,
            emailValidationProof: undefined,
            nonce: DEFAULT_NONCE
        })
    }

    static CreateFromDict(account : AccountData) : Account {
        return new Account(account);
    }

    /**
     * Returns the email verification proof.
     *
     * @throws Error If the email is not verified.
     */
    getEmailValidationProofData() : EmailValidationProofData {
        if ( this.data.emailValidationProof === undefined ) {
            throw new Error( "The active account do not have verified its email" );
        }
        return this.data.emailValidationProof
    }

    /**
     * Returns the identifier of the account.
     */
    getId() : string {
        return this.data.id;
    }


    /**
     * Creates an account from a given pseudo.
     *
     * The created account contains the strictly minimal information to create a valid account.
     *
     * @param accountPseudo The pseudo of the created account.
     * @param nonce The nonce associated with the account
     *
     * @constructor
     */
    static CreateFromPseudoAndNonce(accountPseudo: string, nonce : number) : Account {
        return new Account({
            email: undefined,
            emailValidationProof: undefined,
            id: this.GenerateAccountId(),
            nonce: nonce,
            pseudo: accountPseudo

        });
    }

    /**
     * Returns a freshly generated identifier.
     *
     * @return string The generated identifier.
     */
    private static GenerateAccountId() : string {
        return randomHex(32)
    }

    /**
     * Returns the nonce associated with the account.
     */
    getNonce() {
        return this.data.nonce
    }
}