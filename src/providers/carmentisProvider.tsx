import {ProviderInterface} from "@/src/providers/providerInterface.tsx";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js";
import {SecretEncryptionKey} from "@/src/SecretEncryptionKey.tsx";

export class CarmentisProvider implements ProviderInterface{
    generateWords(): string[] {
        return Carmentis.generateWordList(12);
    }

    generateSeed(words: string[]): Promise<string> {
        return Carmentis.getSeedFromWordList(words);
    }

    encryptSeed(password: string, seed : Uint8Array) : Uint8Array {
        const secretKey = Carmentis.deriveAesKeyFromPassword(password);
        return secretKey.encrypt(seed);
    }

    decryptSeed(password: string, seed : Uint8Array) : Uint8Array {
        const secretKey = Carmentis.deriveAesKeyFromPassword(password);
        return secretKey.decrypt(seed);
    }

    async deriveSecretKeyFromPassword( password : string ) : Promise<SecretEncryptionKey> {
        return Carmentis.deriveAesKeyFromPassword(password);
    }
}