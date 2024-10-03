import React from "react";
import {Wallet} from "@/src/Wallet.tsx";
import {wallet} from "@/lib/carmentis-nodejs-sdk";
import {Account} from "@/src/Account.tsx";



export function  Dashboard({ wallet, activeAccount }: {wallet: Wallet, activeAccount: Account}) {

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
                                {activeAccount.pseudo}
                            </span>
                        </a>
                    </div>
                </nav>
                <div className="h-full w-full">

                        <div>
                            Wallet loaded !
                        </div>
                </div>
            </>
        )

}

export default Dashboard;
