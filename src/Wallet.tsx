/*
 * Copyright (c) Carmentis. All rights reserved.
 * Licensed under the Apache 2.0 licence.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import {Account, AccountData, EmailValidationProofData} from "@/src/Account.tsx";
import {Encoders} from "@/src/Encoders.tsx";
import {Optional} from "@/src/Optional.tsx";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js"
import {RecordConfirmationData} from "@/src/components/popup/PopupDashboard.tsx";
import Guard from "@/src/Guard.tsx";

const DEFAULT_NODE_ENDPOINT = "https://node.testapps.carmentis.io"
const DEFAULT_DATA_ENDPOINT = "https://data.testapps.carmentis.io"
const DEFAULT_WEBSOCKET_NODE_ENDPOINT = "wss://node.testapps.carmentis.io/websocket"

/**
 * Represents the internal structure of the wallet.
 */
export interface WalletData {
    seed : Array | undefined;
    counter : number;
    accounts : AccountData[];
    activeAccountId : string | undefined;
    nodeEndpoint: string;
    dataEndpoint: string;
    webSocketNodeEndpoint: string;
}

export class Wallet {

    data : WalletData

    private constructor(data : WalletData) {
        this.data = data;
    }


    empty() : Wallet {
        const createdAccount = Account.Default();
        return new Wallet({
            seed: undefined,
            accounts: [createdAccount.data],
            counter: 1,
            activeAccountId : createdAccount.getId(),
            nodeEndpoint : DEFAULT_NODE_ENDPOINT,
            dataEndpoint : DEFAULT_DATA_ENDPOINT,
            webSocketNodeEndpoint: DEFAULT_WEBSOCKET_NODE_ENDPOINT
        })
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

    /**
     * Returns the endpoint for the web socket node server.
     */
    getWebSocketNodeEndpoint() : string {
        return this.data.webSocketNodeEndpoint
    }

    static CreateFromSeed(seed : Uint8Array) : Wallet {
        if ( !seed ) {
            throw new Error( "Cannot instantiate a wallet from undefined seed" );
        }

        console.log("[wallet] Creating wallet from seed:", seed)

        //return new Wallet(seed, [Account.Default().data]);
        const createdAccount = Account.Default();
        return new Wallet({
            seed: seed,
            accounts: [createdAccount.data],
            counter: 1,
            activeAccountId : createdAccount.getId(),
            nodeEndpoint : DEFAULT_NODE_ENDPOINT,
            dataEndpoint : DEFAULT_DATA_ENDPOINT,
            webSocketNodeEndpoint: DEFAULT_WEBSOCKET_NODE_ENDPOINT
        })
    }

    static CreateFromSeedAndAccounts(seed : Uint8Array, accounts : AccountData[] ) : Wallet {
        if ( !seed ) {
            throw new Error( "Cannot instantiate a wallet from undefined seed" );
        }
        if ( !accounts ) {
            throw new Error( "Cannot instantiate a wallet from undefined accounts" );
        }
        return new Wallet({
            seed: seed,
            accounts: accounts,
            activeAccountId : undefined,
            counter: 1,
            nodeEndpoint : DEFAULT_NODE_ENDPOINT,
            dataEndpoint : DEFAULT_DATA_ENDPOINT,
            webSocketNodeEndpoint: DEFAULT_WEBSOCKET_NODE_ENDPOINT
        })
    }


    getActiveAccount() : Optional<Account> {
        const activeAccountIndexOption = this.getActiveAccountIndex();
        if ( activeAccountIndexOption.isEmpty() ) {
            return Optional.Empty();
        }
        const activeAccountIndex = activeAccountIndexOption.unwrap();
        return Optional.From(
            Account.CreateFromDict(
                this.data.accounts[activeAccountIndex]
            )
        );
    }


    /**
     * Returns the seed of the wallet.
     *
     * Note: The seed should not be publicly available for security reasons.
     */
    getSeed() : Uint8Array {
        if (this.data.seed === undefined) {
            throw new Error( "Illegal state: The seed is undefined" );
        }

        const seed = Encoders.ToUint8Array(this.data.seed);
        console.log("[wallet] obtained seed:", seed)

        // TODO remove
        return seed
    }

    static CreateFromDict(wallet : WalletData) {
        return new Wallet(wallet)
    }

    updateAccountEmail(accountIndex : number, email: string) : Wallet {
        if ( accountIndex < 0 || this.data.accounts.length <= accountIndex ) {
            throw new Error(`Invalid account index: got ${accountIndex} but have ${this.data.accounts.length} accounts`);
        }
        const walletData : WalletData = {...this.data};
        walletData.accounts[accountIndex].email = email;
        return Wallet.CreateFromDict(walletData)
    }


    updateValidationProof(accountIndex : number, emailValidationProof : EmailValidationProofData) : Wallet {
        if ( accountIndex < 0 || this.data.accounts.length <= accountIndex ) {
            throw new Error(`Invalid account index: got ${accountIndex} but have ${this.data.accounts.length} accounts`);
        }
        const walletData = {...this.data};
        walletData.accounts[accountIndex].emailValidationProof = emailValidationProof;
        return Wallet.CreateFromDict(walletData)
    }

    updatePseudo(accountIndex : number, pseudo: string) {
        if ( accountIndex < 0 || this.data.accounts.length <= accountIndex ) {
            throw new Error(`Invalid account index: got ${accountIndex} but have ${this.data.accounts.length} accounts`);
        }
        this.data.accounts[accountIndex].pseudo = pseudo
    }


    getAllAccounts() : Account[] {
        return this.data.accounts.map(Account.CreateFromDict);
    }



    /**
     * Returns the account's index based on its identifier.
     *
     * @param accountId The id of the account.
     */
    getAccountIndexById(accountId: string) : Optional<number> {

        for (let index = 0; index < this.data.accounts.length; index++) {
            if ( this.data.accounts[index].id === accountId ) {
                return Optional.From(index);
            }
        }

        return Optional.Empty();

    }

    /**
     * Returns the index of the active account.
     *
     */
    getActiveAccountIndex() : Optional<number> {
        for (let index = 0; index < this.data.accounts.length; index++) {
            const account = this.data.accounts[index];
            if ( account.id === this.data.activeAccountId ) {
                return Optional.From( index );
            }
        }
        return Optional.Empty();
    }



    /**
     * Set the endpoints for the node server and for the data server.
     *
     * @param nodeEndpoint Endpoint of the node server.
     * @param dataEndpoint Endpoint of the data server.
     * @param webSocketNodeEndpoint Endpoint of the web socket node server.
     */
    setEndpoints(nodeEndpoint: string, dataEndpoint: string, webSocketNodeEndpoint: string) : void {
        // TODO checks that URL format of the endpoints
        this.data.dataEndpoint = dataEndpoint;
        this.data.nodeEndpoint = nodeEndpoint;
        this.data.webSocketNodeEndpoint = webSocketNodeEndpoint;
    }

    /**
     * Set the active account from its index.
     *
     * @param index The index of the account to be considered active.
     *
     * @deprecated The active account selection by index should be replaced by the `setActiveAccountById` function.
     */
    setActiveAccountByIndex(index: number) : Wallet {
        const walletData = {...this.data};
        const account = Account.CreateFromDict(this.data.accounts[index]);
        walletData.activeAccountId = account.getId();
        return Wallet.CreateFromDict(walletData);
    }

    /**
     * Set the active account by identifier.
     *
     * @param accountId The index of the account to be considered active.
     *
     */
    setActiveAccountById(accountId : string) : Wallet {
        const walletData = {...this.data};
        walletData.activeAccountId = accountId;
        return Wallet.CreateFromDict(walletData);
    }

    createAccount(createdAccount: Account) : Wallet {
        const walletData = {...this.data};
        walletData.accounts.push(createdAccount.data);
        return Wallet.CreateFromDict(walletData);
    }

    getUserKeyPair(account : Account, applicationId : string) : Promise<{privateKey: object, publicKey: object}>  {
        return new Promise((resolve, reject) => {
            const seed = this.getSeed();
            console.log("[wallet] deriving user key pair from seed:", seed)
            Carmentis.derivePepperFromSeed(seed, account.getNonce()).then(pepper => {
                return Carmentis.deriveUserPrivateKey(pepper, Encoders.FromHexa(applicationId)).then(privateKey => {
                    return Carmentis.getPublicKey(privateKey).then(publicKey => {
                        resolve({
                            privateKey: privateKey,
                            publicKey: publicKey
                        })
                    })
                })
            }).catch((error : Error) => {
                reject(error);
            })
        })
    }



    getAccountAuthenticationKeyPair(account : Account) : Promise<{privateKey: object, publicKey: object}> {
        return new Promise((resolve, reject) => {
            const seed = this.getSeed();
            console.log("[wallet] deriving user key pair from seed:", seed)
            return Carmentis.derivePepperFromSeed(seed, account.getNonce()).then(pepper => {
                return Carmentis.deriveAuthenticationPrivateKey(pepper).then(privateKey => {
                    return Carmentis.getPublicKey(privateKey).then(publicKey => {
                        resolve({
                            privateKey: privateKey,
                            publicKey: publicKey
                        })
                    })
                })
            }).catch(error => {
                console.error(error);
                reject(error)
                // TODO: Handle error
            })
        })
    }

    /**
     * Delete the active account.
     */
    deleteActiveAccount() : Wallet {
        const activeAccountIndex = this.getActiveAccountIndex().unwrap();
        const walletData = {...this.data};
        walletData.accounts = walletData.accounts.splice(activeAccountIndex, 1);
        walletData.activeAccountId = undefined;
        return Wallet.CreateFromDict(walletData);
    }

    getNonce() : number {
        return this.data.counter;
    }

    incrementNonce() : Wallet {
        const walletData = {...this.data};
        walletData.counter = this.data.counter + 1;
        return Wallet.CreateFromDict(walletData);
    }



    addApprovedBlockInActiveAccountHistory(record : RecordConfirmationData) : Wallet {
        const activeAccount = this.getActiveAccount().unwrap();
        activeAccount.addApprovedBlock( record )
        return this;
    }

    /**
     * Update the nonce of the specified account.
     *
     * @param accountIndex The index of the updated account.
     * @param nonce The new value of the nonce.
     */
    updateNonce(accountIndex: number, nonce: number) : Wallet {
        if ( accountIndex < 0 || this.data.accounts.length <= accountIndex ) {
            throw new Error(`Invalid account index: got ${accountIndex} but have ${this.data.accounts.length} accounts`);
        }
        this.data.accounts[accountIndex].nonce = Guard.PreventUndefined(nonce);
        return this
    }
}

