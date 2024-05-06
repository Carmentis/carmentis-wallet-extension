import {useEffect, useState} from 'react';
import {getComponentStack, goBack, goTo, Link} from "react-chrome-extension-router";
import InitPassword from "./InitPassword.tsx";
import Button from "@/components/Button.tsx";
import Header from "@/components/Header.tsx";
import * as React from "react";
import secureLocalStorage from "react-secure-storage";
import PromptMnemonic from "@/entrypoints/popup/screens/PromptMnemonic.tsx";


function NoWallet() {

    return (
        <>
            <Header />
            <Button onClick={() => goTo(InitPassword)}>
                Create a new Carmentis Wallet
            </Button>
            <Button onClick={() => goTo(PromptMnemonic)}>
                Import an existing Carmentis Wallet
            </Button>
        </>
    );
}

export default NoWallet;
