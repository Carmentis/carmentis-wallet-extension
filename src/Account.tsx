const DEFAULT_ACCOUNT_NAME = "Account"
export class Account {
    pseudo: string;
    email: string | undefined;

    constructor(pseudo: string, email: string | undefined) {
        this.pseudo = pseudo;
        this.email = email;
    }


    static Default() : Account {
        return new Account(DEFAULT_ACCOUNT_NAME, undefined);
    }
}