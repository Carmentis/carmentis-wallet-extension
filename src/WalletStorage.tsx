import {Wallet} from "@/src/Wallet.tsx";
import {ProviderInterface} from "@/src/providers/providerInterface.tsx";
import {SecretEncryptionKey} from "@/src/SecretEncryptionKey.tsx";
import {StorageItem} from "webext-storage";
import {Account} from "@/src/Account.tsx";

const ENCRYPTED_SEED_STORAGE = "encryptedSeed"
const ENCRYPTED_ACCOUNTS = "encryptedAccounts"
export class SecureWalletStorage {


    constructor( private readonly secretKey : SecretEncryptionKey) {

    }

    static async IsEmpty() : Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const options = new StorageItem<Record<string, Array<number>>>(ENCRYPTED_SEED_STORAGE);
            options.get().then(bytes => {
                resolve(bytes === undefined || bytes.ENCRYPTED_SEED_STORAGE === undefined)
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

                const storageItemSeed = new StorageItem<Record<string, Array<number>>>(ENCRYPTED_SEED_STORAGE);
                let result = await storageItemSeed.get();
                const encryptedSeedBytes = new Uint8Array(result.ENCRYPTED_SEED_STORAGE);
                const seedBytes = await this.secretKey.decrypt(encryptedSeedBytes);

                const storageItemAccounts = new StorageItem<Record<string, Array<number>>>(ENCRYPTED_ACCOUNTS);
                var resultAccounts = await storageItemAccounts.get();
                const encryptedAccountsBytes = new Uint8Array(resultAccounts.ENCRYPTED_ACCOUNTS);
                const accountsBytes = await this.secretKey.decrypt(encryptedAccountsBytes).catch(reject);
;
                const textDecoder = new TextDecoder();
                const accounts : Account[] = JSON.parse(
                    textDecoder.decode(accountsBytes)
                );

                const wallet = Wallet.CreateFromBytesAndAccounts(seedBytes, accounts)
                resolve(wallet);
            } catch (e) {
                reject(e)
            }
        });
    }

    async writeWalletContextToLocalStorage(walletContext : Wallet) : Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                {
                    // store the encrypted seed
                    const options = new StorageItem<Record<string, Array<number>>>(ENCRYPTED_SEED_STORAGE);
                    const seed = walletContext.getSeed();
                    const encryptedSeed = await this.secretKey.encrypt(seed);
                    await options.set({
                        ENCRYPTED_SEED_STORAGE: Array.from(encryptedSeed),
                    });
                }

                {
                    // store the encrypted accounts
                    const options = new StorageItem<Record<string, Array<number>>>(ENCRYPTED_ACCOUNTS);
                    const textEncoder = new TextEncoder();
                    console.log(walletContext, walletContext.accounts);
                    const stringifyAccounts = JSON.stringify(walletContext.accounts)
                    const bytesAccounts = textEncoder.encode(stringifyAccounts);
                    const encryptedAccounts = await this.secretKey.encrypt(bytesAccounts)
                    await options.set({
                        ENCRYPTED_ACCOUNTS: Array.from(encryptedAccounts),
                    })
                }

                resolve()
            } catch (e) {
                reject(e)
            }
        });

     }
}