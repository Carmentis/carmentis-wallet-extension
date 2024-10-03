import '../style.css'
import Login from "@/entrypoints/popup/components/Login.tsx";
import {Route, Routes, useNavigate} from "react-router";
import {Home} from "@/entrypoints/popup/components/Home.tsx";
import {createContext, useEffect, useState} from "react";
import {Wallet} from "@/src/Wallet.tsx";




function App() {
    let [wallet, setWallet] = useState<Wallet|null>(null);




    return <>
          <Routes>
              <Route path="/" element={< Login setWallet={setWallet} />}></Route>
              <Route path="/home" element={< Home wallet={wallet} />}></Route>
          </Routes>
    </>;
}

export default App;
