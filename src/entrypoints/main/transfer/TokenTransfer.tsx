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
    Alert,
    Avatar,
    Box,
    Button,
    CardContent,
    Chip,
    Grid,
    InputAdornment,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import {useRecoilState, useRecoilValue} from 'recoil';
import {getUserKeyPair} from '@/entrypoints/main/wallet.tsx';
import {motion} from "framer-motion";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {AccountBalance, CheckCircle, Key, Send, SwapHoriz} from "@mui/icons-material";
import React, {useState} from "react";
import {useTokenTransfer} from "@/hooks/useTokenTransfer.tsx";
import {activeAccountState, walletState} from "@/states/globals.tsx";
import {useToast} from "@/hooks/useToast.tsx";
import {TransferGraphic} from "@/entrypoints/main/transfer/TransferGraphic.tsx";
import {tokenTransferState} from "@/entrypoints/main/transfer/states.ts";

// Define the form schema with Zod
const transferSchema = z.object({
    publicKey: z.string()
        .min(1, "Public key is required"),
    amount: z.number()
        .min(1, "Amount must be at least 1")
        .int("Amount must be a whole number")
});

type TransferFormData = z.infer<typeof transferSchema>;

export default function TokenTransferPage() {
    // Animation variants
    const pageVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={pageVariants}
            className="max-w-5xl mx-auto"
        >
            <Box className="mb-8">
                <Typography variant="h4" className="font-bold text-gray-800 mb-3">
                    Transfer Tokens
                </Typography>
                <Typography variant="body1" className="text-gray-600 max-w-2xl">
                    Send tokens to another account on the Carmentis network. Enter the recipient's public key and the amount you want to transfer.
                </Typography>
            </Box>

            <Box className="bg-linear-to-r from-blue-50 to-blue-100/30 rounded-xl border border-blue-100 p-6 mb-8 shadow-sm">
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Typography variant="h6" className="font-semibold text-gray-800 mb-2">
                            Secure Token Transfers
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                            All transfers are securely processed on the Carmentis blockchain. Once confirmed, transactions cannot be reversed.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} className="flex justify-center md:justify-end">
                        <Avatar className="bg-blue-100 text-blue-600 border border-blue-200 shadow-sm" sx={{ width: 56, height: 56 }}>
                            <SwapHoriz sx={{ fontSize: 32 }} />
                        </Avatar>
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <TransferForm />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TransferGraphic />
                </Grid>
            </Grid>
        </motion.div>
    );
}

function TransferForm() {
    const wallet = useRecoilValue(walletState);
    const activeAccount = useRecoilValue(activeAccountState);
    const toast = useToast();
    const [tokenTransfer, setTokenTransfer] = useRecoilState(tokenTransferState);
    const [isTransferring, setIsTransferring] = useState(false);
    const transferTokensToPublicKey = useTokenTransfer();

    // Form handling with react-hook-form
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        setValue
    } = useForm<TransferFormData>({
        resolver: zodResolver(transferSchema),
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

    // Form submission handler
    const onSubmit = async (data: TransferFormData) => {
        if (!wallet || !activeAccount) return;

        setIsTransferring(true);

        try {
            // key pair for the organisation
            const userKeyPair = await getUserKeyPair(wallet, activeAccount);
            await transferTokensToPublicKey(
                wallet.nodeEndpoint,
                userKeyPair.privateKey,
                userKeyPair.publicKey,
                data.publicKey,
                data.amount
            );

            // Reset form after successful transfer
            toast.success("Tokens successfully transferred");
            setValue("amount", 0);
        } catch (e) {
            toast.error(`An error occurred: ${e}`);
        } finally {
            setIsTransferring(false);
        }
    };

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    function cropPublicKey(publicKey: string) {
        if (publicKey.length < 10) return publicKey
        return publicKey.slice(0, 5) + '...' + publicKey.slice(publicKey.length - 4, publicKey.length);
    }


    return (
        <motion.div variants={cardVariants}>
            <Paper elevation={0} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <Box className="p-5  border-gray-100 flex items-center">
                    <Avatar className="bg-white text-blue-600 mr-3 border border-blue-100 shadow-sm">
                        <SwapHoriz />
                    </Avatar>
                    <Typography variant="h6" className="font-semibold text-gray-800">
                        Send Tokens
                    </Typography>
                </Box>

                <CardContent className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Controller
                            name="publicKey"
                            control={control}
                            render={({ field }) => (
                                <div className="space-y-1">
                                    <label htmlFor="publicKey" className="block text-sm font-medium text-gray-700 mb-1">
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
                                                    <Key fontSize="small" className="text-blue-500" />
                                                </InputAdornment>
                                            ),
                                            className: "rounded-lg bg-white shadow-sm border-gray-200 focus-within:border-blue-300 focus-within:ring focus-within:ring-blue-100 transition-all",
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'rgb(147, 197, 253)',
                                                    borderWidth: '1px',
                                                },
                                            },
                                            '& .MuiFormHelperText-root': {
                                                marginLeft: '0',
                                            }
                                        }}
                                    />
                                    {!errors.publicKey && (
                                        <Typography variant="caption" className="text-gray-500 flex items-center mt-1">
                                            <CheckCircle className="h-3 w-3 mr-1 text-gray-400" />
                                            Enter the full public key of the recipient
                                        </Typography>
                                    )}
                                </div>
                            )}
                        />

                        <Controller
                            name="amount"
                            control={control}
                            render={({ field }) => (
                                <div className="space-y-1">
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
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
                                                    <AccountBalance fontSize="small" className="text-blue-500" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Chip
                                                        label="CMTS"
                                                        size="small"
                                                        className="bg-blue-50 text-blue-600 border border-blue-100 font-medium"
                                                    />
                                                </InputAdornment>
                                            ),
                                            className: "rounded-lg bg-white shadow-sm border-gray-200 focus-within:border-blue-300 focus-within:ring focus-within:ring-blue-100 transition-all",
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'rgb(147, 197, 253)',
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
                                        <Typography variant="caption" className="text-gray-500 flex items-center mt-1">
                                            <CheckCircle className="h-3 w-3 mr-1 text-gray-400" />
                                            Enter the amount of CMTS tokens to send
                                        </Typography>
                                    )}
                                </div>
                            )}
                        />

                        {amount > 0 && publicKey && (
                            <Alert
                                severity="info"
                                className="mb-4 rounded-lg border border-blue-100 bg-blue-50/70 shadow-sm"
                                icon={<Send className="text-blue-500" />}
                            >
                                <Typography variant="body2">
                                    You are about to send <strong className="text-blue-700">{amount} CMTS</strong> to{' '}
                                    <strong className="text-blue-700">{cropPublicKey(publicKey)}</strong>
                                </Typography>
                            </Alert>
                        )}

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="pt-2"
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={!isValid || isTransferring}
                                className="bg-blue-500 hover:bg-blue-600 py-3 rounded-lg shadow-md disabled:bg-gray-300 transition-all duration-200"
                                startIcon={<Send />}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: '0.95rem',
                                }}
                            >
                                {isTransferring ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing Transfer...
                                    </>
                                ) : (
                                    "Transfer Tokens"
                                )}
                            </Button>
                        </motion.div>
                    </form>
                </CardContent>
            </Paper>
        </motion.div>
    );
}

