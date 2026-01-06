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

import {
    Button,
    InputAdornment,
    TextField
} from '@mui/material';
import {useRecoilState, useRecoilValue} from 'recoil';
import {getUserKeyPair} from '@/entrypoints/main/wallet.tsx';
import {Controller, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import * as v from "valibot";
import {AccountBalance, Key, Send} from "@mui/icons-material";
import React, {useEffect} from "react";
import {useTokenTransfer} from "@/hooks/useTokenTransfer.tsx";
import {activeAccountState, walletState} from "@/states/globals.tsx";
import {useToast} from "@/hooks/useToast.tsx";
import {tokenTransferState} from "@/entrypoints/main/transfer/states.ts";
import {useAsyncFn} from "react-use";

// Define the form schema with Valibot
const transferSchema = v.object({
    publicKey: v.pipe(v.string(), v.minLength(1, "Public key is required")),
    amount: v.pipe(
        v.number(),
        v.minValue(1, "Amount must be at least 1"),
        v.integer("Amount must be a whole number")
    )
});

type TransferFormData = v.InferOutput<typeof transferSchema>;

export default function TokenTransferPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    Transfer Tokens
                </h1>
                <p className="text-sm text-gray-500">
                    Send tokens to another account on the Carmentis network. Enter the recipient's public key and the amount you want to transfer.
                </p>
            </div>

            {/* Form */}
            <TransferForm />
        </div>
    );
}

function TransferForm() {
    const wallet = useRecoilValue(walletState);
    const activeAccount = useRecoilValue(activeAccountState);
    const toast = useToast();
    const [tokenTransfer, setTokenTransfer] = useRecoilState(tokenTransferState);
    const [ transferringState, transferTokensToPublicKey ] = useTokenTransfer();
    const isTransferring = transferringState.loading;

    // Form submission handler
    const [submissionState, onSubmit] = useAsyncFn(async (data: TransferFormData) => {
        if (!wallet || !activeAccount) return false;

        const userKeyPair = await getUserKeyPair(wallet, activeAccount);
        await transferTokensToPublicKey(
            userKeyPair.privateKey,
            userKeyPair.publicKey,
            data.publicKey,
            data.amount
        );
        return true;
    });

    useEffect(() => {
        if (submissionState.value) {
            toast.success("Tokens successfully transferred");
            setValue("amount", 0);
        }

    }, [submissionState.value]);

    useEffect(() => {
        if (transferringState.error) {
            console.error(transferringState.error);
            toast.error(`An error occurred while processing your transfer: ${transferringState.error.message}`);
        }
    }, [transferringState.error]);



    // Form handling with react-hook-form
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        setValue
    } = useForm<TransferFormData>({
        resolver: valibotResolver(transferSchema),
        mode: "onChange",
        defaultValues: {
            publicKey: tokenTransfer.publicKey,
            amount: tokenTransfer.tokenAmount || undefined
        }
    });



    // Watch form values to update the transfer graphic
    const publicKey = watch("publicKey");
    const amount = watch("amount");

    // Update Recoil state when form values change
    React.useEffect(() => {
        setTokenTransfer({
            publicKey: publicKey || '',
            tokenAmount: amount || 0
        });
    }, [publicKey, amount, setTokenTransfer]);



    function cropPublicKey(publicKey: string) {
        if (publicKey.length < 10) return publicKey
        return publicKey.slice(0, 5) + '...' + publicKey.slice(publicKey.length - 4, publicKey.length);
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            {/* Form Header */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Send Tokens</h2>
                <p className="text-xs text-gray-500">
                    All transfers are securely processed on the blockchain. Once confirmed, transactions cannot be reversed.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Controller
                    name="publicKey"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <label htmlFor="publicKey" className="block text-sm font-medium text-gray-700 mb-2">
                                Recipient Public Key
                            </label>
                            <TextField
                                {...field}
                                id="publicKey"
                                variant="outlined"
                                fullWidth
                                error={!!errors.publicKey}
                                helperText={errors.publicKey?.message}
                                placeholder="034FCF72080D340A1ED9D10F797A14E6390D3034013D9E1D38D27BF1887BC95EA5"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Key fontSize="small" className="text-gray-400" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '0.5rem',
                                        '& fieldset': {
                                            borderColor: '#e5e7eb',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#d1d5db',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#93c5fd',
                                            borderWidth: '1px',
                                        },
                                    },
                                    '& .MuiFormHelperText-root': {
                                        marginLeft: '0',
                                    }
                                }}
                            />
                            {!errors.publicKey && (
                                <div className="text-xs text-gray-500 mt-1.5">
                                    Enter the full public key of the recipient
                                </div>
                            )}
                        </div>
                    )}
                />

                <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                                Amount to Transfer
                            </label>
                            <TextField
                                {...field}
                                id="amount"
                                variant="outlined"
                                fullWidth
                                type="number"
                                error={!!errors.amount}
                                helperText={errors.amount?.message}
                                placeholder="0"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountBalance fontSize="small" className="text-gray-400" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                                CMTS
                                            </span>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '0.5rem',
                                        '& fieldset': {
                                            borderColor: '#e5e7eb',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#d1d5db',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#93c5fd',
                                            borderWidth: '1px',
                                        },
                                    },
                                    '& .MuiFormHelperText-root': {
                                        marginLeft: '0',
                                    }
                                }}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value === '' ? undefined : Number(value));
                                }}
                            />
                            {!errors.amount && (
                                <div className="text-xs text-gray-500 mt-1.5">
                                    Enter the amount of CMTS tokens to send
                                </div>
                            )}
                        </div>
                    )}
                />

                {amount > 0 && publicKey && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <Send className="text-blue-600 flex-shrink-0 mt-0.5" fontSize="small" />
                            <div className="text-sm text-gray-700">
                                You are about to send <strong className="text-blue-700">{amount} CMTS</strong> to{' '}
                                <strong className="text-blue-700">{cropPublicKey(publicKey)}</strong>
                            </div>
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={!isValid || isTransferring}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        padding: '0.625rem 1rem',
                        borderRadius: '0.5rem',
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: 'none',
                        }
                    }}
                >
                    {isTransferring ? (
                        <div className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing Transfer...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Send fontSize="small" />
                            Transfer Tokens
                        </div>
                    )}
                </Button>
            </form>
        </div>
    );
}

