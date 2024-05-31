import {useContext, useState} from "react";
import secureLocalStorage from "react-secure-storage";
import Wallet from "@/entities/Wallet";
// @ts-ignore
import * as Carmentis from "@/lib/carmentis-nodejs-sdk";
import {SeedContext} from "@/contexts/SeedContext.tsx";

export function useWallet(): [Wallet | null | undefined, (seed: any, password: string) => void] {
    const {seed, setEncryptedSeed} = useContext(SeedContext);
    const storeSeed = async (seed: Uint8Array, password: string) => {
        try {
            if(seed === null || seed === undefined){
                console.log("clearing wallet in secure storage");
                //secureLocalStorage.clear();
                setWallet(null);
            }else{
                console.log("password", password);
                console.log(await Carmentis.deriveAesKeyFromPassword(password))
                const {encrypt} = await Carmentis.deriveAesKeyFromPassword(password);
                const encryptedSeed = await encrypt(seed);

                secureLocalStorage.setItem('encryptedSeed', encryptedSeed.toString());

                const __wallet = new Wallet({
                    encryptedSeed: encryptedSeed
                });

                setWallet(
                    __wallet
                );

                return __wallet;
            }
        } catch (error) {
            console.error("Failed to store wallet:", error); // More explicit error handling
        }
    };

    const carmentisWallet = wallet?.isInitialized ? wallet : (() => {
        console.log('retrieving wallet');
        const encryptedSeed = secureLocalStorage.getItem('encryptedSeed');
        console.log('encryptedSeed', encryptedSeed);
        if(!encryptedSeed ||  !(encryptedSeed instanceof String)) {
            return null;
        }
        return new Wallet({
            encryptedSeed: new Uint8Array(encryptedSeed.split(',').map(Number))
        });
    })();



    return [wallet, storeSeed];
}
