import * as React from 'react';
import {getComponentStack, Router} from 'react-chrome-extension-router';
import Index from './screens/Index';
import { LockContext } from "@/contexts/LockContext.tsx";
import {useWallet} from "@/hooks/useWallet.tsx";
import {createRoot} from "react-dom/client";
import Wallet from "@/entities/Wallet.ts";
import NoWallet from "@/entrypoints/popup/screens/NoWallet.tsx";
import PromptPassword from "@/entrypoints/popup/screens/PromptPassword.tsx";
import Header from "@/components/Header.tsx";

const Start = ({wallet, isLocked}) => {
    if(wallet === null) {
        return <NoWallet />;
    }

    if(isLocked) {
        return <PromptPassword nextComponent={Index} />;
    }

    return <Index />;
};

const App = () => {
    const [isLocked, setIsLocked] = React.useState(true);
    const [wallet, storeWallet] = useWallet();
    const valueLockedProvider = React.useMemo(() => ({ isLocked, setIsLocked }), [isLocked, setIsLocked]);

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center py-24 lg:px-8 min-w-full w-25">
            <LockContext.Provider value={valueLockedProvider}>
                <Router>
                    <Header canGoBack={getComponentStack().length > 0}/>
                    <div className={"min-h-full p-6"}>
                        <Start wallet={wallet} isLocked={isLocked} />
                    </div>
                </Router>
            </LockContext.Provider>
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
