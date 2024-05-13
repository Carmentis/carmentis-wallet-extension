import Wallet from "@/entities/Wallet.ts";


export class CarmentisProvider {

    public constructor(private wallet: Wallet) {

    }

    async getPublicKey() {
        return this.wallet.getMasterPublicKey();
    }
}
