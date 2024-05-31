// @ts-ignore
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js";
import {sha256} from "js-sha256";
import secureLocalStorage from "react-secure-storage";

export default class Wallet {
    private readonly encryptedSeed: Uint8Array;

    constructor(encryptedSeed: Uint8Array){
        this.encryptedSeed = encryptedSeed;
    }

    public async checkPassword(password: string): Promise<boolean> {
        const {encrypt, decrypt} = Carmentis.deriveAesKeyFromPassword(password);

        const seed = decrypt(this.encryptedSeed);

        return !!seed;
    }

    public async getMnemonic(password: string): Promise<string[]> {
        const {encrypt, decrypt} = Carmentis.deriveAesKeyFromPassword(password);

        const seed = decrypt(this.encryptedSeed);

        if(!seed) {
            throw new Error('Invalid password');
        }

        return Carmentis.generateWordList(seed);
    }
}
