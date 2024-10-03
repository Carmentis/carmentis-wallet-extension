import {Account} from "@/src/Account.tsx";

export class Wallet {

    seed : Uint8Array | undefined;
    accounts : Account[];

    private constructor(seed: Uint8Array | undefined, accounts : Account[]) {
        this.seed = seed;
        this.accounts = accounts;
    }

    empty() : Wallet {
        return new Wallet(undefined, [Account.Default()]);
    }

    static CreateFromBytes( seed : Uint8Array ) : Wallet {
        if ( !seed ) {
            throw new Error( "Cannot instantiate a wallet from undefined seed" );
        }
        return new Wallet(seed, [Account.Default()]);
    }

    static CreateFromBytesAndAccounts( seed : Uint8Array, accounts : Account[] ) : Wallet {
        if ( !seed ) {
            throw new Error( "Cannot instantiate a wallet from undefined seed" );
        }
        if ( !accounts ) {
            throw new Error( "Cannot instantiate a wallet from undefined accounts" );
        }
        return new Wallet(seed, accounts);
    }



    getSeed() : Uint8Array {
        if (this.seed === undefined) {
            throw new Error( "Illegal state: The seed is undefined" );
        }
        return this.seed;
    }
}