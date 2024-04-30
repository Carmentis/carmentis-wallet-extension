import * as React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-chrome-extension-router';
import Index from './screens/Index';
import { LockContext } from "@/contexts/LockContext.tsx";

// Créez un nouveau composant fonctionnel pour encapsuler la logique d'état
const App = () => {
    const [isLocked, setIsLocked] = React.useState(true); // Utilisation correcte de useState
    const valueLockedProvider = React.useMemo(() => ({ isLocked, setIsLocked }), [isLocked, setIsLocked]);

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-24 lg:px-8">
            <LockContext.Provider value={valueLockedProvider}>
                <Router>
                    <div className={"w-full"}>
                        <Index/>
                    </div>
                </Router>
            </LockContext.Provider>
        </div>
    );
};

// Rendre le composant App dans le DOM
ReactDOM.render(<App />, document.getElementById('root'));
