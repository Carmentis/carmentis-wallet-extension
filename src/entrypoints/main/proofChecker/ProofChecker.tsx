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

import React, { useState, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
    UploadFile,
    CheckCircle,
    Error as ErrorIcon,
    Refresh,
    Info,
    OpenInNew
} from "@mui/icons-material";
import { useAsync } from "react-use";
import {
    Provider,
    Proof,
    ProofVerificationResult, ProviderFactory, ImportedProof, Hash, ActorCrypto, AccountCrypto,
} from "@cmts-dev/carmentis-sdk/client";
import { BlockViewer } from "@/components/dashboard/BlockViewer.tsx";
import { ErrorBoundary } from "react-error-boundary";
import {useWallet} from "@/hooks/useWallet.tsx";
import {useToast} from "@/hooks/useToast.tsx";
import {CircularProgress} from "@mui/material";
import useAccountCrypto from "@/hooks/useAccountCrypto.ts";

export default function ProofChecker() {
    const [proof, setProof] = useState<Record<string, any> | undefined>();

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                    Blockchain Proof Verification
                </h1>
                <p className="text-sm text-gray-500">
                    Upload and verify blockchain proofs to validate data integrity and authenticity
                </p>
            </div>

            <ErrorBoundary fallback={<ProofCheckerFailure error={"Verification failed"} />}>
                {proof ? (
                    <ProofViewer
                        proof={proof}
                        resetProof={() => setProof(undefined)}
                    />
                ) : (
                    <ProofCheckerUpload
                        onUpload={proof => setProof(proof)}
                    />
                )}
            </ErrorBoundary>
        </div>
    );
}

function ProofCheckerFailure({ error }: { error: string }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ErrorIcon className="text-red-600" sx={{ fontSize: 32 }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Verification Failed
            </h3>
            <p className="text-sm text-gray-600">
                {error}
            </p>
        </div>
    );
}

function ProofCheckerUpload({ onUpload }: { onUpload: (proof: any) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const toast = useToast();

    const handleFileSelect = async (file: File) => {
        try {
            const text = await file.text();
            const proof = JSON.parse(text);
            onUpload(proof);
        } catch (error) {
            console.error("Error reading file:", error);
            toast.error("Invalid proof file format");
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === "application/json") {
            handleFileSelect(file);
        } else {
            toast.error("Please upload a JSON file");
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                    isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                }`}
            >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UploadFile className="text-blue-600" sx={{ fontSize: 32 }} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Upload Proof File
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Click to browse or drag and drop your JSON proof file
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                    }}
                    className="hidden"
                />
            </div>

            {/* How it works */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                    <Info className="text-blue-600 mr-3 mt-0.5" fontSize="small" />
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">How it works</h4>
                        <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
                            <li>Upload a JSON proof file exported from the Carmentis network</li>
                            <li>The proof is cryptographically verified against the blockchain</li>
                            <li>View detailed verification results and proof data</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}

async function importProof(blockchain: Provider, proof: Proof, accountCrypto: AccountCrypto): Promise<ImportedProof[]> {
    const appLedgerId = Hash.fromHex(proof.info.virtualBlockchainIdentifier);
    const appLedgerVb = await blockchain.loadApplicationLedgerVirtualBlockchain(appLedgerId);
    const genesisSeed = await appLedgerVb.getGenesisSeed();
    const actorCrypto = accountCrypto.getActor(genesisSeed.toBytes());
    return await appLedgerVb.importProof(proof, actorCrypto);
}

function ProofViewer({ proof, resetProof }: { resetProof: () => void, proof: any }) {
    const wallet = useWallet();
    const activeAccountCrypto = useAccountCrypto().accountCrypto;
    const blockchain = ProviderFactory.createInMemoryProviderWithExternalProvider(wallet.nodeEndpoint)
    const state = useAsync(async () => {
        return await importProof(blockchain, proof, activeAccountCrypto);
    });

    if (state.loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CircularProgress size={32} thickness={4} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Verifying Proof
                </h3>
                <p className="text-sm text-gray-600">
                    Please wait while we verify the blockchain proof...
                </p>
            </div>
        );
    }

    if (state.error || !state.value) {
        console.error(state.error)
        return <ProofCheckerFailure error={state.error?.toString() || "Unknown error"} />;
    }

    const importedProofs = state.value;
    const verified = true;
    const { author, date, title, virtualBlockchainIdentifier: appLedgerId } = proof.info;

    return (
        <div className="space-y-6">
            {/* Verify Another Button */}
            <button
                type="button"
                onClick={() => resetProof()}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
                <Refresh fontSize="small" className="mr-2" />
                Verify Another Proof
            </button>

            {/* Verification Status */}
            <div className={`bg-white border rounded-lg overflow-hidden ${verified ? 'border-green-200' : 'border-red-200'}`}>
                <div className={`px-6 py-4 border-b flex items-center justify-between ${verified ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${verified ? 'bg-green-100' : 'bg-red-100'}`}>
                            {verified ? (
                                <CheckCircle className="text-green-600" fontSize="small" />
                            ) : (
                                <ErrorIcon className="text-red-600" fontSize="small" />
                            )}
                        </div>
                        <h2 className="ml-3 text-base font-semibold text-gray-900">Proof Information</h2>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {verified ? 'Verified' : 'Failed'}
                    </span>
                </div>

                <div className="divide-y divide-gray-200">
                    <div className="px-6 py-4 flex">
                        <span className="w-1/3 text-sm font-medium text-gray-700">Status</span>
                        <span className={`text-sm font-semibold ${verified ? 'text-green-600' : 'text-red-600'}`}>
                            {verified ? 'Verified' : 'Failed'}
                        </span>
                    </div>
                    <div className="px-6 py-4 flex">
                        <span className="w-1/3 text-sm font-medium text-gray-700">Title</span>
                        <span className="text-sm text-gray-900">{title}</span>
                    </div>
                    <div className="px-6 py-4 flex">
                        <span className="w-1/3 text-sm font-medium text-gray-700">Export Time</span>
                        <span className="text-sm text-gray-900">{date}</span>
                    </div>
                    <div className="px-6 py-4 flex">
                        <span className="w-1/3 text-sm font-medium text-gray-700">Author</span>
                        <span className="text-sm text-gray-900">{author}</span>
                    </div>
                    <div className="px-6 py-4 flex">
                        <span className="w-1/3 text-sm font-medium text-gray-700">Virtual Blockchain ID</span>
                        <a
                            href={`${wallet.explorerEndpoint}/explorer/virtualBlockchain/${appLedgerId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                            {appLedgerId}
                            <OpenInNew fontSize="small" className="ml-1" sx={{ fontSize: 14 }} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Proof Data */}
            {importedProofs && importedProofs.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-base font-semibold text-gray-900">Proof Data</h2>
                        <p className="text-xs text-gray-500 mt-1">{importedProofs.length} record{importedProofs.length !== 1 ? 's' : ''}</p>
                    </div>

                    <div className="p-6 space-y-4">
                        {importedProofs.map((record, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                    <span className="text-sm font-medium text-gray-900">Record {index + 1}</span>
                                </div>
                                <div className="p-4">
                                    <BlockViewer initialPath={[]} data={record.data} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
