import {useEffect, useState} from 'react';
import {getComponentStack, goBack, goTo, Link} from "react-chrome-extension-router";
import InitPassword from "./InitPassword.tsx";
import Button from "@/components/Button.tsx";
import Header from "@/components/Header.tsx";
import * as React from "react";
import secureLocalStorage from "react-secure-storage";


function NoWallet() {

    return (
        <>
        <Header />
            <Button onClick={() => goTo(InitPassword, { message: 'I came from component one!' })}>
                Create a new Carmentis Wallet
            </Button>
            <Button onClick={() => console.log('Import action')}>
                Import an existing Carmentis Wallet
            </Button>
        </>
    );
}

export default NoWallet;
