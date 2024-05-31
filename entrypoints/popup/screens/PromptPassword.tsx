import {useContext, useEffect, useState} from 'react';
import Input from "@/components/Input.tsx";
import Button from "@/components/Button.tsx";
import {goTo} from "react-chrome-extension-router";
import * as React from "react";
import {LockContext} from "@/contexts/LockContext.tsx";
import {useWallet} from "@/hooks/useWallet.tsx";
import {SeedContext} from "@/contexts/SeedContext.tsx";
import Wallet from "@/entities/Wallet.ts";

function PromptPassword({nextComponent, nextComponentParams}: {nextComponent?: any, nextComponentParams?:any}) {

    const [password, setPassword] = useState('');

    const {isLocked, setIsLocked} = useContext(LockContext);
    const {wallet, storeSeed} = useContext(SeedContext);

    async function checkPassword() {

        console.log(wallet, typeof wallet, wallet, password, "sdsdsd");

        if(await ((wallet as Wallet).checkPassword(nextComponentParams?.password))) {
            console.log('Wallet unlocked');
            setIsLocked(false);

            if (nextComponent) {
                console.log('Going to next component ', nextComponent, ' with params ', nextComponentParams);
                goTo(nextComponent, nextComponentParams);
            }

        }else{
            //setIsLocked(true);
            alert('Incorrect password');
        }
    }

    useEffect(() => {
        console.log('Checking if wallet is locked', isLocked)
        if(!isLocked || !wallet) {
            if(!wallet) {
                console.warn('Wallet not found');
            }
            if (nextComponent) {
                console.log('Going to next component ', nextComponent, ' with params ', nextComponentParams);
                goTo(nextComponent, nextComponentParams);
            }
        }
    }, []);

    return (
        <>
            <p>
                Type your password to access your Carmentis Wallet
            </p>
            <form onSubmit={checkPassword}>
                <Input
                    onChange={(e) => setPassword(e.target.value)}
                    type={"password"} autoComplete={"password"} id={"password"} label={"Password"} name={"password"} autoFocus={true}
                />

                <Button onClick={() => checkPassword()} className={"mt-5"}>
                    Unlock Wallet
                </Button>
            </form>
        </>
    );
}

export default PromptPassword;
