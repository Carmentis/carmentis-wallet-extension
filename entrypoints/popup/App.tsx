import '../style.css'
import {useState} from "react";
import {Wallet} from "@/src/Wallet.tsx";
import {Splashscreen} from "@/src/components/commons/Splashscreen.tsx";
import "./App.css"
import {Optional} from "@/src/Optional.tsx";
import {Navigate} from "react-router";



function App() {

    const [applicationInitialized, setApplicationInitialized] = useState<boolean>(false);
    const [wallet, setWallet] = useState<Optional<Wallet>>(Optional.Empty());
    const [activeAccount, setActiveAccount] = useState<Optional<Wallet>>(Optional.Empty());

    return <>
        { !applicationInitialized &&
            <Navigate to="/"></Navigate>
        }
    </>;
}

export default App;
