import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './style.css';
import {HashRouter} from "react-router-dom";
import {SecureWalletStorage} from "@/src/WalletStorage.tsx";
import background from "@/entrypoints/background.ts";
import {Wallet} from "@/src/Wallet.tsx";



ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
            <HashRouter>
                <App/>
            </HashRouter>
    </React.StrictMode>,
);


