import React, {createContext, useContext} from 'react';
import ReactDOM from 'react-dom/client';
import "../style.css"
import {HashRouter} from "react-router-dom";
import {FullMainEntrypoint} from "@/entrypoints/main/FullPageApp.tsx";



ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HashRouter>
                <FullMainEntrypoint/>
        </HashRouter>
    </React.StrictMode>,
);

