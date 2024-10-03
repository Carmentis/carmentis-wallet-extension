import React from 'react';
import ReactDOM from 'react-dom/client';
import "./global.css"
import {HashRouter} from "react-router-dom";
import {FullPageEntrypoint} from "@/entrypoints/main/FullPageApp.tsx";



ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HashRouter>
                <FullPageEntrypoint/>
        </HashRouter>
    </React.StrictMode>,
);

