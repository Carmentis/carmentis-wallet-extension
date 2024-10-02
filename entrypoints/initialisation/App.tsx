import {useContext, useState} from 'react';
import {PasswordCreation} from "./components/PasswordCreation.tsx"
import {Home} from "@/entrypoints/initialisation/components/Home.tsx";
import {Route, Routes, useNavigate} from "react-router";
import {BrowserRouter} from "react-router-dom";
import {RecoveryPhrase} from "@/entrypoints/initialisation/components/RecoveryPhrase.tsx";
import {SetupWallet} from "@/entrypoints/initialisation/components/SetupWallet.tsx";

// define the password and seed that need to be
let password : string | undefined = undefined;
let seed : string  | undefined = undefined;


function App() {

    return (
        <>
            <div id="app-content" className="flex min-h-full justify-center flex-col">
                <div className="app-header mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                    <img
                        src="https://cdn.prod.website-files.com/66018cbdc557ae3625391a87/662527ae3e3abfceb7f2ae35_carmentis-logo-dark.svg"
                        alt=""/>
                </div>
                <div className="app-body">
                    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 ">
                        <div
                            className="app-modal mt-10 sm:mx-auto sm:w-full xs:max-w-xs lg:w-6/12 border-solid border-2 rounded-2xl p-4">

                            <Routes>

                                <Route path="/create-password" element={< PasswordCreation />}></Route>
                                <Route path="/recovery-phrase" element={< RecoveryPhrase />}></Route>
                                <Route path="/setup-wallet" element={< SetupWallet />}></Route>
                                <Route path="*" element={< Home/>}></Route>
                            </Routes>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );

}


export default App;
