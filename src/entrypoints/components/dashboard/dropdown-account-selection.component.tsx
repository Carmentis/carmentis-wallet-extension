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
import { Wallet } from "@/entrypoints/main/wallet.tsx";
import { Account, CreateFromPseudoAndNonce } from '@/entrypoints/main/Account.tsx';
import { IllegalStateError } from "@/entrypoints/main/errors.tsx";
import { AccountCreationModal } from "@/entrypoints/components/dashboard/account-creation-modal.component.tsx";
import { activeAccountState, useWallet, walletState } from '@/entrypoints/contexts/authentication.context.tsx';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import AvatarUser from "@/entrypoints/components/avatar-user.tsx";
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
   * @param firstname First name for the new account
   * @param lastname Last name for the new account
   */
  function createAndActivateNewAccount(firstname: string, lastname: string) {
    console.log(`[popup] create a new account for ${firstname} ${lastname}`);

    setWallet(wallet => {
      if (!wallet) return undefined;
      const nonce = wallet.counter + 1;
      const createdAccount = CreateFromPseudoAndNonce(firstname, lastname, nonce);

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
        duration: 0.2,
        ease: "easeOut"
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
          className={`flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors duration-200 ${
            input.large ? "min-w-48" : "min-w-36"
          }`}
          endIcon={
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <KeyboardArrowDown />
            </motion.div>
          }
        >
          <Box className="flex items-center">
            <Avatar 
              className="bg-green-100 text-green-600 mr-2"
              sx={{ width: 28, height: 28 }}
            >
              {activeAccount?.firstname?.charAt(0) || ''}
            </Avatar>
            <Typography 
              variant="body2" 
              className="font-medium text-gray-800 truncate"
              sx={{ maxWidth: input.large ? 120 : 80 }}
            >
              {activeAccount?.firstname} {activeAccount?.lastname?.charAt(0) || ''}
            </Typography>
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
              className="absolute left-0 mt-1 z-50 min-w-48"
            >
              <Paper 
                elevation={2} 
                className="border border-gray-100 rounded-md overflow-hidden"
              >
                {/* Account list */}
                <List className="py-0">
                  {inactiveAccounts.map(account => (
                    <ListItemButton 
                      key={account.id} 
                      onClick={() => selectInactiveAccount(account.id)}
                      className="py-1.5 px-3 hover:bg-gray-50"
                    >
                      <ListItemAvatar className="min-w-0 mr-2">
                        <Avatar 
                          className="bg-blue-100 text-blue-600"
                          sx={{ width: 28, height: 28 }}
                        >
                          {account.firstname?.charAt(0) || ''}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={
                          <Typography variant="body2" className="font-medium text-gray-800">
                            {account.firstname} {account.lastname?.charAt(0) || ''}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  ))}
                </List>

                {/* Add new account button */}
                {allowAccountCreation && (
                  <>
                    <Divider />
                    <ListItemButton
                      onClick={() => setShowAccountCreation(true)}
                      className="py-2 px-3 text-green-600 hover:bg-green-50"
                    >
                      <ListItemAvatar className="min-w-0 mr-2">
                        <Avatar className="bg-green-100 text-green-600" sx={{ width: 28, height: 28 }}>
                          <PersonAdd fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" className="font-medium text-green-600">
                            Add new account
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
            onCreate={(firstname, lastname) => {
              setShowAccountCreation(false);
              setIsOpen(false);
              createAndActivateNewAccount(firstname, lastname);
            }}
          />
        )}
      </Box>
    </ClickAwayListener>
  );
}
