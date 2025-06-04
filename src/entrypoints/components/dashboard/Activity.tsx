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

import { useRecoilValue } from "recoil";
import { activeAccountState, walletState } from "@/entrypoints/contexts/authentication.context.tsx";
import React, { useEffect, useState } from "react";
import { AccountDataStorage } from "@/utils/db/account-data-storage.ts";
import { getUserKeyPair } from "@/entrypoints/main/wallet.tsx";
import * as sdk from "@cmts-dev/carmentis-sdk/client";
import { 
    Box, 
    Breadcrumbs, 
    Typography, 
    Paper, 
    Grid, 
    Avatar, 
    CircularProgress, 
    Chip,
    Tooltip,
    Alert,
    Button
} from "@mui/material";
import Skeleton from "react-loading-skeleton";

import { useNavigate } from "react-router";
import { DynamicTableComponent } from "@/entrypoints/components/async-row-table.tsx";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ArrowRight, 
    Storage, 
    Business, 
    Timeline, 
    Schedule, 
    Refresh, 
    Error as ErrorIcon,
    Info
} from "@mui/icons-material";

export default function ActivityPage() {
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

    const itemVariants = {
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

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={pageVariants}
            className="max-w-6xl mx-auto"
        >
            <motion.div variants={itemVariants}>
                <Box className="mb-6">
                    <Typography variant="h4" className="font-bold text-gray-800 mt-4 mb-2">
                        Blockchain Activity
                    </Typography>
                    <Typography variant="body1" className="text-gray-600">
                        View your virtual blockchains and transaction history on the Carmentis network
                    </Typography>
                </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
                <TableOfChains />
            </motion.div>
        </motion.div>
    );
}

function TableOfChains() {
    const offset = 0;
    const limit = 200;
    const wallet = useRecoilValue(walletState);
    const activeAccount = useRecoilValue(activeAccountState);
    const navigate = useNavigate();
    const [chains, setChains] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    if (!activeAccount) return <EmptyStateMessage message="No active account found" />;

    async function loadChains() {
        try {
            setIsLoading(true);
            setError(null);

            const db = await AccountDataStorage.connectDatabase(activeAccount!);
            const keyPair = await getUserKeyPair(wallet!, activeAccount!);
            const chains = await db.getAllApplicationVirtualBlockchainId(offset, limit);
            sdk.blockchain.blockchainCore.setUser(
                sdk.blockchain.ROLES.OPERATOR, 
                sdk.utils.encoding.toHexa(keyPair.privateKey)
            );

            setChains(chains.map(c => c.virtualBlockchainId));
        } catch (err) {
            console.error("Error loading chains:", err);
            setError("Failed to load blockchain data. Please try again.");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }

    useEffect(() => {
        loadChains();
    }, []);

    function navigateToVirtualBlockchainView(chainId: string) {
        navigate(`/activity/${chainId}`);
    }

    function handleRefresh() {
        setIsRefreshing(true);
        loadChains();
    }

    async function renderRow(chain: string, index: number) {
        try {
            const vb = new sdk.blockchain.appLedgerVb(chain);
            await vb.load();

            const applicationId = vb.state.applicationId;
            const applicationVb = new sdk.blockchain.applicationVb(applicationId);
            await applicationVb.load();

            const application = await applicationVb.getDescriptionObject();
            const organisation = await applicationVb.getOrganizationVb();
            const organisationDescription = await organisation.getDescriptionObject();
            const height = vb.getHeight() - 1;

            // Find the range of timeline for the virtual blockchain
            const microblocks = vb.microblocks;
            const timestamps: number[] = microblocks.map(m => m.object.header.timestamp);
            const min = timestamps.reduce((a, b) => Math.min(a, b), timestamps[0]);
            const max = timestamps.reduce((a, b) => Math.max(a, b), timestamps[0]);

            return [
                <Box className="flex items-center">
                    <Avatar className="bg-blue-100 text-blue-600 mr-2" sx={{ width: 28, height: 28 }}>
                        <Storage fontSize="small" />
                    </Avatar>
                    <Typography className="font-medium">{application.getName()}</Typography>
                </Box>,
                <Box className="flex items-center">
                    <Avatar className="bg-purple-100 text-purple-600 mr-2" sx={{ width: 28, height: 28 }}>
                        <Business fontSize="small" />
                    </Avatar>
                    <Typography>{organisationDescription.getName()}</Typography>
                </Box>,
                <Chip 
                    icon={<Timeline fontSize="small" />} 
                    label={height} 
                    className="bg-green-50 text-green-700"
                />,
                <Box className="flex items-center">
                    <Schedule fontSize="small" className="text-gray-500 mr-1" />
                    <Typography className="text-sm">
                        {new Date(min * 1000).toLocaleString()} 
                        <ArrowRight className="mx-1 text-blue-500" /> 
                        {new Date(max * 1000).toLocaleString()}
                    </Typography>
                </Box>
            ];
        } catch (error) {
            console.error(`Error rendering row for chain ${chain}:`, error);
            return [
                <Typography className="text-red-500">Error loading data</Typography>,
                <Typography className="text-red-500">-</Typography>,
                <Typography className="text-red-500">-</Typography>,
                <Typography className="text-red-500">-</Typography>
            ];
        }
    }

    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={handleRefresh} />;
    }

    if (chains.length === 0) {
        return <EmptyStateMessage message="No blockchain activity found" />;
    }

    return (
        <Paper elevation={0} className="border border-gray-100 rounded-lg overflow-hidden">
            <Box className="p-4 bg-blue-50 border-b border-gray-100 flex justify-between items-center">
                <Box className="flex items-center">
                    <Avatar className="bg-blue-100 text-blue-600 mr-3">
                        <Storage />
                    </Avatar>
                    <Typography variant="h6" className="font-semibold text-gray-800">
                        Virtual Blockchains
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={isRefreshing ? <CircularProgress size={20} /> : <Refresh />}
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="text-blue-600"
                >
                    {isRefreshing ? "Refreshing..." : "Refresh"}
                </Button>
            </Box>

            <Box className="p-4">
                <DynamicTableComponent
                    header={["Application", "Organisation", "Blockchain Height", "Time Range"]}
                    data={chains}
                    renderRow={renderRow}
                    onRowClicked={(hash) => navigateToVirtualBlockchainView(hash)}
                />
            </Box>
        </Paper>
    );
}

