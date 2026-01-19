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

import React, { useEffect, useState } from 'react';
import {
    Button,
    InputAdornment,
    TextField
} from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getUserKeyPair } from '@/entrypoints/main/wallet.tsx';
import {
    Language,
    Save,
    Settings as SettingsIcon,
    Info, VisibilityOff, Visibility
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";
import {CryptoEncoderFactory, EncoderFactory, SeedEncoder, WalletCrypto} from "@cmts-dev/carmentis-sdk/client";
import {activeAccountState, walletState} from "@/states/globals.tsx";
import {useToast} from "@/hooks/useToast.tsx";
import {Wallet} from "@/types/Wallet.ts";
import {AccountEdition} from "@/entrypoints/main/parameters/components/AccountEdition.tsx";
import {Versions} from "@/entrypoints/main/parameters/components/Versions.tsx";
import {useAsync} from "react-use";

// Define schemas for form validation
const personalInfoSchema = v.object({
  pseudo: v.pipe(v.string(), v.minLength(1, "Account name is required")),
  nonce: v.optional(v.pipe(v.number(), v.integer()))
});

const networkSchema = v.object({
    nodeEndpoint: v.pipe(v.string(), v.url("Must be a valid URL")),
    explorerEndpoint: v.pipe(v.string(), v.url("Must be a valid URL"))
});

// Schema for account information form
const accountInfoSchema = v.record(
  v.string(),
  v.object({
    pseudo: v.pipe(v.string(), v.minLength(1, "Account name is required")),
    nonce: v.optional(v.pipe(v.number(), v.integer()))
  })
);

const deleteAccountSchema = v.pipe(
  v.object({
    confirmName: v.string()
  }),
  v.forward(
    v.partialCheck(
      [["confirmName"]],
      (input) => input.confirmName === "",
      "Name doesn't match"
    ),
    ["confirmName"]
  )
);

type PersonalInfoFormData = v.InferOutput<typeof personalInfoSchema>;
type NetworkFormData = v.InferOutput<typeof networkSchema>;
type AccountInfoFormData = v.InferOutput<typeof accountInfoSchema>;

// Tab panel component
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// Main component
export default function Parameters() {
    const toast = useToast();
    const [wallet, setWallet] = useRecoilState(walletState);
    const activeAccount = useRecoilValue(activeAccountState);
    const [tabValue, setTabValue] = useState(0);
    const [userKeys, setUserKeys] = useState<{ privateKey: string, publicKey: string }>({ privateKey: '', publicKey: '' });
    const [accountTaggedPublicKeys, setAccountTaggedPublicKeys] = useState<Record<string, string>>({});
    const [accountPublicKeys, setAccountPublicKeys] = useState<Record<string, string>>({});
    const [accountPrivateKeys, setAccountPrivateKeys] = useState<Record<string, string>>({});
    const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<Record<string, boolean>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [encodedWalletSeed, setEncodedWalletSeed] = useState<string>('');
    const [showWalletSeed, setShowWalletSeed] = useState<boolean>(false);

    // Forms
    const personalInfoForm = useForm<PersonalInfoFormData>({
        resolver: valibotResolver(personalInfoSchema),
        defaultValues: {
            pseudo: activeAccount?.pseudo || '',
            nonce: activeAccount?.nonce
        }
    });

    const networkForm = useForm<NetworkFormData>({
        resolver: valibotResolver(networkSchema),
        defaultValues: {
            nodeEndpoint: wallet?.nodeEndpoint || '',
            explorerEndpoint: wallet?.explorerEndpoint || ''
        }
    });

    // Create initial values for account info form
    const initialAccountInfoValues = wallet?.accounts.reduce((acc, account) => {
        acc[account.id] = {
            pseudo: account.pseudo || '',
            nonce: account.nonce
        };
        return acc;
    }, {} as Record<string, { pseudo: string, nonce?: number }>);

    const accountInfoForm = useForm<AccountInfoFormData>({
        resolver: valibotResolver(accountInfoSchema),
        defaultValues: initialAccountInfoValues || {}
    });

    const { control: personalControl, handleSubmit: handlePersonalSubmit, formState: { errors: personalErrors, isDirty: isPersonalDirty } } = personalInfoForm;
    const { control: networkControl, handleSubmit: handleNetworkSubmit, formState: { errors: networkErrors, isDirty: isNetworkDirty } } = networkForm;
    const { control: accountInfoControl, handleSubmit: handleAccountInfoSubmit, formState: { errors: accountInfoErrors, isDirty: isAccountInfoDirty } } = accountInfoForm;

    // Load wallet seed
    useAsync(async () => {
        if (!wallet) return;
        try {
            const hexEncoder = EncoderFactory.bytesToHexEncoder();
            const seed = hexEncoder.decode(wallet.seed);
            const encodedSeed = new SeedEncoder().encode(seed);
            setEncodedWalletSeed(encodedSeed);
        } catch (error) {
            console.error('Failed to encode wallet seed:', error);
        }
    }, [wallet])

    // Load user keys
    useAsync(async () => {
        if (!wallet || !activeAccount) return;
        const encoder = CryptoEncoderFactory.defaultStringSignatureEncoder();
        const keyPair = await getUserKeyPair(wallet, activeAccount);
        setUserKeys({
            privateKey: await encoder.encodePrivateKey(keyPair.privateKey),
            publicKey: await encoder.encodePublicKey(keyPair.publicKey),
        });
    }, [wallet, activeAccount])

    // Load public and private keys for all accounts
    useEffect(() => {
        if (!wallet) return;

        const loadKeys = async () => {
            const publicKeys: Record<string, string> = {};
            const taggedPublicKeys: Record<string, string> = {};
            const privateKeys: Record<string, string> = {};
            const visibilityState: Record<string, boolean> = {};

            for (const account of wallet.accounts) {
                try {
                    const encoder = CryptoEncoderFactory.defaultStringSignatureEncoder();
                    const keyPair = await getUserKeyPair(wallet, account);
                    taggedPublicKeys[account.id] = await encoder.encodePublicKey(keyPair.publicKey);
                    publicKeys[account.id] = await encoder.encodePublicKey(keyPair.publicKey);
                    privateKeys[account.id] = await encoder.encodePrivateKey(keyPair.privateKey);
                    visibilityState[account.id] = false; // Default to hidden
                } catch (error) {
                    console.error(`Failed to load keys for account ${account.id}:`, error);
                }
            }

            setAccountTaggedPublicKeys(taggedPublicKeys);
            setAccountPublicKeys(publicKeys);
            setAccountPrivateKeys(privateKeys);
            setVisiblePrivateKeys(prev => ({...prev, ...visibilityState}));
        };

        loadKeys();
    }, [wallet, tabValue]);

    // Handle tab change
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Save network settings
    const onSaveNetworkSettings = (data: NetworkFormData) => {
        try {
            setWallet(wallet => {
                if (!wallet) return undefined;

                return {
                    ...wallet,
                    nodeEndpoint: data.nodeEndpoint,
                    explorerEndpoint: data.explorerEndpoint
                } as Wallet;
            });

            setSuccessMessage("Network settings updated successfully");
            networkForm.reset(data);
        } catch (error) {
            toast.error("Failed to update network settings");
            console.error(error);
        }
    };

    // Save account information for all accounts
    const onSaveAccountInfo = (data: AccountInfoFormData) => {
        try {
            setWallet(wallet => {
                if (!wallet) return undefined;

                const accounts = wallet.accounts.map(account => {
                    const accountInfo = data[account.id];
                    if (!accountInfo) return account;

                    return {
                        ...account,
                        pseudo: accountInfo.pseudo,
                        nonce: accountInfo.nonce !== undefined ? accountInfo.nonce : account.nonce
                    };
                });

                return {
                    ...wallet,
                    accounts
                } as Wallet;
            });

            setSuccessMessage("Account information updated successfully");
            accountInfoForm.reset(data);
        } catch (error) {
            toast.error("Failed to update account information");
            console.error(error);
        }
    };


    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    Settings
                </h1>
                <p className="text-sm text-gray-500">
                    Manage your account information, security settings, and network configuration
                </p>
            </div>

            {/* Main content */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex">
                        <button
                            type="button"
                            onClick={() => setTabValue(0)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                tabValue === 0
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Info fontSize="small" />
                            Accounts
                        </button>
                        <button
                            type="button"
                            onClick={() => setTabValue(1)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                tabValue === 1
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Language fontSize="small" />
                            Network
                        </button>
                        <button
                            type="button"
                            onClick={() => setTabValue(2)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                tabValue === 2
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <SettingsIcon fontSize="small" />
                            Versions
                        </button>
                    </div>
                </div>

                {/* Tab panels */}
                <div className="p-6">
                    {/* Information Tab */}
                    {tabValue === 0 && (
                        <form onSubmit={handleAccountInfoSubmit(onSaveAccountInfo)} className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                    Account Information
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Quickly modify information for all your accounts in one place
                                </p>
                            </div>

                            {/* Wallet Seed Display */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Wallet Master Seed
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowWalletSeed(!showWalletSeed)}
                                        className="text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        {showWalletSeed ? (
                                            <VisibilityOff fontSize="small" />
                                        ) : (
                                            <Visibility fontSize="small" />
                                        )}
                                    </button>
                                </div>
                                <TextField
                                    value={showWalletSeed ? encodedWalletSeed : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    InputProps={{
                                        readOnly: true,
                                        sx: {
                                            fontFamily: 'monospace',
                                            fontSize: '0.875rem',
                                            backgroundColor: showWalletSeed ? '#fff' : '#fef3c7',
                                        }
                                    }}
                                    helperText="This is your master seed from which all account private keys are derived. Keep it safe and never share it."
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '0.5rem',
                                            '& fieldset': { borderColor: '#fbbf24' },
                                        },
                                    }}
                                />
                            </div>

                            {wallet?.accounts.map((account, index) => (
                                <AccountEdition key={account.id} account={account} index={index}/>
                            ))}
                        </form>
                    )}

                    {/* Network Tab */}
                    {tabValue === 1 && (
                        <form onSubmit={handleNetworkSubmit(onSaveNetworkSettings)} className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                    Network Configuration
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Configure the network endpoints for connecting to the Carmentis blockchain and explorer.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Controller
                                    name="nodeEndpoint"
                                    control={networkControl}
                                    render={({ field }) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Carmentis Node Endpoint
                                            </label>
                                            <TextField
                                                {...field}
                                                variant="outlined"
                                                fullWidth
                                                error={!!networkErrors.nodeEndpoint}
                                                helperText={networkErrors.nodeEndpoint?.message || "The endpoint of the Carmentis node server"}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Language fontSize="small" className="text-gray-400" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '0.5rem',
                                                        '& fieldset': { borderColor: '#e5e7eb' },
                                                        '&:hover fieldset': { borderColor: '#d1d5db' },
                                                        '&.Mui-focused fieldset': { borderColor: '#93c5fd', borderWidth: '1px' },
                                                    },
                                                }}
                                            />
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="explorerEndpoint"
                                    control={networkControl}
                                    render={({ field }) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Carmentis Explorer Endpoint
                                            </label>
                                            <TextField
                                                {...field}
                                                variant="outlined"
                                                fullWidth
                                                error={!!networkErrors.explorerEndpoint}
                                                helperText={networkErrors.explorerEndpoint?.message || "The endpoint of the blockchain explorer"}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Language fontSize="small" className="text-gray-400" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '0.5rem',
                                                        '& fieldset': { borderColor: '#e5e7eb' },
                                                        '&:hover fieldset': { borderColor: '#d1d5db' },
                                                        '&.Mui-focused fieldset': { borderColor: '#93c5fd', borderWidth: '1px' },
                                                    },
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={!isNetworkDirty}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: '0.875rem',
                                        padding: '0.625rem 1rem',
                                        borderRadius: '0.5rem',
                                        boxShadow: 'none',
                                        '&:hover': { boxShadow: 'none' }
                                    }}
                                >
                                    <Save fontSize="small" className="mr-2" />
                                    Save Network Settings
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Versions Tab */}
                    {tabValue === 2 && <Versions/>}
                </div>
            </div>

            {/* Success message snackbar */}
            {successMessage && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
                    {successMessage}
                </div>
            )}
        </div>
    );
}
