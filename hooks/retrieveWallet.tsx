import Wallet from "@/entities/Wallet.ts";
import {useLocalStorage} from "@uidotdev/usehooks";

export const retrieveWallet = (password?: string) => {
    const [encryptedSeed, setEncryptedSeed] = useLocalStorage<string>('encryptedSeed', '');
    if(!encryptedSeed || encryptedSeed.length === 0) {
        return null;
    }
    return new Wallet(
        new Uint8Array(encryptedSeed.split(',').map(Number))
    );
}
