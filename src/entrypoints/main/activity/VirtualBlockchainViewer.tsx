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

import React, {useEffect, useState} from "react";
import {
    ApplicationLedgerVb,
    EncoderFactory,
    Hash,
    ProviderFactory,
    WalletCrypto
} from "@cmts-dev/carmentis-sdk/client";
import {useParams} from "react-router";
import {useRecoilValue} from "recoil";
import {useAsync, useAsyncFn} from "react-use";
import {
    FileDownload,
    OpenInNew,
    Block as BlockIcon,
    FilterList,
    Refresh,
    Info
} from "@mui/icons-material";
import {BlockViewer} from "@/components/dashboard/BlockViewer.tsx";
import {activeAccountState, walletState} from "@/states/globals.tsx";
import {useWallet} from "@/hooks/useWallet.tsx";
import {getUserKeyPair} from "@/entrypoints/main/wallet.tsx";
import {CircularProgress} from "@mui/material";
import {ChevronDown, ChevronUp} from "react-bootstrap-icons";

const BLOCKS_PER_PAGE = 20;

export default function VirtualBlockchainViewer() {
    const params = useParams<{hash: string}>();
    const hash = params.hash;
    const wallet = useWallet();
    const activeAccount = useRecoilValue(activeAccountState);

    const {loading: keyPairLoading, value: keyPair} = useAsync(async () => {
        return getUserKeyPair(wallet, activeAccount!)
    });

    const [state, exportProof] = useAsyncFn(async () => {
        if (keyPairLoading || !keyPair) return;
        const provider = ProviderFactory.createInMemoryProviderWithExternalProvider(wallet.nodeEndpoint);
        const vb = await provider.loadApplicationLedgerVirtualBlockchain(Hash.from(hash as string));
        const proof = await vb.exportProof({ author: activeAccount?.pseudo as string });

        const json = JSON.stringify(proof, null, 2);
        const blob = new Blob([json], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `proof-${hash}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }, [keyPair, hash]);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                        Virtual Blockchain Explorer
                    </h1>
                    <p className="text-sm text-gray-500 mb-3">
                        Explore microblocks and transactions in this virtual blockchain
                    </p>
                    <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                        <span className="text-xs font-medium text-gray-600 mr-2">ID:</span>
                        <span className="text-xs font-mono text-blue-700">{hash}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={exportProof}
                        disabled={state.loading}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {state.loading ? (
                            <>
                                <CircularProgress size={16} className="mr-2" sx={{color: 'white'}} />
                                Exporting...
                            </>
                        ) : (
                            <>
                                <FileDownload fontSize="small" className="mr-2" />
                                Export Proof
                            </>
                        )}
                    </button>

                    <a
                        href={`${wallet.explorerEndpoint}/explorer/virtualBlockchain/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <OpenInNew fontSize="small" className="mr-2" />
                        View on Explorer
                    </a>
                </div>
            </div>

            {/* Blockchain Content */}
            <BlockchainContent chainId={hash!} />
        </div>
    );
}

function BlockchainContent({ chainId }: { chainId: string }) {
    const wallet = useWallet();
    const [height, setHeight] = useState<number | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [displayedBlocks, setDisplayedBlocks] = useState<number>(BLOCKS_PER_PAGE);
    const [filterFrom, setFilterFrom] = useState<string>("");
    const [filterTo, setFilterTo] = useState<string>("");
    const [showFilter, setShowFilter] = useState(false);

    async function loadChain() {
        try {
            setIsLoading(true);
            setError(null);
            const provider = ProviderFactory.createInMemoryProviderWithExternalProvider(wallet.nodeEndpoint);
            const vb = await provider.loadApplicationLedgerVirtualBlockchain(Hash.from(chainId));
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
    }, [chainId]);

    if (isLoading) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CircularProgress size={32} thickness={4} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Loading Blockchain Data
                </h3>
                <p className="text-sm text-gray-600">
                    Please wait while we fetch the virtual blockchain...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info className="text-red-600" sx={{ fontSize: 32 }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Error Loading Blockchain
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                    {error}
                </p>
                <button
                    type="button"
                    onClick={loadChain}
                    className="inline-flex items-center px-4 py-2 bg-white border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                >
                    <Refresh fontSize="small" className="mr-2" />
                    Try Again
                </button>
            </div>
        );
    }

    if (!height || height === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BlockIcon className="text-blue-600" sx={{ fontSize: 32 }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Blocks Found
                </h3>
                <p className="text-sm text-gray-600">
                    This virtual blockchain doesn't contain any microblocks yet.
                </p>
            </div>
        );
    }

    // Apply filters
    let startBlock = 1;
    let endBlock = Math.min(displayedBlocks, height);

    if (filterFrom && filterTo) {
        const from = parseInt(filterFrom);
        const to = parseInt(filterTo);
        if (!isNaN(from) && !isNaN(to) && from >= 1 && to <= height && from <= to) {
            startBlock = from;
            endBlock = to;
        }
    }

    const blockIndices = Array.from({ length: endBlock - startBlock + 1 }, (_, i) => startBlock + i);
    const hasMore = endBlock < height && !filterFrom && !filterTo;

    return (
        <div className="bg-white border border-gray-200 rounded-lg">
            {/* Blocks Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <BlockIcon className="text-blue-600" fontSize="small" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">Microblocks</h2>
                        <p className="text-xs text-gray-500">
                            {filterFrom && filterTo
                                ? `Showing blocks ${startBlock}-${endBlock} of ${height}`
                                : `Showing ${blockIndices.length} of ${height} blocks`
                            }
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setShowFilter(!showFilter)}
                    className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <FilterList fontSize="small" className="mr-1" />
                    Filter
                    {showFilter ? <ChevronUp fontSize="small" className="ml-1" /> : <ChevronDown fontSize="small" className="ml-1" />}
                </button>
            </div>

            {/* Filter Panel */}
            {showFilter && (
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-end gap-3">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">From Block</label>
                            <input
                                type="number"
                                min="1"
                                max={height}
                                value={filterFrom}
                                onChange={(e) => setFilterFrom(e.target.value)}
                                placeholder="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">To Block</label>
                            <input
                                type="number"
                                min="1"
                                max={height}
                                value={filterTo}
                                onChange={(e) => setFilterTo(e.target.value)}
                                placeholder={height.toString()}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setFilterFrom("");
                                setFilterTo("");
                            }}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}

            {/* Blocks List */}
            <div className="p-4 space-y-3">
                {blockIndices.map((index) => (
                    <BlockItem key={`${chainId}-${index}`} chainId={chainId} index={index} />
                ))}
            </div>

            {/* Load More */}
            {hasMore && (
                <div className="p-4 border-t border-gray-200 text-center">
                    <button
                        type="button"
                        onClick={() => setDisplayedBlocks(prev => Math.min(prev + BLOCKS_PER_PAGE, height))}
                        className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Load More ({Math.min(BLOCKS_PER_PAGE, height - displayedBlocks)} blocks)
                    </button>
                </div>
            )}
        </div>
    );
}

