// @ts-ignore
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js";

export default class Wallet {
    private readonly seed: Uint8Array;

    constructor({seed}: {seed: Uint8Array}) {
        this.seed = seed;
    }

    public getSeed(): Uint8Array {
        return this.seed;
    }

    public async getMasterKey(): Promise<Uint8Array> {
        return (await Carmentis.deriveKeyIdFromSeed(this.seed))[0];
    }

    public async getChainlinkId(): Promise<Uint8Array> {
        return (await Carmentis.deriveKeyIdFromSeed(this.seed))[1];
    }

    public async getMnemonic(): Promise<string[]> {
        return await Carmentis.generateWordListFromSeed(this.seed);
    }
}
