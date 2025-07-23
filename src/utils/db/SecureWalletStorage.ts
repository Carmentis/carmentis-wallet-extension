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


import {ProviderInterface} from "@/providers/providerInterface.tsx";
import {SecretEncryptionKey} from '@/utils/secret-encryption-key.ts';

import {Wallet} from "@/types/Wallet.ts";

const ENCRYPTED_WALLET = "encryptedWallet"
const ENCRYPTED_WALLET_DB_VERSION = 1;
export class SecureWalletStorage {


    constructor( private readonly secretKey: SecretEncryptionKey) {

    }

    private  static  OpenDatabase() : Promise<IDBObjectStore> {
        return new Promise(async (resolve, reject) => {
            const request = indexedDB.open(ENCRYPTED_WALLET, ENCRYPTED_WALLET_DB_VERSION);

            request.onerror = () => {
                reject(new Error("Failed to open the encryptedWallet database."));
            };

            request.onsuccess = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Open a transaction on the "encryptedWallet" table
                const transaction = db.transaction("encryptedWallet", "readwrite");
                const store = transaction.objectStore("encryptedWallet");

                resolve(store);
            };

            request.onupgradeneeded = () => {
                var db = request.result;

                // create the encrypted wallet table
                db.createObjectStore(ENCRYPTED_WALLET);
            };
        })
    }

    /**
     * Returns a promise checking if the wallet storage contains a wallet or not.
     *
     * @constructor
     *
     */
    static async IsEmpty() : Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            // Open a connection to the "encryptedWallet" database
            try {
                // Check if the "wallet" key exists
                const store = await SecureWalletStorage.OpenDatabase();
                const getRequest = store.get("wallet");

                getRequest.onsuccess = () => {
                    resolve(getRequest.result === undefined);
                };

                getRequest.onerror = () => {
                    reject(new Error("Failed to retrieve the key from the encryptedWallet table."));
                };
            } catch (e) {
                console.error(e)
                reject(e)
            }
        })
    }

    /**
     * Create a secure storage based on the provider and the password given as parameters.
     *
     * The provider is used to handle the cryptographic operations while the password is used as a key to securely
     * store the wallet.
     *
     * @param provider
     * @param password
     * @constructor
     */
    static async CreateSecureWalletStorage(provider: ProviderInterface, password: string | undefined): Promise<SecureWalletStorage> {
        if (!password) throw new Error('Cannot access to the wallet using an undefined password')
        const secretKey = await provider.deriveSecretKeyFromPassword(password);
        return new SecureWalletStorage(secretKey);
    }

    async readWalletFromStorage() : Promise<Wallet> {
        return new Promise(async (resolve, reject) => {
            try {
                // read the encrypted wallet
                const store = await SecureWalletStorage.OpenDatabase();
                const getResult = store.get('wallet')
                getResult.onerror = (error) => {
                    console.error('Error while reading wallet:', error)
                    reject()
                }
                getResult.onsuccess = async () => {
                    // decrypt the wallet
                    const ciphertext = getResult.result;
                    const plaintext = await this.secretKey.decrypt(Uint8Array.from(ciphertext));
                    const textDecoder = new TextDecoder();
                    const wallet : Wallet = JSON.parse(textDecoder.decode(plaintext));
                    console.log("Wallet obtained from storage:", wallet)
                    resolve(wallet)
                }
            } catch (e) {
                console.error(e)
                reject(e)
            }
        });
    }

    async writeWalletToStorage(wallet : Wallet) : Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                // encrypt the wallet
                const textEncoder = new TextEncoder();
                const plaintext = textEncoder.encode(JSON.stringify(wallet));
                const ciphertext = await this.secretKey.encrypt(plaintext).catch(reject);

                // store the encrypted wallet
                const store = await SecureWalletStorage.OpenDatabase();
                const putResult = store.put(ciphertext, 'wallet')

                putResult.onsuccess = () => resolve()
                putResult.onerror = () => reject()


                resolve()
            } catch (e) {
                console.error(e)
                reject(e)
            }
        });

     }
}