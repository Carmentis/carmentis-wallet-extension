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
    Link,
    Table,
    TableCell,
    TableRow,
    Typography,
    Paper,
    Grid,
    Avatar,
    CircularProgress,
    Divider,
    Alert,
    Tooltip,
    Stepper,
    Step,
    StepLabel,
    StepContent
} from "@mui/material";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab";
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import React, { useState, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
    UploadFile,
    CheckCircle,
    Error as ErrorIcon,
    VerifiedUser,
    FileUpload,
    Refresh,
    Info,
    ArrowForward,
    DataObject
} from "@mui/icons-material";
import { useAsync } from "react-use";
import {
    Provider,
    Proof,
    ProofVerificationResult, ProviderFactory,
} from "@cmts-dev/carmentis-sdk/client";
import { BlockViewer } from "@/components/dashboard/BlockViewer.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { motion, AnimatePresence } from "framer-motion";
import {useWallet} from "@/hooks/useWallet.tsx";
import {useToast} from "@/hooks/useToast.tsx";

export default function ProofChecker() {
    const [proof, setProof] = useState<Record<string, any> | undefined>();

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    Blockchain Proof Verification
                </h1>
                <p className="text-sm text-gray-500">
                    Upload and verify blockchain proofs to validate data integrity and authenticity on the Carmentis network
                </p>
            </div>

            <ErrorBoundary fallback={<ProofCheckerFailure error={"Test"} />}>
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ErrorIcon className="text-red-600" sx={{ fontSize: 32 }} />
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Verification Failed
            </h2>

            <p className="text-sm text-gray-600 mb-6">
                We couldn't verify this proof. The file might be malformed or corrupted.
            </p>

            <Button
                variant="contained"
                color="error"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
                sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    padding: '0.625rem 1.5rem',
                    borderRadius: '0.5rem',
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' }
                }}
            >
                Try Again
            </Button>
        </div>
    );
}



