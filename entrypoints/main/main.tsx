import React from 'react';
import ReactDOM from 'react-dom/client';
import "../style.css"
import {BrowserRouter, HashRouter} from "react-router-dom";
import {SecureWalletStorage} from "@/src/WalletStorage.tsx";
import App from "@/entrypoints/main/App.tsx";


// if no wallet is defined
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

