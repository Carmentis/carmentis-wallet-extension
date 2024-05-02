import {useState} from "react";
import secureLocalStorage from "react-secure-storage";
import Wallet from "@/entities/Wallet.ts";

export function useWallet() {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [wallet, setWallet] = useState(() => {
        try {
            // Get from local storage by key
            const w = secureLocalStorage.getItem("wallet") as Wallet;
            // Parse stored json or if none return initialValue
            return w ? w : null;
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return null;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const storeWallet = (wallet:Wallet) => {
        try {
            setWallet(wallet);
            secureLocalStorage.setItem("wallet", wallet);
        } catch (error) {
            console.log(error);
        }
    };

    return [wallet, storeWallet];
}
