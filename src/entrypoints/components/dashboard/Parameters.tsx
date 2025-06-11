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
import { Encoders } from '@/entrypoints/main/Encoders.tsx';
import { activeAccountState, walletState } from '@/entrypoints/contexts/authentication.context.tsx';
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
import { getUserKeyPair, Wallet } from '@/entrypoints/main/wallet.tsx';
import { useToast } from "@/entrypoints/components/AuthenticationManager.tsx";
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
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [userKeys, setUserKeys] = useState<{ privateKey: string, publicKey: string }>({ privateKey: '', publicKey: '' });
    const [accountPublicKeys, setAccountPublicKeys] = useState<Record<string, string>>({});
    const [copiedPublicKey, setCopiedPublicKey] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
                    privateKey: Encoders.ToHexa(keyPair.privateKey),
                    publicKey: Encoders.ToHexa(keyPair.publicKey)
                });
            });
    }, [wallet, activeAccount]);

    // Load public keys for all accounts
    useEffect(() => {
        if (!wallet) return;

        const loadPublicKeys = async () => {
            const keys: Record<string, string> = {};

            for (const account of wallet.accounts) {
                try {
                    const keyPair = await getUserKeyPair(wallet, account);
                    keys[account.id] = Encoders.ToHexa(keyPair.publicKey);
                } catch (error) {
                    console.error(`Failed to load public key for account ${account.id}:`, error);
                }
            }

            setAccountPublicKeys(keys);
        };

        loadPublicKeys();
    }, [wallet, tabValue]);

    // Handle tab change
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Save personal information
    const onSavePersonalInfo = (data: PersonalInfoFormData) => {
        try {
            setWallet(wallet => {
                if (!wallet) return undefined;

                const accounts = wallet.accounts.map(a => {
                    if (a.id !== wallet.activeAccountId) return a;
                    return {
                        ...a,
                        pseudo: data.pseudo,
                        nonce: data.nonce
                    };
                });

                return {
                    ...wallet,
                    accounts
                } as Wallet;
            });

            setSuccessMessage("Personal information updated successfully");
            personalInfoForm.reset(data);
        } catch (error) {
            toast.error("Failed to update personal information");
            console.error(error);
        }
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

    // Copy public key to clipboard
    const handleCopyPublicKey = () => {
        navigator.clipboard.writeText(userKeys.publicKey);
        setCopiedPublicKey(true);
        setTimeout(() => setCopiedPublicKey(false), 2000);
    };

    // Share public key
    const handleSharePublicKey = () => {
        navigator.clipboard.writeText(userKeys.publicKey);
        setCopiedPublicKey(true);
        setTimeout(() => setCopiedPublicKey(false), 2000);
        toast.success("Public key copied to clipboard");
    };

    // Delete account
    const handleDeleteAccount = () => {
        const confirmName = document.getElementById('confirm-delete-name') as HTMLInputElement;

        if (!activeAccount || !confirmName) return;

        if (confirmName.value !== activeAccount.pseudo) {
            toast.error("Account name doesn't match. Please enter the exact account name to confirm deletion.");
            return;
        }

        setWallet(wallet => {
            if (!wallet) return undefined;

            const accounts = wallet.accounts.filter(a => a.id !== activeAccount.id);

            if (accounts.length === 0) {
                toast.error("Cannot delete the last account");
                return wallet;
            }

            setSuccessMessage("Account deleted successfully");
            setDeleteDialogOpen(false);
            return {...wallet, accounts, activeAccountId: accounts[0].id};
        });
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
                            Account Settings
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
                                icon={<Key />}
                                iconPosition="start"
                                label="Security & Keys"
                                {...a11yProps(2)}
                                className="font-medium"
                            />
                            <Tab
                                icon={<Language />}
                                iconPosition="start"
                                label="Network"
                                {...a11yProps(3)}
                                className="font-medium"
                            />
                            {wallet?.accounts.length > 1 && (
                                <Tab
                                    icon={<DeleteForever />}
                                    iconPosition="start"
                                    label="Account Management"
                                    {...a11yProps(4)}
                                    className="font-medium text-red-500"
                                />
                            )}
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
                                                <Box display="flex" alignItems="center" mb={3}>
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

                        {/* Security & Keys Tab */}
                        <TabPanel value={tabValue} index={1}>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                                        Authentication Keys
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" className="mb-4">
                                        These keys are used to authenticate your identity on the Carmentis network. Keep your private key secure and never share it with anyone.
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" className="font-medium text-gray-700 mb-2">
                                        Private Key
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type={showPrivateKey ? 'text' : 'password'}
                                        value={userKeys.privateKey}
                                        InputProps={{
                                            readOnly: true,
                                            className: "font-mono text-sm",
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip title={showPrivateKey ? "Hide private key" : "Show private key"}>
                                                        <IconButton
                                                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                                                            edge="end"
                                                        >
                                                            {showPrivateKey ? <VisibilityOff /> : <Visibility />}
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
                                        Never share your private key with anyone. It provides full access to your account.
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" className="font-medium text-gray-700 mb-2">
                                        Public Key
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        value={userKeys.publicKey}
                                        InputProps={{
                                            readOnly: true,
                                            className: "font-mono text-sm",
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip title="Copy to clipboard">
                                                        <IconButton
                                                            onClick={handleCopyPublicKey}
                                                            edge="end"
                                                            color={copiedPublicKey ? "success" : "default"}
                                                        >
                                                            <ContentCopy />
                                                        </IconButton>
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                            cursor: 'pointer'
                                        }}
                                        onClick={handleCopyPublicKey}
                                    />

                                    <Box mt={3}>
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="inline-block"
                                        >
                                            <Button
                                                variant="contained"
                                                onClick={handleSharePublicKey}
                                                startIcon={<EmailIcon />}
                                                className="bg-green-500 hover:bg-green-600 transition-colors duration-200"
                                            >
                                                Share public key via email
                                            </Button>
                                        </motion.div>
                                    </Box>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        {/* Network Tab */}
                        <TabPanel value={tabValue} index={2}>
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

                        {/* Account Management Tab */}
                        {wallet?.accounts.length > 1 && (
                            <TabPanel value={tabValue} index={3}>
                                <Grid container spacing={4}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                                            Account Management
                                        </Typography>
                                        <Alert
                                            severity="warning"
                                            className="mb-6"
                                            icon={<Warning />}
                                        >
                                            <Typography variant="body2">
                                                Danger Zone: Actions in this section can result in permanent data loss.
                                            </Typography>
                                        </Alert>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Paper className="p-6 border border-red-100 bg-red-50">
                                            <Typography variant="h6" className="text-red-700 font-semibold mb-2">
                                                Delete Account
                                            </Typography>
                                            <Typography variant="body2" className="text-red-600 mb-4">
                                                This action cannot be undone. This will permanently delete the account "{activeAccount?.pseudo}" and all associated data.
                                            </Typography>

                                            <AnimatePresence>
                                                {deleteDialogOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="mb-4"
                                                    >
                                                        <Alert severity="error" className="mb-4">
                                                            <Typography variant="body2">
                                                                To confirm deletion, please type <strong>{activeAccount?.pseudo}</strong> below.
                                                            </Typography>
                                                        </Alert>

                                                        <TextField
                                                            id="confirm-delete-name"
                                                            label="Confirm account name"
                                                            variant="outlined"
                                                            fullWidth
                                                            className="mb-4"
                                                            placeholder={`Type "${activeAccount?.pseudo}" to confirm`}
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <Box display="flex" justifyContent="flex-end">
                                                {!deleteDialogOpen ? (
                                                    <motion.div
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            startIcon={<DeleteForever />}
                                                            onClick={() => setDeleteDialogOpen(true)}
                                                        >
                                                            Delete Account
                                                        </Button>
                                                    </motion.div>
                                                ) : (
                                                    <Stack direction="row" spacing={2}>
                                                        <Button
                                                            variant="outlined"
                                                            onClick={() => setDeleteDialogOpen(false)}
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
                                                                onClick={handleDeleteAccount}
                                                            >
                                                                Confirm Deletion
                                                            </Button>
                                                        </motion.div>
                                                    </Stack>
                                                )}
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                        )}
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
