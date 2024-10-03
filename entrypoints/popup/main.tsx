import React from 'react';
import ReactDOM from 'react-dom/client';
import {PopupAppEntrypoint} from './PopupApp.tsx';
import './style.css'
import './global.css';
import {HashRouter} from "react-router-dom";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
            <HashRouter>
                <PopupAppEntrypoint/>
            </HashRouter>
    </React.StrictMode>,
);


