import React, {useContext, useEffect, useState} from "react";
import {AuthenticationContext} from "@/entrypoints/main/FullPageApp.tsx";
import {Wallet} from "@/src/Wallet.tsx";
import '../../../entrypoints/main/global.css'
import {Account} from "@/src/Account.tsx";
import {EmailValidation} from "@/src/components/dashboard/EmailValidation.tsx";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js"
import {Route, Routes, useNavigate} from "react-router";
import Parameters from "@/src/components/dashboard/Parameters.tsx";
import {extension} from "webextension-polyfill";

export function  Dashboard() {

    const authentication = useContext(AuthenticationContext);
    const wallet : Wallet = authentication.wallet.unwrap();
    const activeAccountIndex : number = authentication.activeAccountIndex.unwrap();
    const activeAccount : Account = wallet.getAccount(activeAccountIndex);

    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState<boolean>(false);


    function goToParameters() {
        navigate("/parameters")
    }

    function goToMain() {
        navigate("/")
    }

    function logout() {
        authentication.Disconnect()
    }

    return (
        <>
                <nav className="bg-white  dark:bg-gray-900 border-b-2 border-gray-100">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <div onClick={goToMain}
                             className="flex items-center space-x-3 rtl:space-x-reverse h-4 border-gray-100 border-2 rounded-3xl py-4 px-1">
                            <img
                                src="/assets/img/user-icon.jpg"
                                className="h-6"
                            />
                            <span
                                className="self-center text-lg font-semibold whitespace-nowrap text-black">
                                {activeAccount.getPseudo()}
                            </span>
                            <button className="rounded-2xl hover:bg-gray-50">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2" d="m19 9-7 7-7-7"/>
                                </svg>
                            </button>


                        </div>

                        <div className="relative inline-block text-left">
                            <div>
                                <button onClick={() => setShowMenu(!showMenu)}
                                        className="inline-flex w-full justify-center rounded-full bg-white p-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                                        id="menu-button" aria-expanded="true" aria-haspopup="true">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke-width="1.5"
                                         stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"/>
                                    </svg>
                                </button>
                            </div>


                            <div hidden={!showMenu}
                                 className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                 role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                                <div className="py-1" role="none">
                                    <div
                                        className="block px-4 py-2 text-sm text-gray-700 hover:text-green-400 hover:cursor-pointer"
                                        id="menu-item-0" onClick={goToParameters}>Parameters
                                    </div>
                                    <div
                                        className="block px-4 py-2 text-sm text-gray-700 hover:text-green-400 hover:cursor-pointer"
                                        id="menu-item-1" onClick={logout}>Logout
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            <div className="h-full w-full p-4">
                <Routes>
                    <Route path="/" element={<EmailValidation/>}/>
                    <Route path="/parameters" element={<Parameters/>}/>
                </Routes>
            </div>


        </>
    )

}

export default Dashboard;
