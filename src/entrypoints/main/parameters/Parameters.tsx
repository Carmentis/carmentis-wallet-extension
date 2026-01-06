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
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";
import {CryptoEncoderFactory} from "@cmts-dev/carmentis-sdk/client";
import {activeAccountState, walletState} from "@/states/globals.tsx";
import {useToast} from "@/hooks/useToast.tsx";
import {Wallet} from "@/types/Wallet.ts";
import {AccountEdition} from "@/entrypoints/main/parameters/components/AccountEdition.tsx";
import {Versions} from "@/entrypoints/main/parameters/components/Versions.tsx";

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
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

    // Load user keys
    useEffect(() => {
        if (!wallet || !activeAccount) return;
        const encoder = CryptoEncoderFactory.defaultStringSignatureEncoder();
        getUserKeyPair(wallet, activeAccount)
            .then(keyPair => {
                setUserKeys({
                    privateKey: encoder.encodePrivateKey(keyPair.privateKey),
                    publicKey: encoder.encodePublicKey(keyPair.publicKey),
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
                    const encoder = CryptoEncoderFactory.defaultStringSignatureEncoder();
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
                            <Tab
                                icon={<SettingsIcon />}
                                iconPosition="start"
                                label="Versions"
                                {...a11yProps(3)}
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
                                    <Grid size={12}>
                                        <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                                            Account Information
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" className="mb-4">
                                            Quickly modify information for all your accounts in one place
                                        </Typography>
                                    </Grid>

                                    {wallet?.accounts.map((account, index) => (
                                        <AccountEdition account={account} index={index}/>
                                    ))}
                                </Grid>
                            </form>
                        </TabPanel>

                        {/* Network Tab */}
                        <TabPanel value={tabValue} index={1}>
                            <form onSubmit={handleNetworkSubmit(onSaveNetworkSettings)}>
                                <Grid container spacing={4}>
                                    <Grid size={12}>
                                        <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                                            Network Configuration
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" className="mb-4">
                                            Configure the network endpoints for connecting to the Carmentis blockchain and explorer.
                                        </Typography>
                                    </Grid>

                                    <Grid size={12}>
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

                                    <Grid size={12}>
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

                                    <Grid size={12}>
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

                        {/* Versions Tab */}
                        <TabPanel value={tabValue} index={2}>
                            <Versions/>
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
