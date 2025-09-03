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
    BlockchainFacade,
    Proof,
    ProofVerificationResult,
} from "@cmts-dev/carmentis-sdk/client";
import { BlockViewer } from "@/components/dashboard/BlockViewer.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { motion, AnimatePresence } from "framer-motion";
import {useWallet} from "@/hooks/useWallet.tsx";
import {useToast} from "@/hooks/useToast.tsx";

export default function ProofChecker() {
    const [proof, setProof] = useState<Record<string, any> | undefined>();

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

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={pageVariants}
            className="max-w-6xl mx-auto"
        >
            <Box className="mb-8">
                <Paper elevation={0} className="bg-linear-to-r from-blue-50 to-blue-100/30 border border-blue-100 rounded-xl p-8 mb-6 shadow-sm">
                    <Box className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <Box>
                            <Breadcrumbs className="mb-3">
                                <Link href="/public" className="text-blue-600 hover:text-blue-800 no-underline hover:underline">Dashboard</Link>
                                <Typography className="font-medium text-gray-700">Proof Checker</Typography>
                            </Breadcrumbs>
                            <Typography variant="h4" className="font-bold text-gray-800 mb-3">
                                Blockchain Proof Verification
                            </Typography>
                            <Typography variant="body1" className="text-gray-600 max-w-2xl">
                                Upload and verify blockchain proofs to validate data integrity and authenticity on the Carmentis network
                            </Typography>
                        </Box>
                        <div className="relative md:mt-0 mt-4">
                            <div className="absolute inset-0 bg-blue-200 rounded-full blur-md opacity-30"></div>
                            <Avatar 
                                className="bg-blue-50 text-blue-600 w-20 h-20 border-2 border-blue-100 relative shadow-md"
                                sx={{ width: 80, height: 80 }}
                            >
                                <VerifiedUser sx={{ fontSize: 40 }} />
                            </Avatar>
                        </div>
                    </Box>
                </Paper>
            </Box>

            <ErrorBoundary fallback={<ProofCheckerFailure error={"Test"} />}>
                <AnimatePresence mode="wait">
                    {proof ? (
                        <ProofViewer 
                            key="viewer" 
                            proof={proof} 
                            resetProof={() => setProof(undefined)} 
                        />
                    ) : (
                        <ProofCheckerUpload 
                            key="upload" 
                            onUpload={proof => setProof(proof)} 
                        />
                    )}
                </AnimatePresence>
            </ErrorBoundary>
        </motion.div>
    );
}

function ProofCheckerFailure({ error }: { error: string }) {
    // Animation variants
    const errorVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                duration: 0.4
            }
        }
    };

    return (
        <motion.div
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-16"
        >
            <Paper elevation={0} className="border border-red-100 rounded-xl p-10 max-w-md mx-auto text-center shadow-md overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-red-50/50 to-white z-0"></div>
                <div className="relative z-10">
                    <div className="relative mx-auto mb-8 w-28 h-28">
                        <div className="absolute inset-0 bg-red-200 rounded-full blur-md opacity-30"></div>
                        <Avatar className="mx-auto bg-red-50 text-red-500 w-28 h-28 border-2 border-red-100 relative shadow-md">
                            <ErrorIcon sx={{ fontSize: 48 }} />
                        </Avatar>
                    </div>

                    <Typography variant="h5" className="font-bold text-gray-800 mb-4">
                        Verification Failed
                    </Typography>

                    <Typography variant="body1" className="text-gray-600 mb-8">
                        We couldn't verify this proof. The file might be malformed or corrupted.
                    </Typography>

                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Button 
                            variant="contained" 
                            color="error"
                            startIcon={<Refresh />}
                            onClick={() => window.location.reload()}
                            size="large"
                            className="px-8 py-2.5 shadow-md"
                            sx={{
                                textTransform: 'none',
                                fontWeight: 500,
                                fontSize: '0.95rem',
                            }}
                        >
                            Try Again
                        </Button>
                    </motion.div>
                </div>
            </Paper>
        </motion.div>
    );
}



