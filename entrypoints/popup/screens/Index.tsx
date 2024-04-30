import {useContext, useEffect, useState} from 'react';
import {getComponentStack, goBack, goTo, Link} from "react-chrome-extension-router";
import Header from "@/components/Header.tsx";
import BottomNav from "@/components/BottomNav.tsx";
import NoWallet from "./NoWallet.tsx";
import * as React from "react";
import secureLocalStorage from "react-secure-storage";
import Wallet from "@/entities/Wallet.ts";
import PromptPassword from "@/entrypoints/popup/screens/PromptPassword.tsx";
import {LockContext} from "@/contexts/LockContext.tsx";

function Index() {

    const {isLocked, setIsLocked} = useContext(LockContext);

    let wallet: Wallet|null = secureLocalStorage.getItem("wallet") as Wallet|null;

    useEffect(() => {
        if(wallet !== null) {
            console.log('Wallet exists');
        }else{
            console.log('Wallet does not exist');
            goTo(NoWallet);
            return;
        }

        if(isLocked) {
            goTo(PromptPassword, {nextComponent: Index});
            return;
        }
    }, [wallet]);

    useEffect(() => {
        /*setTimeout(() => {
            console.log('Locking wallet');
            setIsLocked(true);
            goTo(PromptPassword, {nextComponent: Index});
        }, 1000);*/
    }, [isLocked]);

    return (
        <>
            <Header />
            <div className="p-5 w-64 min-w-full">
                <p>
                </p>
            </div>
            <BottomNav />
        </>
    );
}

export default Index;
