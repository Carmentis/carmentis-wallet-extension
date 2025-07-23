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
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Snackbar,
    Stack,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getUserKeyPair } from '@/entrypoints/main/wallet.tsx';
import Skeleton from "react-loading-skeleton";
import {
    AccountCircle,
    Badge,
    ContentCopy,
    DeleteForever,
    Email as EmailIcon,
    Key,
    Language,
    LockReset,
    Save,
    Settings as SettingsIcon,
    Visibility,
    VisibilityOff,
    Warning,
    Info
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {StringSignatureEncoder} from "@cmts-dev/carmentis-sdk/client";
import {activeAccountState, walletState} from "@/states/globals.tsx";
import {useToast} from "@/hooks/useToast.tsx";
import {Wallet} from "@/types/Wallet.ts";

// Define schemas for form validation
const personalInfoSchema = z.object({
  pseudo: z.string().min(1, "Account name is required"),
  nonce: z.number().int().optional()
});

const networkSchema = z.object({
    nodeEndpoint: z.string().url("Must be a valid URL"),
    explorerEndpoint: z.string().url("Must be a valid URL")
});

// Schema for account information form
const accountInfoSchema = z.record(z.string(), z.object({
    pseudo: z.string().min(1, "Account name is required"),
    nonce: z.number().int().optional()
}));

const deleteAccountSchema = z.object({
    confirmName: z.string()
}).refine((data) => data.confirmName === "", {
    message: "Name doesn't match",
    path: ["confirmName"]
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
type NetworkFormData = z.infer<typeof networkSchema>;
type AccountInfoFormData = z.infer<typeof accountInfoSchema>;

// Tab panel component
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`settings-tabpanel-${index}`}
            aria-labelledby={`settings-tab-${index}`}
            {...other}
            style={{ padding: '24px 0' }}
        >
            <AnimatePresence mode="wait">
                {value === index && (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `settings-tab-${index}`,
        'aria-controls': `settings-tabpanel-${index}`,
    };
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
    const [deleteAccountDialogs, setDeleteAccountDialogs] = useState<Record<string, boolean>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Forms
    const personalInfoForm = useForm<PersonalInfoFormData>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            pseudo: activeAccount?.pseudo || '',
            nonce: activeAccount?.nonce
        }
    });

    const networkForm = useForm<NetworkFormData>({
        resolver: zodResolver(networkSchema),
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
        resolver: zodResolver(accountInfoSchema),
        defaultValues: initialAccountInfoValues || {}
    });

    const { control: personalControl, handleSubmit: handlePersonalSubmit, formState: { errors: personalErrors, isDirty: isPersonalDirty } } = personalInfoForm;
    const { control: networkControl, handleSubmit: handleNetworkSubmit, formState: { errors: networkErrors, isDirty: isNetworkDirty } } = networkForm;
    const { control: accountInfoControl, handleSubmit: handleAccountInfoSubmit, formState: { errors: accountInfoErrors, isDirty: isAccountInfoDirty } } = accountInfoForm;

    // Load user keys
    useEffect(() => {
        if (!wallet || !activeAccount) return;

        getUserKeyPair(wallet, activeAccount)
            .then(keyPair => {
                setUserKeys({
                    privateKey: keyPair.privateKey.getPrivateKeyAsString(),
                    publicKey: keyPair.publicKey.getPublicKeyAsString(),
                });
            });
    }, [wallet, activeAccount]);

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
                    const encoder = StringSignatureEncoder.defaultStringSignatureEncoder();
                    const keyPair = await getUserKeyPair(wallet, account);
                    taggedPublicKeys[account.id] = encoder.encodePublicKey(keyPair.publicKey);
                    publicKeys[account.id] = keyPair.publicKey.getPublicKeyAsString();
                    privateKeys[account.id] = keyPair.privateKey.getPrivateKeyAsString();
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


    // Delete specific account (for Information tab)
    const handleDeleteSpecificAccount = (accountId: string, accountPseudo: string) => {
        // Get the confirmation input for this specific account
        const confirmInput = document.getElementById(`confirm-delete-${accountId}`) as HTMLInputElement;

        if (!confirmInput) return;

        if (confirmInput.value !== accountPseudo) {
            toast.error("Account name doesn't match. Please enter the exact account name to confirm deletion.");
            return;
        }

        setWallet(wallet => {
            if (!wallet) return undefined;

            const accounts = wallet.accounts.filter(a => a.id !== accountId);

            if (accounts.length === 0) {
                toast.error("Cannot delete the last account");
                return wallet;
            }

            // If deleting the active account, set the first account as active
            const newActiveId = wallet.activeAccountId === accountId ? accounts[0].id : wallet.activeAccountId;

            setSuccessMessage("Account deleted successfully");
            // Close this account's delete dialog
            setDeleteAccountDialogs(prev => ({...prev, [accountId]: false}));

            return {...wallet, accounts, activeAccountId: newActiveId};
        });
    };

    // Toggle private key visibility for a specific account
    const togglePrivateKeyVisibility = (accountId: string) => {
        setVisiblePrivateKeys(prev => ({
            ...prev,
            [accountId]: !prev[accountId]
        }));
    };

    // Page animations
    const pageVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { duration: 0.5 }
        },
        exit: { opacity: 0 }
    };

    // Header animations
    const headerVariants = {
        initial: { opacity: 0, y: -20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <Container maxWidth="lg">
            <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                {/* Header */}
                <motion.div variants={headerVariants} className="mb-8">
                    <Box display="flex" alignItems="center" mb={2}>
                        <SettingsIcon fontSize="large" className="text-gray-700 mr-3" />
                        <Typography variant="h4" component="h1" className="font-bold text-gray-800">
                            Settings
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                        Manage your account information, security settings, and network configuration
                    </Typography>
                </motion.div>

                {/* Main content */}
                <Paper elevation={0} className="border border-gray-100 rounded-lg overflow-hidden">
                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="settings tabs"
                            className="px-4"
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            {/*
                                  <Tab
                                icon={<AccountCircle />}
                                iconPosition="start"
                                label="Personal Info"
                                {...a11yProps(0)}
                                className="font-medium"
                            />
                            */}
                            <Tab
                                icon={<Info />}
                                iconPosition="start"
                                label="Accounts"
                                {...a11yProps(1)}
                                className="font-medium"
                            />
                            <Tab
                                icon={<Language />}
                                iconPosition="start"
                                label="Network"
                                {...a11yProps(2)}
                                className="font-medium"
                            />
                        </Tabs>
                    </Box>

                    {/* Tab panels */}
                    <Box className="p-6">

                        {/* Information Tab */}
                        <TabPanel value={tabValue} index={0}>
                            <form onSubmit={handleAccountInfoSubmit(onSaveAccountInfo)}>
                                <Grid container spacing={4}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                                            Account Information
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" className="mb-4">
                                            Quickly modify information for all your accounts in one place
                                        </Typography>
                                    </Grid>

                                    {wallet?.accounts.map((account, index) => (
                                        <Grid item xs={12} key={account.id}>
                                            <Paper elevation={0} className="p-6 border border-gray-100 rounded-lg mb-4">
                                                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                                                    <Box display="flex" alignItems="center">
                                                        <Avatar
                                                            className="bg-blue-100 text-blue-600 mr-4"
                                                            sx={{ width: 48, height: 48 }}
                                                        >
                                                            {account.pseudo?.charAt(0) || ''}
                                                        </Avatar>
                                                        <Typography variant="h6" className="font-semibold text-gray-800">
                                                            Account {index + 1}
                                                            {account.id === wallet.activeAccountId && (
                                                                <Chip 
                                                                    label="Active" 
                                                                    size="small" 
                                                                    className="ml-2 bg-green-100 text-green-600 font-medium"
                                                                />
                                                            )}
                                                        </Typography>
                                                    </Box>
                                                    {wallet?.accounts.length > 1 && (
                                                        <Tooltip title="Delete Account">
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => setDeleteAccountDialogs(prev => ({...prev, [account.id]: true}))}
                                                                size="small"
                                                                className="text-red-500 hover:bg-red-50"
                                                            >
                                                                <DeleteForever fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Box>

                                                {/* Confirmation Dialog */}
                                                <AnimatePresence>
                                                    {deleteAccountDialogs[account.id] && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="mb-4"
                                                        >
                                                            <Alert severity="error" className="mb-4">
                                                                <Typography variant="body2">
                                                                    To confirm deletion, please type <strong>{account.pseudo}</strong> below.
                                                                </Typography>
                                                            </Alert>

                                                            <TextField
                                                                id={`confirm-delete-${account.id}`}
                                                                label="Confirm account name"
                                                                variant="outlined"
                                                                fullWidth
                                                                className="mb-4"
                                                                placeholder={`Type "${account.pseudo}" to confirm`}
                                                            />

                                                            <Box display="flex" justifyContent="flex-end">
                                                                <Stack direction="row" spacing={2}>
                                                                    <Button
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onClick={() => setDeleteAccountDialogs(prev => ({...prev, [account.id]: false}))}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                    <motion.div
                                                                        whileHover={{ scale: 1.02 }}
                                                                        whileTap={{ scale: 0.98 }}
                                                                    >
                                                                        <Button
                                                                            variant="contained"
                                                                            color="error"
                                                                            startIcon={<DeleteForever />}
                                                                            onClick={() => handleDeleteSpecificAccount(account.id, account.pseudo)}
                                                                            size="small"
                                                                        >
                                                                            Confirm Deletion
                                                                        </Button>
                                                                    </motion.div>
                                                                </Stack>
                                                            </Box>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} md={6}>
                                                        <Controller
                                                            name={`${account.id}.pseudo`}
                                                            control={accountInfoControl}
                                                            render={({ field }) => (
                                                                <TextField
                                                                    {...field}
                                                                    label="Account Name"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    error={!!accountInfoErrors?.[account.id]?.pseudo}
                                                                    helperText={accountInfoErrors?.[account.id]?.pseudo?.message}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <Badge fontSize="small" />
                                                                            </InputAdornment>
                                                                        ),
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Controller
                                                            name={`${account.id}.nonce`}
                                                            control={accountInfoControl}
                                                            render={({ field }) => (
                                                                <TextField
                                                                    {...field}
                                                                    label="Account Nonce"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    type="number"
                                                                    error={!!accountInfoErrors?.[account.id]?.nonce}
                                                                    helperText={accountInfoErrors?.[account.id]?.nonce?.message || "Used to derive different keys"}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <LockReset fontSize="small" />
                                                                            </InputAdornment>
                                                                        ),
                                                                    }}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        field.onChange(value === '' ? undefined : Number(value));
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>

                                                    {accountPublicKeys[account.id] && (
                                                        <Grid item xs={12}>
                                                            <Typography variant="subtitle2" className="font-medium text-gray-700 mb-2">
                                                                Public Key
                                                            </Typography>
                                                            <TextField
                                                                fullWidth
                                                                variant="outlined"
                                                                value={accountPublicKeys[account.id]}
                                                                InputProps={{
                                                                    readOnly: true,
                                                                    className: "font-mono text-sm",
                                                                    endAdornment: (
                                                                        <InputAdornment position="end">
                                                                            <Tooltip title="Copy to clipboard">
                                                                                <IconButton
                                                                                    onClick={() => {
                                                                                        navigator.clipboard.writeText(accountPublicKeys[account.id]);
                                                                                        toast.success("Public key copied to clipboard");
                                                                                    }}
                                                                                    edge="end"
                                                                                >
                                                                                    <ContentCopy />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                                sx={{
                                                                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                                                                }}
                                                            />
                                                            <Typography variant="caption" color="text.secondary" className="mt-1 block">
                                                                This is the public key associated with this account and its current nonce.
                                                            </Typography>
                                                        </Grid>
                                                    )}

                                                    {accountTaggedPublicKeys[account.id] && (
                                                        <Grid item xs={12}>
                                                            <Typography variant="subtitle2" className="font-medium text-gray-700 mb-2">
                                                                Tagged Public Key
                                                            </Typography>
                                                            <TextField
                                                                fullWidth
                                                                variant="outlined"
                                                                value={accountTaggedPublicKeys[account.id]}
                                                                InputProps={{
                                                                    readOnly: true,
                                                                    className: "font-mono text-sm",
                                                                    endAdornment: (
                                                                        <InputAdornment position="end">
                                                                            <Tooltip title="Copy to clipboard">
                                                                                <IconButton
                                                                                    onClick={() => {
                                                                                        navigator.clipboard.writeText(accountTaggedPublicKeys[account.id]);
                                                                                        toast.success("Tagged Public key copied to clipboard");
                                                                                    }}
                                                                                    edge="end"
                                                                                >
                                                                                    <ContentCopy />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                                sx={{
                                                                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                                                                }}
                                                            />
                                                            <Typography variant="caption" color="text.secondary" className="mt-1 block">
                                                                This is the <strong>tagged</strong> public key associated with this account and its current nonce.
                                                                Providing this key with a system is useful to identity the used scheme.
                                                            </Typography>
                                                        </Grid>
                                                    )}

                                                    {/* Private Key Field */}
                                                    {accountPrivateKeys[account.id] && (
                                                        <Grid item xs={12} className="mt-4">
                                                            <Typography variant="subtitle2" className="font-medium text-gray-700 mb-2 flex items-center">
                                                                Private Key

                                                            </Typography>
                                                            <TextField
                                                                fullWidth
                                                                variant="outlined"
                                                                type={visiblePrivateKeys[account.id] ? 'text' : 'password'}
                                                                value={accountPrivateKeys[account.id]}
                                                                InputProps={{
                                                                    readOnly: true,
                                                                    className: "font-mono text-sm",
                                                                    endAdornment: (
                                                                        <InputAdornment position="end">
                                                                            <Tooltip title={visiblePrivateKeys[account.id] ? "Hide private key" : "Show private key"}>
                                                                                <IconButton
                                                                                    onClick={() => togglePrivateKeyVisibility(account.id)}
                                                                                    edge="end"
                                                                                >
                                                                                    {visiblePrivateKeys[account.id] ? <VisibilityOff /> : <Visibility />}
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                            <Tooltip title="Copy to clipboard">
                                                                                <IconButton
                                                                                    onClick={() => {
                                                                                        navigator.clipboard.writeText(accountPrivateKeys[account.id]);
                                                                                        toast.success("Private key copied to clipboard");
                                                                                    }}
                                                                                    edge="end"
                                                                                >
                                                                                    <ContentCopy />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                                sx={{
                                                                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                                                                }}
                                                            />
                                                            <Typography variant="caption" color="text.secondary" className="mt-1 block">
                                                                <strong>Warning:</strong> Never share your private key with anyone. It provides full access to your account.
                                                            </Typography>
                                                        </Grid>
                                                    )}

                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    ))}

                                    <Grid item xs={12}>
                                        <Box display="flex" justifyContent="flex-end">
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<Save />}
                                                    disabled={!isAccountInfoDirty}
                                                    className="bg-green-500 hover:bg-green-600 transition-colors duration-200"
                                                >
                                                    Save All Accounts
                                                </Button>
                                            </motion.div>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>
                        </TabPanel>

                        {/* Network Tab */}
                        <TabPanel value={tabValue} index={1}>
                            <form onSubmit={handleNetworkSubmit(onSaveNetworkSettings)}>
                                <Grid container spacing={4}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                                            Network Configuration
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" className="mb-4">
                                            Configure the network endpoints for connecting to the Carmentis blockchain and explorer.
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Controller
                                            name="nodeEndpoint"
                                            control={networkControl}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Carmentis Node Endpoint"
                                                    variant="outlined"
                                                    fullWidth
                                                    error={!!networkErrors.nodeEndpoint}
                                                    helperText={networkErrors.nodeEndpoint?.message || "The endpoint of the Carmentis node server"}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Language fontSize="small" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Controller
                                            name="explorerEndpoint"
                                            control={networkControl}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Carmentis Explorer Endpoint"
                                                    variant="outlined"
                                                    fullWidth
                                                    error={!!networkErrors.explorerEndpoint}
                                                    helperText={networkErrors.explorerEndpoint?.message || "The endpoint of the blockchain explorer"}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Language fontSize="small" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box display="flex" justifyContent="flex-end">
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<Save />}
                                                    disabled={!isNetworkDirty}
                                                    className="bg-green-500 hover:bg-green-600 transition-colors duration-200"
                                                >
                                                    Save Network Settings
                                                </Button>
                                            </motion.div>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>
                        </TabPanel>


                    </Box>
                </Paper>
            </motion.div>

            {/* Success message snackbar */}
            <Snackbar
                open={!!successMessage}
                autoHideDuration={4000}
                onClose={() => setSuccessMessage(null)}
                message={successMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                ContentProps={{
                    className: "bg-green-500"
                }}
            />
        </Container>
    );
}