function ProofCheckerUpload({ onUpload }: { onUpload: (proof: any) => void }) {
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

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
            setFileName(file.name);

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = JSON.parse(e.target?.result as string);
                    onUpload(content);
                } catch (error) {
                    toast.error("Invalid JSON file. Please upload a valid JSON file.");
                    setFileName(null);
                }
            };
            reader.readAsText(file);
        }
    };

    // Animation variants
    const containerVariants = {
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

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                delay: 0.1
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
        >
            <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                    <motion.div variants={cardVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                        <Paper elevation={0} className="border border-blue-100 rounded-xl overflow-hidden h-full shadow-sm hover:shadow-md transition-all duration-300">
                            <Box className="p-5 bg-linear-to-r from-blue-50 to-blue-50/70 border-b border-blue-100 flex items-center">
                                <div className="relative mr-4">
                                    <div className="absolute inset-0 bg-blue-200 rounded-full blur-sm opacity-30"></div>
                                    <Avatar className="bg-blue-50 text-blue-600 border border-blue-100 shadow-sm" sx={{ width: 40, height: 40 }}>
                                        <FileUpload />
                                    </Avatar>
                                </div>
                                <Typography variant="h6" className="font-semibold text-gray-800">
                                    Upload Proof
                                </Typography>
                            </Box>

                            <CardContent className="p-8 flex flex-col items-center">
                                <input
                                    type="file"
                                    accept="application/json"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />

                                <motion.div 
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full"
                                >
                                    <Box 
                                        className={`w-full border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
                                            isDragging ? 'border-blue-500 bg-blue-50/50 shadow-md' : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50/30'
                                        }`}
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <div className="relative mx-auto mb-6 w-20 h-20">
                                            <div className="absolute inset-0 bg-blue-200 rounded-full blur-md opacity-30"></div>
                                            <Avatar 
                                                className="mx-auto bg-blue-50 text-blue-500 w-20 h-20 border-2 border-blue-100 relative shadow-md"
                                                sx={{ width: 80, height: 80 }}
                                            >
                                                <UploadFile sx={{ fontSize: 40 }} />
                                            </Avatar>
                                        </div>

                                        <Typography variant="h6" className="font-medium text-gray-800 mb-3">
                                            Drag & Drop or Click to Upload'
                                        </Typography>

                                        <Typography variant="body2" className="text-gray-500 mb-6">
                                            Upload a JSON proof file to verify
                                        </Typography>

                                        <motion.div
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <Button
                                                variant="contained"
                                                size="large"
                                                startIcon={<FileUpload />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    fileInputRef.current?.click();
                                                }}
                                                className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 shadow-md"
                                                sx={{
                                                    textTransform: 'none',
                                                    fontWeight: 500,
                                                    fontSize: '0.95rem',
                                                }}
                                            >
                                                Select File
                                            </Button>
                                        </motion.div>
                                    </Box>
                                </motion.div>
                            </CardContent>
                        </Paper>
                    </motion.div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <motion.div variants={cardVariants}>
                        <Paper elevation={0} className="border border-blue-100 rounded-xl overflow-hidden h-full shadow-sm hover:shadow-md transition-all duration-300">
                            <Box className="p-5 bg-linear-to-r from-blue-50 to-blue-50/70 border-b border-blue-100 flex items-center">
                                <div className="relative mr-4">
                                    <div className="absolute inset-0 bg-blue-200 rounded-full blur-sm opacity-30"></div>
                                    <Avatar className="bg-blue-50 text-blue-600 border border-blue-100 shadow-sm" sx={{ width: 40, height: 40 }}>
                                        <Info />
                                    </Avatar>
                                </div>
                                <Typography variant="h6" className="font-semibold text-gray-800">
                                    About Proof Verification
                                </Typography>
                            </Box>

                            <CardContent className="p-8">
                                <Alert 
                                    severity="info" 
                                    className="mb-6 rounded-lg border border-blue-100 bg-blue-50/50 shadow-sm"
                                    icon={<Info className="text-blue-500" />}
                                >
                                    <Typography variant="body2">
                                        Blockchain proofs provide cryptographic verification of data integrity and authenticity.
                                    </Typography>
                                </Alert>

                                <Stepper orientation="vertical" className="mt-6">
                                    <Step active={true} completed={true}>
                                        <StepLabel StepIconProps={{ 
                                            sx: { 
                                                '&.Mui-completed': { color: '#3b82f6' },
                                                '&.Mui-active': { color: '#3b82f6' } 
                                            } 
                                        }}>
                                            <Typography className="font-medium">Upload Proof File</Typography>
                                        </StepLabel>
                                        <StepContent className="pb-4 pt-2">
                                            <Typography variant="body2" className="text-gray-600">
                                                Upload a JSON proof file exported from a Carmentis application.
                                            </Typography>
                                        </StepContent>
                                    </Step>

                                    <Step active={true} completed={false}>
                                        <StepLabel StepIconProps={{ 
                                            sx: { 
                                                '&.Mui-active': { color: '#3b82f6' } 
                                            } 
                                        }}>
                                            <Typography className="font-medium">Verification Process</Typography>
                                        </StepLabel>
                                        <StepContent className="pb-4 pt-2">
                                            <Typography variant="body2" className="text-gray-600">
                                                Our system will cryptographically verify the proof against the blockchain.
                                            </Typography>
                                        </StepContent>
                                    </Step>

                                    <Step active={true} completed={false}>
                                        <StepLabel StepIconProps={{ 
                                            sx: { 
                                                '&.Mui-active': { color: '#3b82f6' } 
                                            } 
                                        }}>
                                            <Typography className="font-medium">View Results</Typography>
                                        </StepLabel>
                                        <StepContent className="pb-4 pt-2">
                                            <Typography variant="body2" className="text-gray-600">
                                                See detailed verification results and proof data visualization.
                                            </Typography>
                                        </StepContent>
                                    </Step>
                                </Stepper>
                            </CardContent>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>
        </motion.div>
    );
}

