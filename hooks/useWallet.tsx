import { useState } from "react";
import secureLocalStorage from "react-secure-storage";
import Wallet from "@/entities/Wallet";

export function useWallet(): [Wallet | null, (wallet: Wallet) => void] {
    const [wallet, setWallet] = useState<Wallet | null>(() => {
        const storedData = secureLocalStorage.getItem("wallet");

        let response = null;

        if (typeof storedData === "string") {
            response = storedData ? JSON.parse(storedData) : null;
        }

        if(response === null) {
            return null;
        }

        return new Wallet(response); // Adjust serialization logic as needed
    });

    const storeWallet = (wallet: Wallet|null) => {
        try {
            setWallet(wallet);

            if(wallet === null) {
                secureLocalStorage.clear();
            }else{
                secureLocalStorage.setItem("wallet", JSON.stringify(wallet));
            } // Serialize object to string
        } catch (error) {
            console.error("Failed to store wallet:", error); // More explicit error handling
        }
    };

    return [wallet, storeWallet];
}
