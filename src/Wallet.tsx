import {Account, AccountData, EmailValidationProofData} from "@/src/Account.tsx";
import {Encoders} from "@/src/Encoders.tsx";

const DEFAULT_NODE_ENDPOINT = "https://node.testapps.carmentis.io"
const DEFAULT_DATA_ENDPOINT = "https://data.testapps.carmentis.io"

export interface WalletData {
    seed : Array | undefined;
    accounts : AccountData[];
    nodeEndpoint: string;
    dataEndpoint: string;
}

export class Wallet {

    data : WalletData

    private constructor(
        seed: ArrayLike<number> | undefined,
        accounts : AccountData[],
        nodeEndpoint: string | undefined = undefined,
        dataEndpoint: string | undefined = undefined,
    ) {
        this.data = {
            seed : Array.from(seed),
            accounts : accounts,
            nodeEndpoint : nodeEndpoint ? nodeEndpoint : DEFAULT_NODE_ENDPOINT,
            dataEndpoint : dataEndpoint ? dataEndpoint : DEFAULT_DATA_ENDPOINT,
        }
    }

    empty() : Wallet {
        return new Wallet(undefined, [Account.Default().data]);
    }

    /**
     * Returns the endpoint for the data server.
     */
    getDataEndpoint() : string {
        return this.data.dataEndpoint;
    }

    /**
     * Returns the endpoint for the node server.
     */
    getNodeEndpoint() : string {
        return this.data.nodeEndpoint;
    }

    static CreateFromBytes( seed : Uint8Array ) : Wallet {
        if ( !seed ) {
            throw new Error( "Cannot instantiate a wallet from undefined seed" );
        }
        return new Wallet(seed, [Account.Default().data]);
    }

    static CreateFromBytesAndAccounts( seed : Uint8Array, accounts : AccountData[] ) : Wallet {
        if ( !seed ) {
            throw new Error( "Cannot instantiate a wallet from undefined seed" );
        }
        if ( !accounts ) {
            throw new Error( "Cannot instantiate a wallet from undefined accounts" );
        }
        return new Wallet(seed, accounts);
    }

    getAccount( index : number ) : Account {
        if (0 < index || this.data.accounts.length <= index) {
            throw new Error( `Cannot find account with index ${index}: only ${this.data.accounts.length} accounts exists` );
        }
        return Account.CreateFromDict( this.data.accounts[index] )
    }



    getSeed() : Uint8Array {
        console.log(this.data.seed);
        if (this.data.seed === undefined) {
            throw new Error( "Illegal state: The seed is undefined" );
        }
        return Encoders.ToUint8Array(this.data.seed);
    }

    static CreateFromDict(wallet : WalletData) {
        return new Wallet(wallet.seed, wallet.accounts);
    }

    updateAccountEmail(accountIndex : number, email: string) {
        if ( 0 < accountIndex || this.data.accounts.length <= accountIndex ) {
            throw new Error(`Invalid account index: got ${accountIndex} but have ${this.data.accounts.length} accounts`);
        }
        this.data.accounts[accountIndex].email = email;
    }


    updateValidationProof(accountIndex : number, emailValidationProof : EmailValidationProofData) {
        if ( 0 < accountIndex || this.data.accounts.length <= accountIndex ) {
            throw new Error(`Invalid account index: got ${accountIndex} but have ${this.data.accounts.length} accounts`);
        }
        this.data.accounts[accountIndex].emailValidationProof = emailValidationProof;
    }

    updatePseudo(accountIndex : number, pseudo: string) {
        if ( 0 < accountIndex || this.data.accounts.length <= accountIndex ) {
            throw new Error(`Invalid account index: got ${accountIndex} but have ${this.data.accounts.length} accounts`);
        }
        this.data.accounts[accountIndex].pseudo = pseudo
    }
}