async function importProof(blockchain: BlockchainFacade, proof: Proof): Promise<{ records: object[], result: ProofVerificationResult }> {
    const result = await blockchain.verifyProofFromJson(proof);
    const records = await Promise.all(result.getInvolvedBlockHeights().map(h => result.getRecordContainedInBlockAtHeight<any>(h)))
    return {result,  records}
}

function ProofViewer({ proof, resetProof }: { resetProof: () => void, proof: any }) {
    const wallet = useWallet();
    const blockchain = BlockchainFacade.createFromNodeUrl(wallet.nodeEndpoint)
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
    const appLedgerId = proof.virtualBlockchainIdentifier;

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
        { header: "Proof Title", value: proof.info.title },
        { header: "Proof Export Time", value: proof.info.data },
        { header: "Virtual Blockchain ID", value: <Link 
            href={`${wallet.explorerEndpoint}/explorer/virtualBlockchain/${appLedgerId}`} 
            target={"_blank"}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
            {appLedgerId}
        </Link> },
        //{ header: "Application", value: header.application },
        //{ header: "Operator", value: header.applicationOperator },
    ];


    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <motion.div variants={itemVariants}>
                <Paper elevation={0} className="border border-blue-100 rounded-xl p-6 mb-2 shadow-sm bg-linear-to-r from-blue-50/50 to-white">
                    <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <Box>
                            <Typography variant="h5" className="font-bold text-gray-800 mb-2">
                                Proof Verification Results
                            </Typography>
                            <Typography variant="body1" className="text-gray-600">
                                {proof.info.title}
                            </Typography>
                        </Box>

                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
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
                    </Box>
                </Paper>
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
                                            Block {record.height}
                                        </Typography>
                                        <Chip 
                                            label={`#${record.height}`} 
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
                                                record.data // TODO: check because its very strange to access data this way.
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
