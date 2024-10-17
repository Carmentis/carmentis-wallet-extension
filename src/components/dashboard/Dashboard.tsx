import React, {ReactElement, useContext, useEffect, useState} from "react";
import {Wallet} from "@/src/Wallet.tsx";
import '../../../entrypoints/main/global.css'

import {EmailValidation} from "@/src/components/dashboard/EmailValidation.tsx";
import {Route, Routes, useNavigate} from "react-router";
import Parameters from "@/src/components/dashboard/Parameters.tsx";
import {AuthenticationContext} from "@/src/components/commons/AuthenticationGuard.tsx";
import {DropdownAccountSelection} from "@/src/components/dashboard/DropdownAccountSelection.tsx";


/**
 * Dashboard of the full page application.
 *
 * @constructor
 */
export function Dashboard() : ReactElement {

    // load the authentication context
    const authentication = useContext(AuthenticationContext);

    // state to show the navigation
    const [showMenu, setShowMenu] = useState<boolean>(false);

    // create the navigation
    const navigate = useNavigate();



    function goToParameters() {
        setShowMenu(false)
        navigate("/parameters")
    }

    function logout() {
        setShowMenu(false)
        authentication.Disconnect()
    }

    function goToHelp() {
        setShowMenu(false);
        window.open("https://docs.carmentis.io", "_blank");
    }

    return (
        <>
            <nav className="bg-white  dark:bg-gray-900 border-b-2 border-gray-100">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <div
                         className="flex items-center rtl:space-x-reverse h-4 border-gray-100  py-4 px-1">
                        <DropdownAccountSelection></DropdownAccountSelection>
                    </div>




                    <div className="relative inline-block text-left">
                        <div>
                            <button onClick={() => setShowMenu(!showMenu)}
                                    className="inline-flex w-full justify-center rounded-full bg-white p-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                                        id="menu-button" aria-expanded="true" aria-haspopup="true">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5"
                                         stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"/>
                                    </svg>
                                </button>
                            </div>


                            <div hidden={!showMenu} onMouseLeave={() => setShowMenu(false)}
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
                                    <div
                                        className="block px-4 py-2 text-sm text-gray-700 hover:text-green-400 hover:cursor-pointer"
                                        id="menu-item-0" onClick={goToHelp}>
                                        Get help
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            <div className="h-full w-full p-4">
                <Routes>
                    <Route path="/" element={<DashboardMainContent/>}/>
                    <Route path="/parameters" element={
                        <Parameters  />
                    }/>
                </Routes>
            </div>


        </>
    )

}

export function DashboardMainContent() {
    return <>
        <EmailValidation/>
    </>
}

export default Dashboard;
