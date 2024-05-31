import {createContext} from 'react';
import Wallet from "@/entities/Wallet.ts";
import secureLocalStorage from "react-secure-storage";

export const SeedContext = createContext({
    encryptedSeed: new Uint8Array(),
    setEncryptedSeed: (encryptedSeed: Uint8Array) => {}
});

export const retrieveWallet = async (password?: string) => {
    const encryptedSeed = secureLocalStorage.getItem('encryptedSeed');
    if(!encryptedSeed ||  !(encryptedSeed instanceof String)) {
        return null;
    }
    return new Wallet(
        new Uint8Array(encryptedSeed.split(',').map(Number))
    );
}