function ProofCheckerUpload({ onUpload }: { onUpload: (proof: any) => void }) {
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        processFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            processFile(file);
        }
    };

    const processFile = (file?: File) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = JSON.parse(e.target?.result as string);
                    onUpload(content);
                } catch (error) {
                    toast.error("Invalid JSON file. Please upload a valid JSON file.");
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Upload Proof File</h2>

                <input
                    type="file"
                    accept="application/json"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                />

                <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                        isDragging
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UploadFile className="text-blue-600" sx={{ fontSize: 32 }} />
                    </div>

                    <h3 className="text-base font-medium text-gray-900 mb-2">
                        Drag & Drop or Click to Upload
                    </h3>

                    <p className="text-sm text-gray-500 mb-6">
                        Upload a JSON proof file to verify
                    </p>

                    <Button
                        variant="contained"
                        startIcon={<FileUpload />}
                        onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                        }}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            padding: '0.625rem 1.5rem',
                            borderRadius: '0.5rem',
                            boxShadow: 'none',
                            '&:hover': { boxShadow: 'none' }
                        }}
                    >
                        Select File
                    </Button>
                </div>

                {/* Info box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Info className="text-blue-600 flex-shrink-0 mt-0.5" fontSize="small" />
                        <div className="text-sm text-gray-700">
                            <p className="font-medium text-gray-900 mb-1">How it works</p>
                            <ol className="list-decimal list-inside space-y-1 text-gray-600">
                                <li>Upload a JSON proof file from Carmentis</li>
                                <li>We verify it cryptographically against the blockchain</li>
                                <li>View detailed verification results and proof data</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
    );
}

async function importProof(blockchain: Provider, proof: Proof): Promise<{ records: object[], result: ProofVerificationResult }> {
    const result = await blockchain.verifyProofFromJson(proof);
    const records = await Promise.all(result.getInvolvedBlockHeights().map(h => result.getRecordContainedInBlockAtHeight<any>(h)))
    return {result,  records}
}

function ProofViewer({ proof, resetProof }: { resetProof: () => void, proof: any }) {
    const wallet = useWallet();
    const blockchain = ProviderFactory.createInMemoryProviderWithExternalProvider(wallet.nodeEndpoint)
    const state = useAsync(async () => importProof(blockchain, proof));

    // Animation variants
    const containerVariants = {
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

    if (state.loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
            >
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-200 rounded-full blur-md opacity-30"></div>
                    <CircularProgress size={80} thickness={4} className="relative z-10 text-blue-500" />
                </div>
                <Typography variant="h5" className="font-semibold text-gray-800 mb-3">
                    Verifying Proof
                </Typography>
                <Typography variant="body1" className="text-gray-600 max-w-md text-center">
                    Please wait while we cryptographically verify the blockchain proof...
                </Typography>
            </motion.div>
        );
    }

    if (state.error || !state.value) {
        return <ProofCheckerFailure error={state.error?.toString() || "Unknown error"} />;
    }


    const { records, result: verificationResult } = state.value;
    const verified = verificationResult.isVerified();
    const data = state.value;
    const { author, date, title, virtualBlockchainIdentifier: appLedgerId } = proof.info;


    const rows = [
        { header: "Proof Verification Status", value: <Chip 
            label={verified ? 'Verified' : 'Failed'}
            color={verified ? 'success' : 'error'}
            icon={verified ? <CheckCircle /> : <ErrorIcon />}
            className="font-medium shadow-sm"
            sx={{ 
                padding: '4px 8px',
                '& .MuiChip-label': { fontWeight: 500 }
            }}
        /> },
        { header: "Proof Title", value: title },
        { header: "Proof Export Time", value: date },
        { header: "Proof Author", value: author },
        { header: "Virtual Blockchain ID", value: <Link 
            href={`${wallet.explorerEndpoint}/explorer/virtualBlockchain/${appLedgerId}`} 
            target={"_blank"}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
            {appLedgerId}
        </Link> },
    ];


    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <motion.div variants={itemVariants}>
                <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={() => resetProof()}
                    size="large"
                    className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 shadow-md"
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                    }}
                >
                    Verify Another Proof
                </Button>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                <Paper elevation={0} className={`border ${verified ? 'border-green-100' : 'border-red-100'} rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300`}>
                    <Box className={`p-5 ${verified ? 'bg-linear-to-r from-green-50 to-green-50/70' : 'bg-linear-to-r from-red-50 to-red-50/70'} border-b ${verified ? 'border-green-100' : 'border-red-100'} flex items-center`}>
                        <div className="relative mr-4">
                            <div className={`absolute inset-0 ${verified ? 'bg-green-200' : 'bg-red-200'} rounded-full blur-sm opacity-30`}></div>
                            <Avatar 
                                className={`${verified ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'} border shadow-sm`} 
                                sx={{ width: 40, height: 40 }}
                            >
                                {verified ? <VerifiedUser /> : <ErrorIcon />}
                            </Avatar>
                        </div>
                        <Typography variant="h6" className="font-semibold text-gray-800">
                            Proof Information
                        </Typography>
                        <Chip 
                            label={verified ? "Verified" : "Failed"} 
                            color={verified ? "success" : "error"}
                            size="small"
                            className="ml-auto"
                            sx={{ fontWeight: 500 }}
                        />
                    </Box>

                    <CardContent className="p-0">
                        <Table>
                            <tbody>
                                {rows.map((row, index) => (
                                    <TableRow key={index} className={index % 2 === 0 ? 'bg-gray-50/70' : ''} hover>
                                        <TableCell className="font-medium text-gray-700 w-1/3 py-4 px-6 border-r border-gray-100">
                                            {row.header}
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-gray-800">
                                            {row.value}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </tbody>
                        </Table>
                    </CardContent>
                </Paper>
            </motion.div>

            {data.records && (
                <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                    <Paper elevation={0} className="border border-blue-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                        <Box className="p-5 bg-linear-to-r from-blue-50 to-blue-50/70 border-b border-blue-100 flex items-center">
                            <div className="relative mr-4">
                                <div className="absolute inset-0 bg-blue-200 rounded-full blur-sm opacity-30"></div>
                                <Avatar 
                                    className="bg-blue-50 text-blue-600 border border-blue-100 shadow-sm" 
                                    sx={{ width: 40, height: 40 }}
                                >
                                    <DataObject />
                                </Avatar>
                            </div>
                            <Typography variant="h6" className="font-semibold text-gray-800">
                                Proof Data Visualization
                            </Typography>
                            <Chip 
                                label={`${data.records.length} Records`} 
                                size="small"
                                className="ml-auto bg-blue-100 text-blue-700 border border-blue-200"
                            />
                        </Box>

                        <CardContent className="p-8">
                            <ProofRecordViewer records={records} />
                        </CardContent>
                    </Paper>
                </motion.div>
            )}
        </motion.div>
    );
}

function ProofRecordViewer({ records }: { records: any[] }) {
    // Animation variants
    const timelineVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20, y: 10 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                delay: i * 0.05
            }
        })
    };

    // Import Block icon
    const Block = DataObject;

    return (
        <motion.div
            variants={timelineVariants}
            initial="hidden"
            animate="visible"
            className="mt-4"
        >
            <Timeline
                sx={{
                    [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                    },
                    padding: '12px 0',
                }}
            >
                {records.map((record, i) => (
                    <motion.div 
                        key={i} 
                        custom={i}
                        variants={itemVariants}
                    >
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot 
                                    sx={{ 
                                        width: 20, 
                                        height: 20,
                                        margin: '8px 0',
                                        backgroundColor: '#3b82f6',
                                        boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
                                    }} 
                                />
                                {i < records.length - 1 && (
                                    <TimelineConnector sx={{ 
                                        minHeight: 50,
                                        backgroundColor: '#93c5fd'
                                    }} />
                                )}
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 3 }}>
                                <Card className="border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mb-6 overflow-hidden">
                                    <Box className="p-4 bg-linear-to-r from-blue-50 to-blue-50/70 border-b border-blue-100 flex items-center">
                                        <div className="relative mr-3">
                                            <div className="absolute inset-0 bg-blue-200 rounded-full blur-sm opacity-30"></div>
                                            <Avatar 
                                                className="bg-blue-50 text-blue-600 border border-blue-100 shadow-sm" 
                                                sx={{ width: 32, height: 32 }}
                                            >
                                                <Block fontSize="small" />
                                            </Avatar>
                                        </div>
                                        <Typography variant="h6" className="font-medium text-gray-800">
                                            Block {i + 1}
                                        </Typography>
                                        <Chip 
                                            label={`# ${i + 1}`}
                                            size="small"
                                            className="ml-auto bg-blue-100 text-blue-700 border border-blue-200 shadow-sm"
                                        />
                                    </Box>
                                    <CardContent className="p-6 bg-white">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 + (i * 0.1), duration: 0.5 }}
                                        >
                                            <BlockViewer initialPath={[]} data={
                                                record
                                            } />
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </TimelineContent>
                        </TimelineItem>
                    </motion.div>
                ))}
            </Timeline>
        </motion.div>
    );
}
