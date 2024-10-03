import React, {createContext, useContext} from 'react';
import ReactDOM from 'react-dom/client';
import "../style.css"
import {HashRouter} from "react-router-dom";
import App from "@/entrypoints/main/App.tsx";



ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HashRouter>
                <App/>
        </HashRouter>
    </React.StrictMode>,
);

