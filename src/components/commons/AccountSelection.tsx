import React, {useContext} from "react";
import {Optional} from "@/src/Optional.tsx";
import {AuthenticationContext} from "@/src/components/commons/AuthenticationGuard.tsx";

export function AccountSelection() {

    const authentication = useContext(AuthenticationContext);
    const setWallet = authentication.setWallet.unwrap();
    const wallet = authentication.wallet.unwrap();
    const allAccounts = wallet.getAllAccounts();

    /**
     * This function is fired when the user selects an account.
     *
     * @param accountId The id of the chosen account.
     */
    function selectAccount( accountId : string ) {
        console.log(`[popup] chosen account's identifier: ${accountId}`)
        setWallet(walletOption => {
            const wallet = walletOption.unwrap();
            const updatedWallet = wallet.setActiveAccountById(accountId);
            return Optional.From(updatedWallet)
        })
    }

    return  <>
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto"
                     src="https://cdn.prod.website-files.com/66018cbdc557ae3625391a87/662527ae3e3abfceb7f2ae35_carmentis-logo-dark.svg"
                     alt="Your Company"/>
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Select your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="mb-3 border-2  border-gray-200 rounded-lg">
                    { allAccounts.map(account => {
                        return <div
                            key={account.getId()}
                            className="flex items-center space-x-3 rtl:space-x-reverse h-10 hover:bg-gray-100 border-b-2 border-gray-200 last:border-none px-4 py-6 hover:cursor-pointer"
                            onClick={() => selectAccount(account.getId())}>
                            <img
                                src="https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
                                className="h-6"
                            />
                            <span
                                className="self-center text-xl font-semibold whitespace-nowrap text-black">
                        {account.getPseudo()}
                    </span>
                        </div>
                    })
                    }
                </div>
            </div>
        </div>
    </>
}