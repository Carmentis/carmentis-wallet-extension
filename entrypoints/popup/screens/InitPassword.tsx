import {useContext, useState} from 'react';
import Input from "@/components/Input.tsx";
import Button from "@/components/Button.tsx";
import {getComponentStack, goTo} from "react-chrome-extension-router";
import Header from "@/components/Header.tsx";
import * as React from "react";
import  secureLocalStorage  from  "react-secure-storage";
import KeepWalletSecure from "./KeepWalletSecure.tsx";
import Wallet from "@/entities/Wallet.ts";
import {useWallet} from "@/hooks/useWallet.tsx";

function InitPassword() {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptRisk, setAcceptRisk] = useState(false);

    const [wallet, storeWallet] = useWallet();

    function savePassword() {
        if(password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }
        if(password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if(!acceptRisk) {
            alert('You must check the box to accept the risk of losing your password.');
            return;
        }

        if(!wallet) {
            storeWallet(
                new Wallet({
                    password: password
                })
            );
        }

        goTo(KeepWalletSecure);
    }

    return (
        <>
            <Header canGoBack={getComponentStack().length > 0}/>
            <p>
                Create a password for your new Carmentis Wallet
            </p>
            <form>
                <Input
                    onChange={(e) => setPassword(e.target.value)}
                    type={"password"} autoComplete={"password"} id={"password"} label={"Password"} name={"password"} autoFocus={true}/>
                <Input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type={"password"} autoComplete={"confirm_password"} id={"confirm_password"} label={"Password confirmation"} name={"password"}/>

                <div className="flex items-center">
                    <Input label={""} id={"accept_risk"} name={"accept_risk"} autoComplete={""}
                           onChange={(e) => setAcceptRisk(e.target.checked)} type={"checkbox"} />
                    <label htmlFor={"accept_risk"}>
                        &nbsp;I understand that if I lose my password, I will lose access to my wallet and funds.
                    </label>
                </div>

                <Button onClick={() => savePassword()} className={"mt-5"}>
                    Next
                </Button>
            </form>
        </>
    );
}

export default InitPassword;
