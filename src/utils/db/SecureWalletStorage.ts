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

import {openDB, deleteDB, wrap, unwrap, IDBPDatabase, IDBPTransaction, StoreNames} from 'idb';
import {Wallet} from "@/types/Wallet.ts";
import {ProviderInterface} from "@/types/ProviderInterface.ts";
import {SymmetricEncryptionKey} from "@cmts-dev/carmentis-sdk/client";
import {ExtensionWalletBinaryEncoder, ExtensionWalletEncoder} from "@/types/ExtensionWalletEncoder.ts";

const ENCRYPTED_WALLET_DB = "encryptedWallet"
const ENCRYPTED_WALLET_DB_INITIAL_VERSION = 1;
const ENCRYPTED_WALLET_DB_VERSION = ENCRYPTED_WALLET_DB_INITIAL_VERSION;
const ENCRYPTED_WALLET_TABLE = 'wallet';
const ENCRYPTED_WALLET_ENTRY = 1;


interface WalletDatabaseEntry {
    walletId: number,
    encryptedWallet: Uint8Array<ArrayBufferLike>,
}

export class SecureWalletStorage {


    constructor( private readonly secretKey: SymmetricEncryptionKey) {

    }

    private static  OpenDatabase() : Promise<IDBPDatabase<WalletDatabaseEntry>> {
        return openDB<WalletDatabaseEntry>(ENCRYPTED_WALLET_DB, ENCRYPTED_WALLET_DB_VERSION, {
            upgrade(database: IDBPDatabase<WalletDatabaseEntry>, oldVersion: number, newVersion: number | null, transaction: IDBPTransaction<WalletDatabaseEntry, StoreNames<WalletDatabaseEntry>[], "versionchange">, event: IDBVersionChangeEvent) {
                // we currently have nothing to do here
                console.log(`Upgrading database from ${oldVersion} to ${newVersion}`)
                if (newVersion === ENCRYPTED_WALLET_DB_INITIAL_VERSION) {
                    console.log("Creating encryptedWallet table")
                    database.createObjectStore(ENCRYPTED_WALLET_TABLE, {
                        keyPath: 'walletId'
                    });
                }
            }
        });
    }

    /**
     * Returns a promise checking if the wallet storage contains a wallet or not.
     *
     * @constructor
     *
     */
    static async IsEmpty() : Promise<boolean> {
        const db = await SecureWalletStorage.OpenDatabase();
        const foundNumberOfWallets = await db.count(ENCRYPTED_WALLET_TABLE);
        return foundNumberOfWallets === 0;
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
    static async CreateSecureWalletStorage(provider: ProviderInterface, password: string): Promise<SecureWalletStorage> {
        if (typeof password !== 'string') throw new Error('Cannot access to the wallet using an undefined password')
        const secretKey = await provider.deriveSecretKeyFromPassword(password);
        return new SecureWalletStorage(secretKey);
    }

    async readWalletFromStorage() : Promise<Wallet> {
        try {
            // read the encrypted wallet
            const store = await SecureWalletStorage.OpenDatabase();
            const encryptedWallets = await store.getAll(ENCRYPTED_WALLET_TABLE);
            if (encryptedWallets.length === 0) throw new Error('No wallet found in the encryptedWallet database.');
            if (encryptedWallets.length > 1) throw new Error('More than one wallet found in the encryptedWallet database.');

            // decrypt the wallet
            const databaseEntry: WalletDatabaseEntry = encryptedWallets[0];
            const plaintext = await this.secretKey.decrypt(databaseEntry.encryptedWallet);
            return ExtensionWalletBinaryEncoder.decode(plaintext);
        } catch (e) {
            console.error(e)
            throw new Error(`Cannot read the wallet from the encryptedWallet database: ${e}.`)
        }
    }

    async writeWalletToStorage(wallet : Wallet) : Promise<void> {
        try {
            // encrypt the wallet
            const plaintext = ExtensionWalletBinaryEncoder.encode(wallet);
            const ciphertext = await this.secretKey.encrypt(plaintext);

            // store the encrypted wallet
            const store = await SecureWalletStorage.OpenDatabase();
            await store.put(ENCRYPTED_WALLET_TABLE, {
                walletId: ENCRYPTED_WALLET_ENTRY,
                encryptedWallet: ciphertext,
            });
        } catch (e) {
            console.error(e)
            throw new Error("Cannot write the wallet to the encryptedWallet database: " + e + ".")
        }

     }
}