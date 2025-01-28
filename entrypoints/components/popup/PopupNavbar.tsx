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

import React, {useState} from "react";
import {DropdownAccountSelection} from "@/entrypoints/components/dashboard/dropdown-account-selection.component.tsx";
import {useAuthenticationContext, walletState} from '@/entrypoints/contexts/authentication.context.tsx';
import {useRecoilState, useRecoilValue} from "recoil";

export function PopupNavbar() {

    // load the authentication context
    const wallet = useRecoilValue(walletState);
    const {disconnect} = useAuthenticationContext();



    // the account selection menu
    const [showDropdownMenu, setShowDropdownMenu] = useState<boolean>(false);

    /**
     * This function is called when the user wants to see the extension in the main view.
     */
    function goToMainView() {
        browser.runtime.sendMessage({
            action: "open",
            location: "main"
        })
    }


    return <nav className="bg-white border-gray-200 dark:bg-gray-900 border-b-2 border-gray-100">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse h-2 relative">
                <DropdownAccountSelection  allowAccountCreation={false} large={false} ></DropdownAccountSelection>
            </div>

            <div className="relative inline-block text-left">
                <div>
                    <button onClick={() => setShowDropdownMenu(!showDropdownMenu)}
                            className="inline-flex w-full justify-center rounded-full bg-white p-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                            id="menu-button" aria-expanded="true" aria-haspopup="true">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"/>
                        </svg>
                    </button>
                </div>


                <div hidden={!showDropdownMenu} onMouseLeave={() => setShowDropdownMenu(false)}
                     className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                     role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                    <div className="py-1" role="none">
                        <div
                            className="block px-4 py-2 text-sm text-gray-700 hover:text-green-400 hover:cursor-pointer"
                            id="menu-item-0" onClick={goToMainView}>Large View
                        </div>
                        <div
                            className="block px-4 py-2 text-sm text-gray-700 hover:text-green-400 hover:cursor-pointer"
                            id="menu-item-1" onClick={disconnect}>Logout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>;
}