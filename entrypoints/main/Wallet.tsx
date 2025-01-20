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

import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js"
import { Account, AccountData, EmailValidationProofData } from '@/entrypoints/main/Account.tsx';
import { Optional } from '@/entrypoints/main/Optional.tsx';
import Guard from '@/entrypoints/main/Guard.tsx';
import { Encoders } from '@/entrypoints/main/Encoders.tsx';

/**
 * The default endpoint URL for the node server used in the application.
 * This endpoint is typically utilized as the base URL for connecting
 * to the server's API for performing operations or retrieving data.
 *
 * @constant {string}
 */
const DEFAULT_NODE_ENDPOINT = "https://node.testapps.carmentis.io"
/**
 * Represents the default URL endpoint for accessing the data API.
 * This constant is used as the base URL for API calls to retrieve or send data.
 *
 * Note: The value of this endpoint is set to "https://data.testapps.carmentis.io".
 * Make sure to update this value if the API's base URL changes.
 *
 * @constant {string}
 */
const DEFAULT_DATA_ENDPOINT = "https://data.testapps.carmentis.io"
/**
 * The default WebSocket endpoint URL used to establish a connection with the node.
 * This constant is typically used for real-time communication in the application.
 * It specifies the WebSocket protocol (wss) and the endpoint path.
 */
const DEFAULT_WEBSOCKET_NODE_ENDPOINT = "wss://node.testapps.carmentis.io/websocket"

/**
 * Represents the structure for wallet data.
 *
 * This interface encapsulates the necessary information to represent
 * a wallet within a system, including cryptographic seed, account details,
 * endpoints, and active account reference.
 *
 * Properties:
 * - `seed`: A cryptographic seed as a Uint8Array, or undefined if not available.
 * - `counter`: A numeric value representing a counter, commonly used for versioning or unique identification purposes.
 * - `accounts`: An array of `AccountData` representing the accounts associated with the wallet.
 * - `activeAccountId`: The identifier of the currently active account, or undefined if no account is active.
 * - `nodeEndpoint`: A string representing the URL of the primary node API endpoint.
 * - `dataEndpoint`: A string representing the URL of the data API endpoint.
 * - `webSocketNodeEndpoint`: A string representing the WebSocket endpoint for interacting with the node.
 */
export interface WalletData {
    seed?: Uint8Array;
    counter : number;
    accounts : AccountData[];
    activeAccountId?: string;
    nodeEndpoint: string;
    dataEndpoint: string;
    webSocketNodeEndpoint: string;
}

/**
 * Represents a digital wallet containing seed data and multiple accounts.
 * Provides functionality to manage accounts, set endpoints, and perform wallet-related operations.
 */
export class Wallet {

    data : WalletData

    private constructor(data : WalletData) {
        this.data = data;
    }


    /**
     * Returns an empty wallet containing no seed and a default account.
     */
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

    /**
     * Creates and returns a new wallet from the given seed.
     *
     * The returned wallet is initialized with a default account.
     *
     * @param pseudo The pseudo of the initial account in the wallet.
     * @param seed The seed used by the wallet.
     *
     * @constructor
     */
    static CreateFromPseudoAndSeed(pseudo : string, seed : Uint8Array) : Wallet {

        if ( !seed ) {
            throw new Error( "Cannot instantiate a wallet from undefined seed" );
        }

        console.log("[wallet] Creating wallet from seed:", seed)
        const createdAccount = Account.DefaultWithPseudo(pseudo);
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

    /**
     *  Creates and returns a new wallet from seed and accounts.
     *
     * @param seed The seed used by the wallet.
     * @param accounts The accounts installed in the wallet.
     *
     * @constructor
     */
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


    /**
     * Returns the current active account.
     *
     * Note that the current account might be missing. For this reason, the function returns
     * an {@link Optional}.
     *
     * Example:
     * ```ts
     * const activeAccountOption : Option<Account> = wallet.getActiveAccount();
     * activeAccountOption.isSome();
     * const activeAccount = activeAccountOption.unwrap();
     * ```
     */
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

    /**
     * Returns the key pair based in the provided account and application id.
     *
     * @param account The account used to generate the key pair.
     * @param applicationId The id of the application in which the user wants to obtain the key pair.
     */
    getUserKeyPairForAppliaction(account : Account, applicationId : string) : Promise<{privateKey: object, publicKey: object}>  {

        return new Promise((resolve, reject) => {

            const seed = this.getSeed();
            Carmentis.derivePepperFromSeed(seed, account.getNonce()).then((pepper: Uint8Array) => {
                return Carmentis.deriveUserPrivateKey(pepper, Encoders.FromHexa(applicationId)).then((privateKey : Uint8Array) => {
                    return Carmentis.getPublicKey(privateKey).then((publicKey : Uint8Array) => {
                        resolve({
                            privateKey: privateKey,
                            publicKey: publicKey
                        })
                    })
                });

            }).catch((error : Error) => {
                reject(error);
            })
        })

    }


    /**
     * Retrieves the user's key pair consisting of a private key and a public key.
     *
     * @param {Account} account - The account object for which the key pair is generated. The account nonce is used in the derivation process.
     * @return {Promise<{privateKey: object, publicKey: object}>} A promise that resolves with an object containing the privateKey and publicKey.
     */
    getUserKeyPair(account : Account) : Promise<{privateKey: object, publicKey: object}>  {

        return new Promise((resolve, reject) => {

            const seed = this.getSeed();
            Carmentis.derivePepperFromSeed(seed, account.getNonce()).then((pepper: Uint8Array) => {
                return Carmentis.deriveAccountPrivateKey(pepper).then((privateKey : Uint8Array) => {
                    return Carmentis.getPublicKey(privateKey).then((publicKey : Uint8Array) => {
                        resolve({
                            privateKey: privateKey,
                            publicKey: publicKey
                        })
                    })
                });

            }).catch((error : Error) => {
                reject(error);
            })
        })

    }




    getAccountAuthenticationKeyPair(account : Account) : Promise<{privateKey: object, publicKey: object}> {
        return new Promise((resolve, reject) => {
            const seed = this.getSeed();
            console.log("[wallet] deriving user key pair from seed:", seed)
            return Carmentis.derivePepperFromSeed(seed, account.getNonce()).then((pepper : Uint8Array) => {
                return Carmentis.deriveAuthenticationPrivateKey(pepper).then((privateKey : Uint8Array) => {
                    return Carmentis.getPublicKey(privateKey).then((publicKey : Uint8Array) => {
                        resolve({
                            privateKey: privateKey,
                            publicKey: publicKey
                        })
                    })
                })
            }).catch((error : Error) => {
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

    /**
     * Returns a wallet with an incremented nonce.
     *
     * ```ts
     * const beforeNonce = wallet.getNonce(); // 1
     * wallet = wallet.incrementNonce();
     * const afterNonce = wallet.getNonce(); // 2
     * ```
     */
    incrementNonce() : Wallet {
        const walletData = {...this.data};
        walletData.counter = this.data.counter + 1;
        return Wallet.CreateFromDict(walletData);
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

