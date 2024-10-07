import {Wallet, WalletData} from "@/src/Wallet.tsx";
import {ProviderInterface} from "@/src/providers/providerInterface.tsx";
import {SecretEncryptionKey} from "@/src/SecretEncryptionKey.tsx";
import {StorageItem} from "webext-storage";
import {Account} from "@/src/Account.tsx";

const ENCRYPTED_WALLET = "encryptedWallet"
export class SecureWalletStorage {


    constructor( private readonly secretKey : SecretEncryptionKey) {

    }

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