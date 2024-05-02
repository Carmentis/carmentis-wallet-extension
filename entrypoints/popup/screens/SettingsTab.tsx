import Button from "@/components/Button.tsx";
import Header from "@/components/Header.tsx";
import * as React from "react";
import secureLocalStorage from "react-secure-storage";
import Index from "@/entrypoints/popup/screens/Index.tsx";
import {goTo} from "react-chrome-extension-router";


function SettingsTab() {

    return (
        <>
            <Header />
            <Button onClick={() => {
                secureLocalStorage.removeItem('wallet')
                goTo(Index);
            } }>
                Reset wallet
            </Button>
        </>
    );
}

export default SettingsTab;
