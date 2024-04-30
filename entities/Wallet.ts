
export default class Wallet {
    masterKey?: string;
    password?: string;

    constructor({password}: {password: string}) {
        this.password = password;
    }
}
