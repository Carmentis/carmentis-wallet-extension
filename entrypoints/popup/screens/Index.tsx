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
import {useWallet} from "@/hooks/useWallet.tsx";
import {render} from "react-dom";

function Index() {

    const {isLocked, setIsLocked} = useContext(LockContext);

    const [wallet, storeSeed] = useWallet();

    useEffect(() => {
        console.log(wallet)
        if(wallet === null || wallet === undefined) {
            console.log('Wallet does not exist');
            return goTo(NoWallet);
        }

        if(isLocked) {
            goTo(PromptPassword, {nextComponent: Index});
            return;
        }
    }, [wallet, isLocked]);

    useEffect(() => {
        /*setTimeout(() => {
            console.log('Locking wallet');
            setIsLocked(true);
            goTo(PromptPassword, {nextComponent: Index});
        }, 1000);*/
    }, [isLocked]);

    return (
        <>
            <div className="p-5 w-64 min-w-full min-h-96">
            </div>
            <BottomNav />
        </>
    );
}

export default Index;
