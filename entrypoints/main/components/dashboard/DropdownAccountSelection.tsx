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

import React, {useContext, useEffect, useState} from "react";
import {Wallet} from "@/entrypoints/main/Wallet.tsx";
import {Account} from "@/entrypoints/main/Account.tsx";
import {Optional} from "@/entrypoints/main/Optional.tsx";
import {IllegalStateError} from "@/entrypoints/main/errors.tsx";
import {AccountCreationModal} from "@/entrypoints/main/components/dashboard/AccountCreationModal.tsx";
import { useAuthenticationContext } from '@/entrypoints/main/contexts/authentication.context.tsx';

export function DropdownAccountSelection( input : {allowAccountCreation : boolean, large : boolean } ) {

    // by default the account creation is enabled
    const allowAccountCreation = typeof input.allowAccountCreation === "boolean" ?
        input.allowAccountCreation : true;

    const authentication = useAuthenticationContext();
    const wallet: Wallet = authentication.wallet.unwrap();
    const activeAccount: Account = wallet.getActiveAccount().unwrap();

    // load inactive accounts
    const allAccounts : Account[] = wallet.getAllAccounts()
    const inactiveAccounts : Account[] = allAccounts.filter(account => account.getId() != activeAccount.getId());

    const [showAccountSelectionMenu, setShowAccountSelectionMenu] = useState<boolean>(false);
    const [showAccountCreation, setShowAccountCreation] = useState<boolean>(false);
    const [newAccountPseudo, setNewAccountPseudo] = useState<string>("");

    const dropdownClass = showAccountSelectionMenu ? "rounded-t-lg" : "rounded-lg";

    // close the account creation content and clear the pseudo value when the account creation is closed
    useEffect(() => {
        if ( !showAccountSelectionMenu ) {
            setShowAccountCreation(false);
            setNewAccountPseudo("");
        }
    }, [showAccountSelectionMenu]);

    function onLeavePopup() {
        if (!showAccountCreation) {
            setShowAccountSelectionMenu(false)
        }

    }


    /**
     * This function is fired by the account creation modal to notify that the user has inputted a pseudo and wants
     * to create a new account based on this modal.
     */
    function createAndActiveNewAccount() {
        console.log(`[popup] create a new account for ${newAccountPseudo}`)

        // create the account and update the active account index
        const setWallet = authentication.setWallet;
        setWallet(walletOption => {
            const wallet = walletOption.unwrap();
            const nonce = wallet.getNonce();
            const createdAccount = Account.CreateFromPseudoAndNonce(newAccountPseudo, nonce);
            const updatedWallet = wallet
                .createAccount(createdAccount)
                .setActiveAccountById(createdAccount.getId())
                .incrementNonce();
            return Optional.From(updatedWallet)
        })
    }


    /**
     * Selects the (inactive) account based on the account id.
     *
     * @param accountId The id of the selected account.
     */
    function selectInactiveAccount( accountId : string ) {
        console.log(`[popup] select the account having the id  ${accountId}`)

        // search the account based on its id and fails if the account do not exist
        const selectedAccountIndexOption = wallet.getAccountIndexById( accountId )
        if ( selectedAccountIndexOption.isEmpty() ) {
            throw new IllegalStateError(`The account with id ${accountId} cannot be found in the wallet`)
        } else {
            const setWallet = authentication.setWallet;
            setWallet(walletOption => {
                const wallet = walletOption.unwrap();
                const updatedWallet = wallet.setActiveAccountByIndex(selectedAccountIndexOption.unwrap());
                return Optional.From(updatedWallet);
            })
            setShowAccountSelectionMenu(false)
        }
    }

    return <>
        <div id="dropdownUsers" onMouseLeave={onLeavePopup}
             className={
            `bg-white dark:bg-gray-700 border-2 border-gray-100 ` + dropdownClass +
                 (input.large ? " account-selection-large" : " account-selection-small")
            }>
            <div onClick={() => setShowAccountSelectionMenu(true)}
                 className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                <img className="w-6 h-6 me-2 rounded-full"
                     src="/assets/img/user-icon.jpg" alt="Jese image"/>
                <span
                    className="self-center text-md font-semibold  text-black">
                                {activeAccount.getPseudo()}
                            </span>
            </div>
            {showAccountSelectionMenu &&
                <div className={`border-t-2 border-gray-100 absolute bg-white rounded-b-lg ` +  (input.large ? "account-selection-large" : "account-selection-small")} hidden={!showAccountSelectionMenu}>
                    <ul className="overflow-y-auto text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownUsersButton">
                        { inactiveAccounts.map( account => {
                            return <li key={account.getId()} onClick={() => selectInactiveAccount(account.getId())}>
                                <div
                                    className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                    <img className="w-6 h-6 me-2 rounded-full"
                                         src="/assets/img/user-icon.jpg" alt="Jese image"/>
                                    {account.getPseudo()}

                                </div>
                            </li>
                        })}
                    </ul>

                    {allowAccountCreation &&
                        <div onClick={() => setShowAccountCreation(true)}
                             className="flex items-center p-3 text-sm font-medium text-blue-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline">
                            <svg className="w-4 h-4 me-2" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="currentColor" viewBox="0 0 20 18">
                                <path
                                    d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z"/>
                            </svg>
                            Add new user
                        </div>
                    }


                </div>
            }
        </div>

        {showAccountCreation && <AccountCreationModal
            inputValue={newAccountPseudo}
            onChange={setNewAccountPseudo}
            onClose={() => {
                setShowAccountCreation(false);
                setShowAccountSelectionMenu(false);
            }}
            onCreate={() => {
                setShowAccountCreation(false);
                setShowAccountSelectionMenu(false);
                createAndActiveNewAccount()
            }}
        />}
    </>;
}

