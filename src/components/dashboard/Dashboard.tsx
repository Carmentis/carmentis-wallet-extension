import React, {useContext, useEffect, useState} from "react";
import {AuthenticationContext} from "@/entrypoints/main/FullPageApp.tsx";
import {Wallet} from "@/src/Wallet.tsx";
import '../../../entrypoints/main/global.css'
import {Account} from "@/src/Account.tsx";
import {EmailValidation} from "@/src/components/dashboard/EmailValidation.tsx";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js"
import {Route, Routes} from "react-router";
import Parameters from "@/src/components/dashboard/Parameters.tsx";

export function  Dashboard() {

    const authentication = useContext(AuthenticationContext);
    const wallet : Wallet = authentication.wallet.unwrap();
    const activeAccountIndex : number = authentication.activeAccountIndex.unwrap();
    const activeAccount : Account = wallet.getAccount(activeAccountIndex);




    return (
        <>
                <nav className="bg-white  dark:bg-gray-900 border-b-2 border-gray-100">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse h-4">
                            <img
                                src="https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
                                className="h-6"
                            />
                            <span
                                className="self-center text-xl font-semibold whitespace-nowrap text-black">
                                {activeAccount.getPseudo()}
                            </span>
                        </a>
                        <button className="btn-primary btn-highlight ring-green-400"
                                onClick={authentication.Disconnect}>Logout
                        </button>
                    </div>
                </nav>
                <div className="h-full w-full p-4">
                    <Routes>
                        <Route path="/" element={<EmailValidation />} />
                        <Route path="/parameters" element={<Parameters />} />
                    </Routes>
                </div>


        </>
    )

}

export default Dashboard;
