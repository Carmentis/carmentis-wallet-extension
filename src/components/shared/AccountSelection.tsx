/*
 * Copyright (c) Carmentis. All rights reserved.
 * Licensed under the Apache 2.0 licence.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React from "react";
import {useRecoilState} from 'recoil';
import {walletState} from "@/states/states.tsx";
import {Wallet} from "@/types/Wallet.ts";

export default function AccountSelection() {

    const [wallet, setWallet] = useRecoilState(walletState);

    /**
     * This function is fired when the user selects an account.
     *
     * @param accountId The id of the chosen account.
     */
    function selectAccount( accountId : string ) {
        console.log(`[popup] chosen account's identifier: ${accountId}`)
        setWallet(wallet => {
            return {
                ...wallet,
                activeAccountId: accountId
            } as Wallet
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
                    { wallet?.accounts.map(account => {
                        return <div
                            key={account.id}
                            className="flex items-center space-x-3 rtl:space-x-reverse h-10 hover:bg-gray-100 border-b-2 border-gray-200 last:border-none px-4 py-6 hover:cursor-pointer"
                            onClick={() => selectAccount(account.id)}>
                            <img
                                src="https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
                                className="h-6"
                            />
                            <span
                                className="self-center text-xl font-semibold whitespace-nowrap text-black">
                        {account.pseudo}
                    </span>
                        </div>
                    })
                    }
                </div>
            </div>
        </div>
    </>
}