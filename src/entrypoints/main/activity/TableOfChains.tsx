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
import {activeAccountCryptoState, activeAccountState, walletState} from "@/states/globals.tsx";
import {useNavigate} from "react-router";
import React, {useEffect, useState} from "react";
import {EmptyStateMessage} from "@/entrypoints/main/activity/EmptyStateMessage.tsx";
import {AccountDataStorage} from "@/utils/db/AccountDataStorage.ts";
import {Hash, ProviderFactory} from "@cmts-dev/carmentis-sdk/client";
import {CircularProgress} from "@mui/material";
import {Refresh, Delete, ChevronRight} from "@mui/icons-material";
import {LoadingState} from "@/entrypoints/main/activity/LoadingState.tsx";
import {ErrorState} from "@/entrypoints/main/activity/ErrorState.tsx";

interface VBRowData {
    chainId: string;
    applicationName?: string;
    organizationName?: string;
    height?: number;
    minTimestamp?: number;
    maxTimestamp?: number;
    error?: string;
    isLoading: boolean;
}

export function TableOfChains() {
    const offset = 0;
    const limit = 200;
    const wallet = useRecoilValue(walletState);
    const activeAccount = useRecoilValue(activeAccountState);
    const activeAccountCrypto = useRecoilValue(activeAccountCryptoState);
    const navigate = useNavigate();
    const [chains, setChains] = useState<VBRowData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    if (!activeAccount) return <EmptyStateMessage message="No active account found"/>;

    async function loadChains() {
        try {
            setIsLoading(true);
            setError(null);

            const db = await AccountDataStorage.connectDatabase(activeAccount!);
            const chainIds = await db.getAllApplicationVirtualBlockchainId(offset, limit);

            const chainData: VBRowData[] = chainIds.map(c => ({
                chainId: c.virtualBlockchainId,
                isLoading: true
            }));

            setChains(chainData);

            // Load data for each chain
            chainData.forEach((chain, index) => {
                loadChainData(chain.chainId, index);
            });
        } catch (err) {
            console.error("Error loading chains:", err);
            setError("Failed to load blockchain data. Please try again.");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }

    async function loadChainData(chainId: string, index: number) {
        try {
            const provider = ProviderFactory.createInMemoryProviderWithExternalProvider(wallet?.nodeEndpoint as string);
            const applicationLedger = await provider.loadApplicationLedgerVirtualBlockchain(Hash.from(chainId));
            const genesisSeed = await applicationLedger.getGenesisSeed();
            const actorCrypto = activeAccountCrypto?.getActor(genesisSeed.toBytes());
            const application = await provider.loadApplicationVirtualBlockchain(applicationLedger.getApplicationId());
            const organisationId = await application.getOrganizationId();
            const organisation = await provider.loadOrganizationVirtualBlockchain(organisationId);
            const applicationDescription = await application.getApplicationDescription();
            const organisationDescription = await organisation.getDescription();
            const height = applicationLedger.getHeight();

            // Find the range of timeline for the virtual blockchain
            const timestamps = [];
            for (let i = 1; i <= height; i++) {
                const mb = await applicationLedger.getMicroblock(i);
                timestamps.push(mb.getTimestamp());
            }
            const minTimestamp = timestamps.length > 0 ? Math.min(...timestamps) : undefined;
            const maxTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : undefined;

            setChains(prev => prev.map((c, i) =>
                i === index ? {
                    ...c,
                    applicationName: applicationDescription.name,
                    organizationName: organisationDescription.name,
                    height,
                    minTimestamp,
                    maxTimestamp,
                    isLoading: false
                } : c
            ));
        } catch (error) {
            console.error(`Error loading chain ${chainId}:`, error);
            setChains(prev => prev.map((c, i) =>
                i === index ? {
                    ...c,
                    error: "Failed to load data",
                    isLoading: false
                } : c
            ));
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

    async function handleDelete(chainId: string, event: React.MouseEvent) {
        event.stopPropagation();

        try {
            const db = await AccountDataStorage.connectDatabase(activeAccount!);
            await db.deleteApplicationVirtualBlockchain(chainId);
            setChains(prev => prev.filter(c => c.chainId !== chainId));
        } catch (err) {
            console.error("Error deleting chain:", err);
            alert("Failed to delete virtual blockchain");
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
                <h2 className="text-base font-semibold text-gray-900">Virtual Blockchains</h2>
                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isRefreshing ? (
                        <>
                            <CircularProgress size={14} className="mr-2" />
                            Refreshing...
                        </>
                    ) : (
                        <>
                            <Refresh fontSize="small" className="mr-1" />
                            Refresh
                        </>
                    )}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Application</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Height</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Range</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {chains.map((chain, index) => (
                            <tr
                                key={chain.chainId}
                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => navigateToVirtualBlockchainView(chain.chainId)}
                            >
                                <td className="px-6 py-4">
                                    {chain.isLoading ? (
                                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                                    ) : chain.error ? (
                                        <span className="text-sm text-red-600">{chain.error}</span>
                                    ) : (
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-900">{chain.applicationName}</span>
                                            <ChevronRight fontSize="small" className="text-gray-400 ml-1" />
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {chain.isLoading ? (
                                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    ) : chain.error ? (
                                        <span className="text-sm text-gray-400">-</span>
                                    ) : (
                                        <span className="text-sm text-gray-600">{chain.organizationName}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {chain.isLoading ? (
                                        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                                    ) : chain.error ? (
                                        <span className="text-sm text-gray-400">-</span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {chain.height} blocks
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {chain.isLoading ? (
                                        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                                    ) : chain.error ? (
                                        <span className="text-sm text-gray-400">-</span>
                                    ) : chain.minTimestamp && chain.maxTimestamp ? (
                                        <span className="text-xs text-gray-600">
                                            {new Date(chain.minTimestamp * 1000).toLocaleString()} → {new Date(chain.maxTimestamp * 1000).toLocaleString()}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-gray-400">No data</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        type="button"
                                        onClick={(e) => handleDelete(chain.chainId, e)}
                                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors bg-white border border-red-300 text-red-700 hover:bg-red-50"
                                    >
                                        <Delete fontSize="small" className="mr-1" sx={{ fontSize: 16 }} />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
