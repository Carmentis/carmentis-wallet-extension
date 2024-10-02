export class EncryptedWalletContext {
    encryptedSeed : string | undefined;

    constructor(encryptedSeed: string) {
        this.encryptedSeed = encryptedSeed;
    }

    getEncryptedSeed(): string {
        if (this.encryptedSeed == undefined) {
            throw new Error(`Unable to get encrypted seed: undefined encrypted seed`);
        }
        return this.encryptedSeed;
    }

    static CreateFromString( encryptedSeed: string ): EncryptedWalletContext {
        return new EncryptedWalletContext( encryptedSeed );
    }

}

export class WalletContext {

    seed : Uint8Array | undefined;

    private constructor(seed: Uint8Array | undefined) {
        this.seed = seed;
    }

    empty() : WalletContext {
        return new WalletContext(undefined);
    }

    static CreateFromBytes( seed : Uint8Array ) {
        if ( !seed ) {
            throw new Error( "Cannot instantiate a wallet from undefined seed" );
        }
        return new WalletContext(seed);
    }

    isInitialized() : boolean {
        return this.seed !== undefined;
    }

    getSeed() : Uint8Array {
        if (this.seed === undefined) {
            throw new Error( "Illegal state: The seed is undefined" );
        }
        return this.seed;
    }
}