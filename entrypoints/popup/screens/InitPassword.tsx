import {useContext, useState} from 'react';
import Input from "@/components/Input.tsx";
import Button from "@/components/Button.tsx";
import {getComponentStack, goTo} from "react-chrome-extension-router";
import * as React from "react";
import KeepWalletSecure from "./KeepWalletSecure.tsx";
import Wallet from "@/entities/Wallet.ts";
import {useWallet} from "@/hooks/useWallet.tsx";
// @ts-ignore
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js";
import Index from "@/entrypoints/popup/screens/Index.tsx";

function InitPassword() {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptRisk, setAcceptRisk] = useState(false);

    const [wallet, storeWallet] = useWallet();

    async function savePassword() {
        if(password.length < 5) {
            alert('Password must be at least 5 characters long');
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

            const mnemonic:string[] = await Carmentis.generateWordList();
            const masterKey = await Carmentis.deriveFromWordList(mnemonic);

            const wallet = new Wallet({
                password: password,
                mnemonic: mnemonic,
                masterKey: masterKey
            });

            console.log('Wallet created', wallet);

            storeWallet(wallet);
            goTo(KeepWalletSecure);
        } else {
            wallet.setPassword(password);
            storeWallet(wallet);
            goTo(Index)
        }

    }

    return (
        <>
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
                        &nbsp;I understand that if I lose my password, <br/> I will lose access to my wallet and funds.
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
