import {WalletContext} from "@/src/WalletContext.tsx";
import {ProviderInterface} from "@/src/providers/providerInterface.tsx";
import {SecretEncryptionKey} from "@/src/SecretEncryptionKey.tsx";
import {StorageItem} from "webext-storage";

const ENCRYPTED_SEED_STORAGE = "encryptedSeed"
export class SecureWalletStorage {


    constructor( private readonly secretKey : SecretEncryptionKey) {

    }

    static async IsEmpty() : Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const options = new StorageItem<Record<string, Array<number>>>(ENCRYPTED_SEED_STORAGE);
            options.get().then(bytes => {
                console.log("[Storage:isEmpty] then: ", bytes)
                resolve(bytes === undefined || bytes.ENCRYPTED_SEED_STORAGE === undefined)
            }).catch(err => {
                console.error(`[Storage:IsEmpty] catch: ${err}`);
                reject(err)
            });
        })

    }

    static async CreateSecureWalletStorage(provider: ProviderInterface, password: string): Promise<SecureWalletStorage> {
        const secretKey = await provider.deriveSecretKeyFromPassword(password);
        return new SecureWalletStorage(secretKey);
    }

    async readContextFromLocalStorage() : Promise<WalletContext> {
        return new Promise(async (resolve, reject) => {
            const options = new StorageItem<Record<string, Array<number>>>(ENCRYPTED_SEED_STORAGE);
            const bytes = await options.get();
            const encryptedSeed = new Uint8Array(bytes.ENCRYPTED_SEED_STORAGE);
            const seed = await this.secretKey.decrypt(encryptedSeed);
            if (seed) {
                resolve(seed);
            } else {
                reject()
            }
        });
    }

    async writeWalletContextToLocalStorage(walletContext : WalletContext) : Promise<void> {
        const options = new StorageItem<Record<string, Uint8Array>>(ENCRYPTED_SEED_STORAGE);
        const seed = walletContext.getSeed();
        const encryptedSeed = await this.secretKey.encrypt(seed);
        const bytes = Array.from(encryptedSeed);
        return options.set({ENCRYPTED_SEED_STORAGE: bytes});
     }
}