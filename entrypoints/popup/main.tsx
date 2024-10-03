import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import PopupApp, {PopupAppEntrypoint} from './PopupApp.tsx';
import './style.css';
import {HashRouter} from "react-router-dom";
import {SecureWalletStorage} from "@/src/WalletStorage.tsx";
import background from "@/entrypoints/background.ts";
import {Wallet} from "@/src/Wallet.tsx";



ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
            <HashRouter>
                <PopupAppEntrypoint/>
            </HashRouter>
    </React.StrictMode>,
);


