import * as React from 'react';
import ReactDOM from 'react-dom/client';
import {getComponentStack, Router} from 'react-chrome-extension-router';
import Index from './screens/Index';
import { LockContext } from "@/contexts/LockContext.tsx";
import NoWallet from "@/entrypoints/popup/screens/NoWallet.tsx";
import PromptPassword from "@/entrypoints/popup/screens/PromptPassword.tsx";
import Header from "@/components/Header.tsx";
import Wallet from "@/entities/Wallet.ts";
import {retrieveWallet} from "@/hooks/retrieveWallet.tsx";


// @ts-ignore
const Start = ({isLocked}) => {

    const wallet = retrieveWallet();

    console.log("state of wallet, isLocked", wallet, isLocked)
    if(wallet === null || wallet === undefined) {
        return <NoWallet />;
    }

    if(isLocked) {
        return <PromptPassword nextComponent={Index} />;
    }

    return <Index />;
};
const App = () => {
    const [isLocked, setIsLocked] = React.useState(false);
    const valueLockedProvider = React.useMemo(() => ({ isLocked, setIsLocked }), [isLocked, setIsLocked]);

    // @ts-ignore
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center py-24 lg:px-8 min-w-full w-25">
            <LockContext.Provider value={valueLockedProvider}>
                <Router>
                    <Header canGoBack={getComponentStack().length > 0}/>
                    <div className={"min-h-full p-6"}>
                        <Start isLocked={isLocked} />
                    </div>
                </Router>
            </LockContext.Provider>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
