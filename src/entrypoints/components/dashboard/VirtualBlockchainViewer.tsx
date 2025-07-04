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
    Box, 
    Breadcrumbs, 
    Button, 
    Card, 
    CardContent, 
    Chip, 
    Divider, 
    Link, 
    Typography, 
    Paper,
    Avatar,
    CircularProgress,
    Grid,
    Tooltip
} from "@mui/material";
import React, {useEffect, useState, useTransition} from "react";
import {
    ApplicationLedgerVb,
    Blockchain,
    EncoderFactory,
    Explorer,
    Hash,
    ProviderFactory
} from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import {useParams} from "react-router";
import {Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator} from "@mui/lab";
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import {getUserKeyPair} from "@/entrypoints/main/wallet.tsx";
import {useRecoilValue} from "recoil";
import {activeAccountState, useWallet, walletState} from "@/entrypoints/contexts/authentication.context.tsx";
import {useAsync, useAsyncFn} from "react-use";
import { motion, AnimatePresence } from "framer-motion";
import {
    Storage,
    FileDownload,
    OpenInNew,
    DataObject,
    Block,
    Error as ErrorIcon,
    Dns
} from "@mui/icons-material";
import {BlockViewer} from "@/entrypoints/components/dashboard/BlockViewer.tsx";

export default function VirtualBlockchainViewer() {
    const params = useParams<{hash: string}>();
    const hash = params.hash;
    const wallet = useWallet();
    const activeAccount = useRecoilValue(activeAccountState);
    const {loading: keyPairLoading, value: keyPair} = useAsync(async () => {
        return getUserKeyPair(wallet, activeAccount!)
    })
    const [state, startTransition] = useAsyncFn(async () => {
        if (keyPairLoading || !keyPair) return
        const provider = ProviderFactory.createKeyedProviderExternalProvider(keyPair.privateKey, wallet.nodeEndpoint);
        const blockchain = Blockchain.createFromProvider(provider);
        const vb = await blockchain.loadApplicationLedger(Hash.from(hash as string));
        const proof = await vb.exportProof({ author: activeAccount?.pseudo as string })

        const json = JSON.stringify(proof, null, 2);
        const blob = new Blob([json], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `proof-${hash}.json`;
        link.click();
        URL.revokeObjectURL(url); // Clean up the URL after downloading
    }, [keyPair]);

    async function exportProof(chainId: string) {
        startTransition()
    }

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
                <Box className="mb-8">
                    <Paper elevation={0} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-100 rounded-lg p-6 mb-6">
                        <Box className="flex flex-col md:flex-row md:items-center justify-between">
                            <Box className="flex-grow">
                                <Box className="flex items-center mb-3">
                                    <Typography variant="h4" className="font-bold text-gray-800">
                                        Virtual Blockchain Explorer
                                    </Typography>

                                </Box>

                                <Box className="flex items-center mt-2">
                                    <Chip 
                                        icon={<Storage className="text-blue-600" />} 
                                        label={`ID: ${hash}`}
                                        className="bg-blue-100 text-blue-700 font-medium mr-3"
                                        size="medium"
                                    />
                                    <Typography variant="body1" className="text-gray-600 hidden md:block">
                                        Explore blocks and transactions in this virtual blockchain
                                    </Typography>
                                </Box>
                            </Box>

                            <Box className="flex flex-wrap gap-3 mt-4 md:mt-0">
                                <Tooltip title="Export proof for this blockchain">
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        startIcon={state.loading ? <CircularProgress size={20} color="inherit" /> : <FileDownload />}
                                        onClick={() => exportProof(hash as string)}
                                        disabled={state.loading}
                                        className="bg-blue-600 hover:bg-blue-700"
                                        size="large"
                                    >
                                        {state.loading ? 'Exporting...' : 'Export Proof'}
                                    </Button>
                                </Tooltip>

                                <Tooltip title="View in blockchain explorer">
                                    <Link 
                                        target="_blank" 
                                        href={`${wallet.explorerEndpoint}/explorer/virtualBlockchain/${hash}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Button 
                                            variant="outlined" 
                                            startIcon={<OpenInNew />}
                                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                                            size="large"
                                        >
                                            Explore on Chain
                                        </Button>
                                    </Link>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
                <SingleChain chainId={hash!}/>
            </motion.div>
        </motion.div>
    );
}


function SingleChain({ chainId }: { chainId: string }) {
    const wallet = useWallet();
    const provider = ProviderFactory.createInMemoryProviderWithExternalProvider(wallet.nodeEndpoint);
    const blockchain = Blockchain.createFromProvider(provider);
    const vb = new ApplicationLedgerVb({provider})
    const [height, setHeight] = useState<number|undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadChain() {
        try {
            const applicationLedger = await blockchain.loadApplicationLedger(Hash.from(chainId));
            const vb = applicationLedger.getVirtualBlockchain();
            setIsLoading(true);
            setError(null);
            const height = vb.getHeight();
            setHeight(height);
        } catch (err) {
            console.error("Error loading chain:", err);
            setError("Failed to load blockchain data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadChain();
    }, []);

    // Animation variants
    const timelineVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.2
            }
        }
    };

    if (isLoading) {
        return (
            <Box className="py-8 text-center">
                <CircularProgress size={60} thickness={4} className="mb-4" />
                <Typography variant="h6" className="font-medium text-gray-800">
                    Loading Blockchain Data
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Paper elevation={0} className="border border-red-100 rounded-lg p-8 text-center">
                <Avatar className="mx-auto mb-4 bg-red-50 text-red-500 w-16 h-16">
                    <ErrorIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5" className="font-bold text-gray-800 mb-2">
                    Error Loading Blockchain
                </Typography>
                <Typography variant="body1" className="text-gray-600 mb-4">
                    {error}
                </Typography>
                <Button 
                    variant="outlined" 
                    color="error"
                    onClick={() => loadChain()}
                >
                    Try Again
                </Button>
            </Paper>
        );
    }

    if (!height || height === 0) {
        return (
            <Paper elevation={0} className="border border-gray-100 rounded-lg p-8 text-center">
                <Avatar className="mx-auto mb-4 bg-blue-50 text-blue-500 w-16 h-16">
                    <Block fontSize="large" />
                </Avatar>
                <Typography variant="h5" className="font-bold text-gray-800 mb-2">
                    No Blocks Found
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                    This virtual blockchain doesn't contain any blocks yet.
                </Typography>
            </Paper>
        );
    }

    const content = [];
    for (let i = 1; i <= height; i++) {
        content.push(<BlocViewer key={`${chainId}-${i}`} chainId={chainId} index={i} />);
    }

    return (
        <Paper elevation={0} className="border border-gray-100 rounded-lg overflow-hidden">
            <Box className="p-4 bg-blue-50 border-b border-gray-100 flex items-center">
                <Avatar className="bg-blue-100 text-blue-600 mr-3">
                    <DataObject />
                </Avatar>
                <Typography variant="h6" className="font-semibold text-gray-800">
                    Blockchain Blocks
                </Typography>
                <Chip 
                    label={`${height} blocks`} 
                    size="small"
                    className="ml-auto bg-blue-100 text-blue-700"
                />
            </Box>

            <Box className="p-4">
                <motion.div
                    variants={timelineVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Timeline
                        sx={{
                            [`& .${timelineItemClasses.root}:before`]: {
                                flex: 0,
                                padding: 0,
                            },
                        }}
                    >
                        {content.map((item, i) => (
                            <motion.div 
                                key={i}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { 
                                        opacity: 1, 
                                        y: 0,
                                        transition: { 
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 24,
                                            delay: i * 0.05
                                        }
                                    }
                                }}
                            >
                                <TimelineItem>
                                    <TimelineSeparator>
                                        <TimelineDot color="primary" />
                                        {i < content.length - 1 && <TimelineConnector />}
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        {item}
                                    </TimelineContent>
                                </TimelineItem>
                            </motion.div>
                        ))}
                    </Timeline>
                </motion.div>
            </Box>
        </Paper>
    );
}

function BlocViewer({ chainId, index }: { chainId: string, index: number }) {
    const wallet = useRecoilValue(walletState);
    const [record, setRecord] = useState<Record<string, any>|undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const activeAccount = useRecoilValue(activeAccountState);

    async function loadBlock() {
        try {

            setIsLoading(true);
            setError(null);
            const keyPair = await getUserKeyPair(wallet!, activeAccount!);
            const provider = ProviderFactory.createKeyedProviderExternalProvider(keyPair.privateKey, wallet?.nodeEndpoint as string);
            const explorer = Blockchain.createFromProvider(provider);
            const vb = await explorer.loadApplicationLedger(Hash.from(chainId));
            const record = await vb.getRecord(vb.getHeight());
            setRecord(record);
        } catch (err) {
            console.error(`Error loading block ${index}:`, err);
            setError(`Failed to load block ${index}. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadBlock();
    }, []);

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    if (isLoading) {
        return (
            <Card className="border border-gray-100 shadow-sm mb-4 overflow-hidden">
                <CardContent className="p-4">
                    <Box className="flex items-center mb-3">
                        <Skeleton width={120} height={28} />
                    </Box>
                    <Skeleton height={150} />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="border border-red-100 shadow-sm mb-4 overflow-hidden">
                <CardContent className="p-4">
                    <Box className="flex items-center mb-2">
                        <ErrorIcon className="text-red-500 mr-2" />
                        <Typography variant="h6" className="font-medium text-red-600">
                            Error Loading Block {index}
                        </Typography>
                    </Box>
                    <Typography variant="body2" className="text-gray-600 mb-3">
                        {error}
                    </Typography>
                    <Button 
                        size="small" 
                        variant="outlined" 
                        color="error"
                        onClick={() => loadBlock()}
                    >
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (record === undefined) {
        return (
            <Card className="border border-gray-100 shadow-sm mb-4 overflow-hidden">
                <CardContent className="p-4">
                    <Typography variant="h6" className="font-medium text-gray-700 mb-2">
                        Block {index}
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                        No data available for this block.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div variants={cardVariants}>
            <Card className="border border-gray-100 shadow-sm mb-4 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-0">
                    <Box className="p-3 bg-blue-50 border-b border-gray-100 flex items-center">
                        <Avatar className="bg-blue-100 text-blue-600 mr-2" sx={{ width: 28, height: 28 }}>
                            <Block fontSize="small" />
                        </Avatar>
                        <Typography variant="h6" className="font-medium text-gray-800">
                            Block {index}
                        </Typography>
                        <Tooltip title="Block index in the blockchain">
                            <Chip 
                                label={`#${index}`} 
                                size="small"
                                className="ml-auto bg-blue-100 text-blue-700"
                            />
                        </Tooltip>
                    </Box>

                    <Box className="p-4">
                        <BlockViewer initialPath={[]} data={record}/>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
}
