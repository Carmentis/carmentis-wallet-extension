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

import React, { useEffect, useState, useRef } from "react";
import { AccountCreationModal } from "@/components/shared/AccountCreationModal.tsx";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
    Avatar,
    Divider,
    ClickAwayListener
} from "@mui/material";
import {
    KeyboardArrowDown,
    PersonAdd,
    Check
} from "@mui/icons-material";
import {activeAccountState, walletState} from "@/states/globals.tsx";
import {useWallet} from "@/hooks/useWallet.tsx";
import {useAccountBuilder} from "@/hooks/useAccountBuilder.tsx";
import {IllegalStateError} from "@/errors/IllegalStateError.tsx";
import {Account} from "@/types/Account.ts";
import {Wallet} from "@/types/Wallet.ts";

/**
 * Account selection dropdown component
 *
 * @param input Configuration options for the dropdown
 * @returns Account selection dropdown component
 */
export function DropdownAccountSelection(input: { allowAccountCreation: boolean, large: boolean }) {
    // By default the account creation is enabled
    const allowAccountCreation = typeof input.allowAccountCreation === "boolean" ?
        input.allowAccountCreation : true;

    // References and state
    const { buildAccountFromPseudoAndNonce } = useAccountBuilder();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [showAccountCreation, setShowAccountCreation] = useState<boolean>(false);

    // Recoil state
    const wallet: Wallet = useWallet();
    const activeAccount = useRecoilValue(activeAccountState);
    const setWallet = useSetRecoilState(walletState);

    // Load inactive accounts
    const allAccounts: Account[] = wallet.accounts;
    const inactiveAccounts: Account[] = allAccounts.filter(account => account.id !== activeAccount?.id);

    // Close account creation when dropdown is closed
    useEffect(() => {
        if (!isOpen) {
            setShowAccountCreation(false);
        }
    }, [isOpen]);

    /**
     * Creates and activates a new account
     *
     * @param pseudo Pseudo for the new account
     */
    function createAndActivateNewAccount(pseudo: string) {
        console.log(`[popup] create a new account with pseudo ${pseudo}`);

        setWallet(wallet => {
            if (!wallet) return undefined;
            const nonce = wallet.counter + 1;
            const createdAccount = buildAccountFromPseudoAndNonce(pseudo, nonce);

            return {
                ...wallet,
                counter: nonce,
                accounts: [...wallet.accounts, createdAccount],
                activeAccountId: createdAccount.id
            };
        });
    }

    /**
     * Selects an inactive account by ID
     *
     * @param accountId The ID of the account to select
     */
    function selectInactiveAccount(accountId: string) {
        console.log(`[popup] select the account having the id ${accountId}`);

        // Search the account based on its ID and fail if the account doesn't exist
        const selectedAccount = wallet.accounts.find(a => a.id === accountId);
        if (!selectedAccount) {
            throw new IllegalStateError(`The account with id ${accountId} cannot be found in the wallet`);
        } else {
            setWallet(wallet => {
                return {
                    ...wallet,
                    activeAccountId: accountId
                } as Wallet;
            });
            setIsOpen(false);
        }
    }

    return (
        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
            <div ref={dropdownRef} className="relative">
                {/* Selected account button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 bg-white ${
                        input.large ? "min-w-[180px]" : "min-w-[140px]"
                    }`}
                >
                    <Avatar
                        className="bg-gray-100 text-gray-700"
                        sx={{ width: 28, height: 28, fontSize: '0.875rem' }}
                    >
                        {activeAccount?.pseudo?.charAt(0) || '?'}
                    </Avatar>
                    <span className="text-sm font-medium text-gray-900 truncate flex-1 text-left">
                        {activeAccount?.pseudo || 'Account'}
                    </span>
                    <KeyboardArrowDown
                        className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fontSize="small"
                    />
                </button>

                {/* Dropdown menu */}
                {isOpen && (
                    <div className="absolute left-0 mt-2 z-50 min-w-[240px] bg-white border border-gray-200 rounded-lg shadow-lg">
                        {/* Header */}
                        <div className="px-3 py-2 border-b border-gray-100">
                            <div className="text-xs font-medium text-gray-500">Switch Account</div>
                        </div>

                        {/* Account list */}
                        <div className="py-1">
                            {inactiveAccounts.map(account => (
                                <button
                                    type="button"
                                    key={account.id}
                                    onClick={() => selectInactiveAccount(account.id)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left bg-white"
                                >
                                    <Avatar
                                        className="bg-gray-100 text-gray-700"
                                        sx={{ width: 32, height: 32, fontSize: '1rem' }}
                                    >
                                        {account.pseudo?.charAt(0) || '?'}
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900">
                                            {account.pseudo}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Click to switch
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Add new account button */}
                        {allowAccountCreation && (
                            <>
                                <Divider />
                                <button
                                    type="button"
                                    onClick={() => setShowAccountCreation(true)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 transition-colors text-left bg-white"
                                >
                                    <Avatar
                                        className="bg-blue-50 text-blue-600"
                                        sx={{ width: 32, height: 32 }}
                                    >
                                        <PersonAdd fontSize="small" />
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-blue-600">
                                            Add Account
                                        </div>
                                        <div className="text-xs text-blue-500">
                                            Create new identity
                                        </div>
                                    </div>
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Account creation modal */}
                {showAccountCreation && (
                    <AccountCreationModal
                        onClose={() => {
                            setShowAccountCreation(false);
                            setIsOpen(false);
                        }}
                        onCreate={(pseudo) => {
                            setShowAccountCreation(false);
                            setIsOpen(false);
                            createAndActivateNewAccount(pseudo);
                        }}
                    />
                )}
            </div>
        </ClickAwayListener>
    );
}