/**
 * Loading state component for the activity page
 */
function LoadingState() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
        >
            <CircularProgress size={60} thickness={4} className="mb-4" />
            <Typography variant="h6" className="font-medium text-gray-800 mb-2">
                Loading Blockchain Data
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Please wait while we fetch your blockchain activity...
            </Typography>
        </motion.div>
    );
}

/**
 * Error state component for the activity page
 */
function ErrorState({ message, onRetry }: { message: string, onRetry: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12"
        >
            <Paper elevation={0} className="border border-red-100 rounded-lg p-8 max-w-md mx-auto text-center">
                <Avatar className="mx-auto mb-4 bg-red-50 text-red-500 w-20 h-20">
                    <ErrorIcon fontSize="large" />
                </Avatar>

                <Typography variant="h5" className="font-bold text-gray-800 mb-2">
                    Something Went Wrong
                </Typography>

                <Typography variant="body1" className="text-gray-600 mb-6">
                    {message}
                </Typography>

                <Button 
                    variant="outlined" 
                    color="error"
                    startIcon={<Refresh />}
                    onClick={onRetry}
                >
                    Try Again
                </Button>
            </Paper>
        </motion.div>
    );
}

/**
 * Empty state message component for the activity page
 */
function EmptyStateMessage({ message }: { message: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
        >
            <Avatar className="mx-auto mb-4 bg-blue-50 text-blue-500 w-20 h-20">
                <Info fontSize="large" />
            </Avatar>

            <Typography variant="h5" className="font-bold text-gray-800 mb-2">
                No Activity Found
            </Typography>

            <Typography variant="body1" className="text-gray-600 max-w-md">
                {message}
            </Typography>

            <Alert severity="info" className="mt-6 max-w-md">
                Activity will appear here once you interact with applications on the Carmentis network.
            </Alert>
        </motion.div>
    );
}