function BlockItem({ chainId, index }: { chainId: string, index: number }) {
    const wallet = useRecoilValue(walletState);
    const activeAccount = useRecoilValue(activeAccountState);
    const [record, setRecord] = useState<Record<string, any> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    async function loadBlock() {
        try {
            setIsLoading(true);
            setError(null);

            const encoder = EncoderFactory.defaultBytesToStringEncoder();
            const walletSeed = WalletCrypto.fromSeed(encoder.decode(wallet.seed));
            const accountCrypto = walletSeed.getAccount(activeAccount?.nonce);

            const provider = ProviderFactory.createInMemoryProviderWithExternalProvider(wallet?.nodeEndpoint as string);
            const vb = await provider.loadApplicationLedgerVirtualBlockchain(Hash.from(chainId));
            const genesisSeed = await vb.getGenesisSeed();
            const actorCrypto = accountCrypto.getActor(genesisSeed.toBytes());
            const record = await vb.getRecord(index, actorCrypto);

            setRecord(record);
        } catch (err) {
            console.error(`Error loading block ${index}:`, err);
            setError(`Failed to load block data.`);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isExpanded && record === undefined && !isLoading && !error) {
            loadBlock();
        }
    }, [isExpanded]);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Block Header - Collapsed View */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BlockIcon className="text-blue-600" sx={{ fontSize: 18 }} />
                    </div>
                    <div className="text-left">
                        <div className="text-sm font-semibold text-gray-900">Block #{index}</div>
                        <div className="text-xs text-gray-500">Microblock position in virtual blockchain</div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isExpanded && record && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            {Object.keys(record).length} fields
                        </span>
                    )}
                    {isExpanded ? (
                        <ChevronUp className="text-gray-500" />
                    ) : (
                        <ChevronDown className="text-gray-500" />
                    )}
                </div>
            </button>

            {/* Block Details - Expanded View */}
            {isExpanded && (
                <div className="p-4 bg-white border-t border-gray-200">
                    {isLoading && (
                        <div className="text-center py-8">
                            <CircularProgress size={32} thickness={4} />
                            <p className="text-sm text-gray-600 mt-3">Loading block data...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-8">
                            <p className="text-sm text-red-600 mb-3">{error}</p>
                            <button
                                type="button"
                                onClick={loadBlock}
                                className="inline-flex items-center px-3 py-1.5 bg-white border border-red-300 text-red-700 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Refresh fontSize="small" className="mr-1" />
                                Retry
                            </button>
                        </div>
                    )}

                    {!isLoading && !error && record && (
                        <BlockViewer initialPath={[]} data={record} />
                    )}

                    {!isLoading && !error && record === undefined && (
                        <p className="text-sm text-gray-500 text-center py-4">
                            No data available for this block.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
