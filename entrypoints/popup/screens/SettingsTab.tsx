import Button from "@/components/Button.tsx";
import Header from "@/components/Header.tsx";
import * as React from "react";
import secureLocalStorage from "react-secure-storage";
import Index from "@/entrypoints/popup/screens/Index.tsx";
import {goTo} from "react-chrome-extension-router";
import PromptPassword from "@/entrypoints/popup/screens/PromptPassword.tsx";
import ShowMnemonic from "@/entrypoints/popup/screens/ShowMnemonic.tsx";
import Confirm from "@/entrypoints/popup/screens/Confirm.tsx";
import {retrieveWallet} from "@/hooks/retrieveWallet.tsx";
import {useLocalStorage} from "@uidotdev/usehooks";


function SettingsTab() {
    const wallet = retrieveWallet();
    const [encryptedSeed, setEncryptedSeed] = useLocalStorage<string>('encryptedSeed', '');


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
                    /*Confirm({
                        title: "Reset wallet",
                            description: "Are you sure you want to reset your wallet? This will delete all your data and you will need to recover your wallet using your mnemonic phrase.",
                        onConfirm: () => {
                        goTo(PromptPassword, {
                            nextComponentParams: () => {
                                console.log('Clearing wallet');
                                storeSeed(null);
                                secureLocalStorage.clear();
                            }, nextComponent: Index
                        });
                        }
                    });*/
                    /*
                    goTo(
                        Confirm,
                        {
                            title: "Reset wallet",
                            description: "Are you sure you want to reset your wallet? This will delete all your data and you will need to recover your wallet using your mnemonic phrase.",
                            onConfirm: () => {
                                goTo(PromptPassword, {
                                    nextComponentParams: () => {
                                        console.log('Clearing wallet');
                                        storeSeed(null);
                                        secureLocalStorage.clear();
                                    }, nextComponent: Index
                                });
                            }
                        });
                     */

                    console.log('Clearing wallet');
                    window.localStorage.clear();
                    goTo(Index);

                    /*goTo(Confirm, {
                        title: "Reset wallet",
                        description: "Are you sure you want to reset your wallet? This will delete all your data and you will need to recover your wallet using your mnemonic phrase.",
                        onConfirm: () => {
                            console.log('Clearing wallet');
                            window.localStorage.clear();
                            goTo(Index);
                        }
                    })*/
                }} className={"bg-red-500"}>
                    Reset wallet
                </Button>

            </div>
        </>
    );
}

export default SettingsTab;
