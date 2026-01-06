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

import {useRecoilValue} from "recoil";
import {activeAccountState, walletState} from "@/states/globals.tsx";
import {useNavigate} from "react-router";
import React, {useEffect, useState} from "react";
import {EmptyStateMessage} from "@/entrypoints/main/activity/EmptyStateMessage.tsx";
import {AccountDataStorage} from "@/utils/db/AccountDataStorage.ts";
import {getUserKeyPair} from "@/entrypoints/main/wallet.tsx";
import {Hash, Provider, ProviderFactory} from "@cmts-dev/carmentis-sdk/client";
import {Avatar, Box, Button, Chip, CircularProgress, Paper, Typography} from "@mui/material";
import {ArrowRight, Business, Refresh, Schedule, Storage, Timeline} from "@mui/icons-material";
import {LoadingState} from "@/entrypoints/main/activity/LoadingState.tsx";
import {ErrorState} from "@/entrypoints/main/activity/ErrorState.tsx";
import {DynamicTableComponent} from "@/entrypoints/main/activity/DynamicTableComponent.tsx";

export function TableOfChains() {
    const offset = 0;
    const limit = 200;
    const wallet = useRecoilValue(walletState);
    const activeAccount = useRecoilValue(activeAccountState);
    const navigate = useNavigate();
    const [chains, setChains] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    if (!activeAccount) return <EmptyStateMessage message="No active account found"/>;

    async function loadChains() {
        try {
            setIsLoading(true);
            setError(null);

            const db = await AccountDataStorage.connectDatabase(activeAccount!);
            const keyPair = await getUserKeyPair(wallet!, activeAccount!);
            const chains = await db.getAllApplicationVirtualBlockchainId(offset, limit);
            /*
            sdk.blockchain.blockchainCore.setUser(
                sdk.blockchain.ROLES.OPERATOR,
                sdk.utils.encoding.toHexa(keyPair.privateKey)
            );

             */

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
            // creating the provider
            const provider = ProviderFactory.createInMemoryProviderWithExternalProvider(wallet?.nodeEndpoint as string);

            // loading the organisation, application and application ledger
            console.log("Loading application ledger...")
            const applicationLedger = await provider.loadApplicationLedger(Hash.from(chain));
            console.log("Loading application...")
            const application = await provider.loadApplication(applicationLedger.getApplicationId());
            const organisationId = await application.getOrganizationId();
            console.log("Loading organisation...")
            const organisation = await provider.loadOrganization(organisationId);
            const applicationDescription = await application.getDescription();
            const organisationDescription = await organisation.getDescription();
            const height = applicationLedger.getHeight();


            // Find the range of timeline for the virtual blockchain
            const records = [];
            const timestamps = [];
            for (let index = 1; index <= height; index++) {
                const vb = applicationLedger.getVirtualBlockchain();
                const record = await applicationLedger.getRecord(index)
                const mb = await vb.getMicroblock(index);
                timestamps.push(mb.getTimestamp());
                records.push(record)
            }
            const min = timestamps.reduce((a, b) => Math.min(a, b), timestamps[0]);
            const max = timestamps.reduce((a, b) => Math.max(a, b), timestamps[0]);

            return [
                <Box className="flex items-center">
                    <Avatar className="bg-blue-100 text-blue-600 mr-2" sx={{width: 28, height: 28}}>
                        <Storage fontSize="small"/>
                    </Avatar>
                    <Typography className="font-medium">{applicationDescription.name}</Typography>
                </Box>,
                <Box className="flex items-center">
                    <Avatar className="bg-purple-100 text-purple-600 mr-2" sx={{width: 28, height: 28}}>
                        <Business fontSize="small"/>
                    </Avatar>
                    <Typography>{organisationDescription.name}</Typography>
                </Box>,
                <Chip
                    icon={<Timeline fontSize="small"/>}
                    label={height}
                    className="bg-green-50 text-green-700"
                />,
                <Box className="flex items-center">
                    <Schedule fontSize="small" className="text-gray-500 mr-1"/>
                    <Typography className="text-sm">
                        {new Date(min * 1000).toLocaleString()}
                        <ArrowRight className="mx-1 text-blue-500"/>
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
        return <LoadingState/>;
    }

    if (error) {
        return <ErrorState message={error} onRetry={handleRefresh}/>;
    }

    if (chains.length === 0) {
        return <EmptyStateMessage message="No blockchain activity found"/>;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Virtual Blockchains</h2>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={isRefreshing ? <CircularProgress size={16}/> : <Refresh />}
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        borderColor: '#d1d5db',
                        color: '#374151',
                        '&:hover': {
                            borderColor: '#9ca3af',
                            backgroundColor: '#f9fafb'
                        }
                    }}
                >
                    {isRefreshing ? "Refreshing..." : "Refresh"}
                </Button>
            </div>

            <div className="p-6">
                <DynamicTableComponent
                    header={["Application", "Organisation", "Blockchain Height", "Time Range"]}
                    data={chains}
                    renderRow={renderRow}
                    onRowClicked={(hash) => navigateToVirtualBlockchainView(hash)}
                />
            </div>
        </div>
    );
}