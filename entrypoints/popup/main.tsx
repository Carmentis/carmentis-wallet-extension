import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './style.css';
import {HashRouter} from "react-router-dom";
import {SecureWalletStorage} from "@/src/WalletStorage.tsx";
import background from "@/entrypoints/background.ts";

function launchExtensionOnTab() {
    const extensionId = browser.runtime.id;

    browser.tabs.query({}).then((allTabs) => {
        // if a tab is already opened for the extension, focus it
        for (let tab of allTabs) {
            if (tab.id && tab.url && tab.url.includes(extensionId)) {
                browser.tabs.update(tab.id, {active: true});
                return
            }
        }

        // otherwise open a new tab for it
        browser.tabs.create({
            url: "../initialisation.html"
        })
    });
}

// if no wallet is defined
console.log("popup executed")
let emptyWallet = await SecureWalletStorage.IsEmpty();
if (emptyWallet) {
    browser.runtime.sendMessage({
        action: "open",
        location: "onboarding"
    })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HashRouter>
            <App/>
        </HashRouter>
    </React.StrictMode>,
);


