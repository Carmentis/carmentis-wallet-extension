import Button from "@/components/Button.tsx";
import * as React from "react";
import Index from "@/entrypoints/popup/screens/Index.tsx";
import {goTo} from "react-chrome-extension-router";
import PromptPassword from "@/entrypoints/popup/screens/PromptPassword.tsx";
import {useContext} from "react";
import {retrieveWallet} from "@/hooks/retrieveWallet.tsx";


async function ShowMnemonic({password}: {password: string|undefined|null}) {

    const wallet = retrieveWallet();

    if(password === null || password === undefined) {
        goTo(PromptPassword, {nextComponent: ShowMnemonic, nextComponentParams: {password: password}});
        return null;
    }

    return (
        <>
            <div>
                <p>
                    Write down these words in the correct order and keep them safe. You will need them to recover your wallet.
                </p>
                <div className={"w-1/2 mb-5"}>
                    {password && wallet && (await wallet.getMnemonic(password))?.map((word, index) => {
                        return <span key={index} className="bg-gray-100 p-2 m-2 rounded">{word}</span>
                    })}
                </div>
                <Button onClick={async () => {
                    if(password) {
                        const mnemonics = await wallet?.getMnemonic(password);

                        if(mnemonics) {
                            // @ts-ignore
                            navigator.clipboard.writeText(wallet?.getMnemonic(password) ? wallet.getMnemonic(password).join(' ') : '');

                            alert('Mnemonic copied to clipboard');
                        }
                    }
                }}>
                    Copy to clipboard
                </Button>
                <Button onClick={() => goTo(Index)}>
                    Continue
                </Button>
            </div>
        </>
    );
}

export default ShowMnemonic;
