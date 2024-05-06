import Button from "@/components/Button.tsx";
import * as React from "react";
import {useWallet} from "@/hooks/useWallet.tsx";
import Index from "@/entrypoints/popup/screens/Index.tsx";
import {goTo} from "react-chrome-extension-router";


function ShowMnemonic() {

    const [wallet, storeWallet] = useWallet();

    return (
        <>
            <div>

                <p>
                    Write down these words in the correct order and keep them safe. You will need them to recover your wallet.
                </p>
                <div className={"w-1/2 mb-5"}>
                    {wallet?.getMnemonic()?.map((word, index) => {
                        return <span key={index} className="bg-gray-100 p-2 m-2 rounded">{word}</span>
                    })}
                </div>
                <Button onClick={() => {
                    if(wallet?.getMnemonic()) {
                        // @ts-ignore
                        navigator.clipboard.writeText(wallet?.getMnemonic() ? wallet.getMnemonic().join(' ') : '');

                        alert('Mnemonic copied to clipboard');
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
