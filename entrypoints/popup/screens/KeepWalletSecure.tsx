import {useContext, useEffect, useState} from 'react';
import {getComponentStack, goBack, goTo, Link} from "react-chrome-extension-router";
import InitPassword from "./InitPassword.tsx";
import Button from "@/components/Button.tsx";
import Header from "@/components/Header.tsx";
import * as React from "react";
import secureLocalStorage from "react-secure-storage";
import Index from "@/entrypoints/popup/screens/Index.tsx";
import PromptPassword from "@/entrypoints/popup/screens/PromptPassword.tsx";
import {LockContext} from "@/contexts/LockContext.tsx";
import ShowMnemonic from "@/entrypoints/popup/screens/ShowMnemonic.tsx";


function KeepWalletSecure() {

    const {isLocked, setIsLocked} = useContext(LockContext);

    return (
        <>
        <Header />
            <p>
                Keep your wallet secure
            </p>
            <Button onClick={() => {
                setIsLocked(false);
                goTo(Index)
            }}>
                Remind me later (not recommended)
            </Button>
            <Button onClick={() => {
                setIsLocked(true);
                goTo(PromptPassword, {nextComponent: ShowMnemonic})
            }}>
                Start (highly recommended)
            </Button>
        </>
    );
}

export default KeepWalletSecure;
