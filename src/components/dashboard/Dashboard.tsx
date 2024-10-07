import React, {useContext} from "react";
import {AuthenticationContext} from "@/entrypoints/main/FullPageApp.tsx";
import {Wallet} from "@/src/Wallet.tsx";
import '@/entrypoints/main/global.css'



export function  Dashboard() {

        const authentication = useContext(AuthenticationContext);
        const activeAccount = authentication.activeAccount.unwrap();
        const wallet : Wallet = authentication.wallet.unwrap();

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
                        <button className="btn-primary btn-highlight ring-green-400"  onClick={authentication.clearAuthentication}>Logout</button>
                    </div>
                </nav>
                <div className="h-full w-full">

                    <div className="container mx-auto p-4 bg-green-200">
                        <h1>Entrypoints</h1>
                        <div className="mb-5">
                            <label htmlFor="node-entrypoint"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Node Entrypoint
                            </label>
                            <input type="text" id="node-entrypoint"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="https://node.carmentis.io" required
                                   value={wallet.getNodeEndpoint()}
                                   readOnly={true}
                            />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="data-entrypoint"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Data Entrypoint
                            </label>
                            <input type="text" id="data-entrypoint"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="https://data.carmentis.io" required
                                   value={wallet.getDataEndpoint()}
                                   readOnly={true}
                            />
                        </div>
                        <button
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Save
                        </button>
                    </div>
                </div>
            </>
        )

}

export default Dashboard;
