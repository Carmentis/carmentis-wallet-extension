import * as Carmentis from "@/lib/carmentis-nodejs-sdk";
import {SecretEncryptionKey} from "@/src/SecretEncryptionKey.tsx";

export interface ProviderInterface {
    generateWords() : string[];
    generateSeed( words : string[] ): Promise<string>;

    encryptSeed(password: string, seed : Uint8Array) : Uint8Array;
    decryptSeed(password: string, seed : Uint8Array) : Uint8Array;
    deriveSecretKeyFromPassword( password : string ) : Promise<SecretEncryptionKey>
}