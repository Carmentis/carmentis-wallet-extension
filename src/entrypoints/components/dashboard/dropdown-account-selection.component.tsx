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

import React, {useEffect, useState} from "react";
import {Wallet} from "@/entrypoints/main/wallet.tsx";
import {Account, CreateFromPseudoAndNonce} from '@/entrypoints/main/Account.tsx';
import {IllegalStateError} from "@/entrypoints/main/errors.tsx";
import {AccountCreationModal} from "@/entrypoints/components/dashboard/account-creation-modal.component.tsx";
import {activeAccountState, useWallet, walletState,} from '@/entrypoints/contexts/authentication.context.tsx';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import Avatar from "boring-avatars";

export function DropdownAccountSelection( input : {allowAccountCreation : boolean, large : boolean } ) {

    // by default the account creation is enabled
    const allowAccountCreation = typeof input.allowAccountCreation === "boolean" ?
        input.allowAccountCreation : true;

    const wallet: Wallet = useWallet();
    const activeAccount = useRecoilValue(activeAccountState);


    const setWallet = useSetRecoilState(walletState);

    // load inactive accounts
    const allAccounts : Account[] = wallet.accounts;
    const inactiveAccounts : Account[] = allAccounts.filter(account => account.id != activeAccount?.id);

    const [showAccountSelectionMenu, setShowAccountSelectionMenu] = useState<boolean>(false);
    const [showAccountCreation, setShowAccountCreation] = useState<boolean>(false);

    const dropdownClass = showAccountSelectionMenu ? "rounded-t-lg" : "rounded-lg";

    // close the account creation content and clear the pseudo value when the account creation is closed
    useEffect(() => {
        if ( !showAccountSelectionMenu ) {
            setShowAccountCreation(false);
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
    function createAndActiveNewAccount(pseudo: string) {
        console.log(`[popup] create a new account for ${pseudo}`)


        setWallet(wallet => {
            if (!wallet) return undefined;
            const nonce = wallet.counter + 1;
            const createdAccount = CreateFromPseudoAndNonce(pseudo, nonce);

            return {
                ...wallet,
                counter: nonce,
                accounts: [...wallet.accounts, createdAccount],
                activeAccountId: createdAccount.id
            }
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
        const selectedAccount = wallet.accounts.find(a => a.id === accountId);
        if ( !selectedAccount ) {
            throw new IllegalStateError(`The account with id ${accountId} cannot be found in the wallet`)
        } else {
            setWallet(wallet => {
                return {
                    ...wallet,
                    activeAccountId: accountId
                } as Wallet
            })
            setShowAccountSelectionMenu(false)
        }
    }


    return <>
        <div id="dropdownUsers" onMouseLeave={onLeavePopup}
             className={
            `bg-white dark:bg-gray-700 border-2 border-gray-100 z-20` + dropdownClass +
                 (input.large ? " account-selection-large" : " account-selection-small")
            }>
            <div onClick={() => setShowAccountSelectionMenu(true)}
                 className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                <Avatar className={"w-6 h-6 mr-2"} name={activeAccount?.pseudo} variant={"beam"}/>

                <span
                    className="self-center text-md font-semibold  text-black">
                                {activeAccount?.pseudo}
                            </span>
            </div>
            {showAccountSelectionMenu &&
                <div className={`border-t-2  z-40 border-gray-100 absolute bg-white rounded-b-lg ` +  (input.large ? "account-selection-large" : "account-selection-small")} hidden={!showAccountSelectionMenu}>
                    <ul className="overflow-y-auto text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownUsersButton">
                        { inactiveAccounts.map( account => {
                            return <li key={account.id} onClick={() => selectInactiveAccount(account.id)}>
                                <div
                                    className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                    <img className="w-6 h-6 me-2 rounded-full"
                                         src="/src/assets/img/user-icon.jpg" alt="Jese image"/>
                                    {account.pseudo}

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
            onClose={() => {
                setShowAccountCreation(false);
                setShowAccountSelectionMenu(false);
            }}
            onCreate={(pseudo: string) => {
                setShowAccountCreation(false);
                setShowAccountSelectionMenu(false);
                createAndActiveNewAccount(pseudo)
            }}
        />}
    </>;
}

