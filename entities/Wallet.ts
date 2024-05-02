
export default class Wallet {
    private readonly masterKey?: string[];
    private readonly password?: string;
    private readonly mnemonic?: string[];

    constructor({masterKey, password, mnemonic}: {masterKey?: string[], password?: string, mnemonic?: string[]}) {
        this.password = password;
        this.mnemonic = mnemonic;
        this.masterKey = masterKey;
    }

    public getMasterPublicKey(): string | undefined {
        return this.masterKey ? this.masterKey[0] : undefined;
    }

    public getMasterPrivateKey(): string | undefined {
        return this.masterKey ? this.masterKey[1] : undefined;
    }

    public getPassword(): string | undefined {
        return this.password;
    }

    public getMnemonic(): string[] | undefined {
        return this.mnemonic;
    }
}
