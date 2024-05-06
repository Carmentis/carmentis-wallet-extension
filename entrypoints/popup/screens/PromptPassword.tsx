import {useContext, useEffect, useState} from 'react';
import Input from "@/components/Input.tsx";
import Button from "@/components/Button.tsx";
import {goTo} from "react-chrome-extension-router";
import * as React from "react";
import {LockContext} from "@/contexts/LockContext.tsx";
import {useWallet} from "@/hooks/useWallet.tsx";

function PromptPassword({nextComponent, callback}: {nextComponent?: any, callback?:any}) {

    const [password, setPassword] = useState('');

    const {isLocked, setIsLocked} = useContext(LockContext);
    const [wallet, storeWallet] = useWallet();

    function checkPassword() {

        console.log(wallet, typeof wallet, wallet?.getPassword(), password);

        if(wallet?.getPassword() === password) {
            console.log('Wallet unlocked');
            setIsLocked(false);

            if (callback) {
                console.log('Calling callback')
                callback();
            }
            if (nextComponent) {
                console.log('Going to next component')
                goTo(nextComponent);
            }

        }else{
            setIsLocked(true);
            alert('Incorrect password');
        }
    }

    useEffect(() => {
        console.log('Checking if wallet is locked', isLocked)
        if(!isLocked || !wallet) {
            if (callback) {
                console.log('Calling callback')
                callback();
            }
            goTo(nextComponent);
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
