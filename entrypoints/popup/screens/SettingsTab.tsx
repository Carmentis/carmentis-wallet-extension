import Button from "@/components/Button.tsx";
import Header from "@/components/Header.tsx";
import * as React from "react";
import secureLocalStorage from "react-secure-storage";
import Index from "@/entrypoints/popup/screens/Index.tsx";
import {goTo} from "react-chrome-extension-router";
import PromptPassword from "@/entrypoints/popup/screens/PromptPassword.tsx";
import {useWallet} from "@/hooks/useWallet.tsx";
import ShowMnemonic from "@/entrypoints/popup/screens/ShowMnemonic.tsx";


function SettingsTab() {
    const [wallet, storeWallet] = useWallet();

    return (
        <>
            <Header canGoBack={true}/>
            <div className="p-5 w-64 min-w-full min-h-96">

                <Button onClick={() => {
                    goTo(PromptPassword, {nextComponent: ShowMnemonic});
                } }>
                    See mnemonic
                </Button>
                <Button onClick={() => {
                    //if(confirm("Are you sure you want to reset your wallet?")) {
                    goTo(PromptPassword, {callback: () => {
                            console.log('Clearing wallet');
                            storeWallet(null);
                            secureLocalStorage.clear();
                        }, nextComponent: Index});
                    //}
                } } className={"bg-red-500"}>
                    Reset wallet
                </Button>

            </div>
        </>
    );
}

export default SettingsTab;
