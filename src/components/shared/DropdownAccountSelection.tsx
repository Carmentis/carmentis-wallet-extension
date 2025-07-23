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
import { motion, AnimatePresence } from "framer-motion";
import {
    Box,
    Button,
    Chip,
    Typography,
    Avatar,
    Divider,
    Paper,
    ClickAwayListener,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemButton
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
import {Account} from "@/types/Account.tsx";
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

    // Animation variants
    const dropdownVariants = {
        hidden: { opacity: 0, y: -5, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.25,
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        },
        exit: {
            opacity: 0,
            y: -5,
            scale: 0.95,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        }
    };

    return (
        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
            <Box ref={dropdownRef} className="relative">
                {/* Selected account button */}
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    variant="text"
                    className={`flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200 border border-gray-100 shadow-sm ${
                        input.large ? "min-w-52" : "min-w-40"
                    }`}
                    endIcon={
                        <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-blue-500"
                        >
                            <KeyboardArrowDown />
                        </motion.div>
                    }
                >
                    <Box className="flex items-center">
                        <Avatar
                            className="bg-blue-50 text-blue-600 mr-2.5 border border-blue-100"
                            sx={{ width: 32, height: 32 }}
                        >
                            {activeAccount?.pseudo?.charAt(0) || ''}
                        </Avatar>
                        <Box>
                            <Typography
                                variant="body2"
                                className="font-medium text-gray-800 truncate"
                                sx={{ maxWidth: input.large ? 120 : 80 }}
                            >
                                {activeAccount?.pseudo || ''}
                            </Typography>

                        </Box>
                    </Box>
                </Button>

                {/* Dropdown menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute left-0 mt-2 z-50 min-w-56"
                        >
                            <Paper
                                elevation={0}
                                className="border border-gray-100 rounded-xl overflow-hidden shadow-md"
                            >
                                {/* Header */}
                                <Box className="py-3 px-4 bg-gray-50 border-b border-gray-100">
                                    <Typography variant="subtitle2" className="text-gray-700 font-medium">
                                        Select Account
                                    </Typography>
                                </Box>

                                {/* Account list */}
                                <List className="py-1">
                                    {inactiveAccounts.map(account => (
                                        <ListItemButton
                                            key={account.id}
                                            onClick={() => selectInactiveAccount(account.id)}
                                            className="py-2 px-4 hover:bg-blue-50 transition-colors"
                                        >
                                            <ListItemAvatar className="min-w-0 mr-2">
                                                <Avatar
                                                    className="bg-blue-50 text-blue-600 border border-blue-100"
                                                    sx={{ width: 32, height: 32 }}
                                                >
                                                    {account.pseudo?.charAt(0) || ''}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body2" className="font-medium text-gray-800">
                                                        {account.pseudo || ''}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography variant="caption" className="text-gray-500">
                                                        Switch to this account
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>

                                {/* Add new account button */}
                                {allowAccountCreation && (
                                    <>
                                        <Divider className="my-1" />
                                        <ListItemButton
                                            onClick={() => setShowAccountCreation(true)}
                                            className="py-2.5 px-4 text-blue-600 hover:bg-blue-50 transition-colors"
                                        >
                                            <ListItemAvatar className="min-w-0 mr-2">
                                                <Avatar
                                                    className="bg-blue-50 text-blue-600 border border-blue-100"
                                                    sx={{ width: 32, height: 32 }}
                                                >
                                                    <PersonAdd fontSize="small" />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body2" className="font-medium text-blue-600">
                                                        Add new account
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography variant="caption" className="text-blue-400">
                                                        Create a new identity
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </>
                                )}
                            </Paper>
                        </motion.div>
                    )}
                </AnimatePresence>

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
            </Box>
        </ClickAwayListener>
    );
}
