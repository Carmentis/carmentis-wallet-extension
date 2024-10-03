import {useState} from "react";
import {Wallet} from "@/src/Wallet.tsx";
import {Route, Routes} from "react-router";
import Home from "@/entrypoints/main/components/Home.tsx";
import '../style.css'

function App() {
    let [wallet, setWallet] = useState<Wallet|null>(null);




    return <>
        <Routes>
            <Route path="/" element={< Home />}></Route>
        </Routes>
    </>;
}

export default App;