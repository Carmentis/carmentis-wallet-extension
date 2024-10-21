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

import {Wallet, WalletData} from "@/src/Wallet.tsx";
import {ProviderInterface} from "@/src/providers/providerInterface.tsx";
import {SecretEncryptionKey} from "@/src/SecretEncryptionKey.tsx";
import {StorageItem} from "webext-storage";
import {Account} from "@/src/Account.tsx";

const ENCRYPTED_WALLET = "encryptedWallet"
export class SecureWalletStorage {


    constructor( private readonly secretKey : SecretEncryptionKey) {

    }

    /**
     * Returns a promise checking if the wallet storage contains a wallet or not.
     *
     * @constructor
     *
     */
    static async IsEmpty() : Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const options = new StorageItem<Record<string, Array<number>>>(ENCRYPTED_WALLET);
            options.get().then(bytes => {
                resolve(bytes === undefined || bytes.ENCRYPTED_WALLET === undefined)
            }).catch(err => {
                reject(err)
            });
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
    static async CreateSecureWalletStorage(provider: ProviderInterface, password: string): Promise<SecureWalletStorage> {
        const secretKey = await provider.deriveSecretKeyFromPassword(password);
        return new SecureWalletStorage(secretKey);
    }

    async readContextFromLocalStorage() : Promise<Wallet> {
        return new Promise(async (resolve, reject) => {
            try {

                const storageItemSeed = new StorageItem<Record<string, Array<number>>>(ENCRYPTED_WALLET);
                let result = await storageItemSeed.get();
                const ciphertext = result.ENCRYPTED_WALLET;
                const plaintext = await this.secretKey.decrypt(Uint8Array.from(ciphertext));
                const textDecoder = new TextDecoder();
                const walletData : WalletData = JSON.parse(textDecoder.decode(plaintext));

                const wallet : Wallet = Wallet.CreateFromDict(walletData);
                resolve(wallet);
            } catch (e) {
                reject(e)
            }
        });
    }

    async writeWalletContextToLocalStorage(wallet : Wallet) : Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const options = new StorageItem<Record<string, Array<number>>>(ENCRYPTED_WALLET);
                const textEncoder = new TextEncoder();
                const stringifiedWallet : string = JSON.stringify(wallet.data);
                const plaintext = textEncoder.encode(stringifiedWallet);
                const ciphertext = await this.secretKey.encrypt(plaintext).catch(reject);
                await options.set({
                    ENCRYPTED_WALLET: Array.from(ciphertext),
                });

                resolve()
            } catch (e) {
                reject(e)
            }
        });

     }
}