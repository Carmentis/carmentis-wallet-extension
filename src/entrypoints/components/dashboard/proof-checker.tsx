import { useToast } from "@/entrypoints/components/authentication-manager.tsx";
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
import { proofLoader } from "@cmts-dev/carmentis-sdk/client";
import { SpinningWheel } from "@/entrypoints/components/SpinningWheel.tsx";
import { BlockViewer } from "@/entrypoints/components/popup/popup-event-approval.tsx";
import { useWallet } from "@/entrypoints/contexts/authentication.context.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { motion, AnimatePresence } from "framer-motion";

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
                <Paper elevation={0} className="bg-gradient-to-r from-blue-50 to-green-50 border border-gray-100 rounded-lg p-6 mb-6">
                    <Box className="flex flex-col md:flex-row md:items-center justify-between">
                        <Box>
                            <Breadcrumbs className="mb-3">
                                <Typography className="text-blue-600 hover:text-blue-800 cursor-pointer">Dashboard</Typography>
                                <Typography className="font-medium">Proof Checker</Typography>
                            </Breadcrumbs>
                            <Typography variant="h4" className="font-bold text-gray-800 mb-2">
                                Blockchain Proof Verification
                            </Typography>
                            <Typography variant="body1" className="text-gray-600 max-w-2xl">
                                Upload and verify blockchain proofs to validate data integrity and authenticity on the Carmentis network
                            </Typography>
                        </Box>
                        <Avatar 
                            className="hidden md:flex bg-blue-100 text-blue-600 mt-4 md:mt-0 w-16 h-16"
                            sx={{ width: 64, height: 64 }}
                        >
                            <VerifiedUser fontSize="large" />
                        </Avatar>
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
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3
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
            <Paper elevation={0} className="border border-red-100 rounded-lg p-10 max-w-md mx-auto text-center shadow-sm">
                <Avatar className="mx-auto mb-6 bg-red-50 text-red-500 w-24 h-24">
                    <ErrorIcon sx={{ fontSize: 40 }} />
                </Avatar>

                <Typography variant="h5" className="font-bold text-gray-800 mb-3">
                    Verification Failed
                </Typography>

                <Typography variant="body1" className="text-gray-600 mb-8">
                    We couldn't verify this proof. The file might be malformed or corrupted.
                </Typography>

                <Button 
                    variant="outlined" 
                    color="error"
                    startIcon={<Refresh />}
                    onClick={() => window.location.reload()}
                    size="large"
                    className="px-6 py-2"
                >
                    Try Again
                </Button>
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

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto"
        >
            <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} className="border border-gray-100 rounded-lg overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow duration-300">
                        <Box className="p-5 bg-blue-50 border-b border-gray-100 flex items-center">
                            <Avatar className="bg-blue-100 text-blue-600 mr-4">
                                <FileUpload />
                            </Avatar>
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

                            <Box 
                                className={`w-full border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors duration-200 ${
                                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                                }`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <Avatar 
                                    className="mx-auto mb-6 bg-blue-50 text-blue-500 w-20 h-20"
                                    sx={{ width: 80, height: 80 }}
                                >
                                    <UploadFile fontSize="large" />
                                </Avatar>

                                <Typography variant="h6" className="font-medium text-gray-800 mb-3">
                                    {fileName ? fileName : 'Drag & Drop or Click to Upload'}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" className="mb-6">
                                    Upload a JSON proof file to verify
                                </Typography>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<FileUpload />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}
                                    className="px-6 py-2"
                                >
                                    Select File
                                </Button>
                            </Box>
                        </CardContent>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={0} className="border border-gray-100 rounded-lg overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow duration-300">
                        <Box className="p-5 bg-green-50 border-b border-gray-100 flex items-center">
                            <Avatar className="bg-green-100 text-green-600 mr-4">
                                <Info />
                            </Avatar>
                            <Typography variant="h6" className="font-semibold text-gray-800">
                                About Proof Verification
                            </Typography>
                        </Box>

                        <CardContent className="p-8">
                            <Typography variant="body1" className="mb-6">
                                Blockchain proofs provide cryptographic verification of data integrity and authenticity.
                            </Typography>

                            <Stepper orientation="vertical" className="mt-6">
                                <Step active={true} completed={true}>
                                    <StepLabel>Upload Proof File</StepLabel>
                                    <StepContent className="pb-4 pt-2">
                                        <Typography variant="body2" color="text.secondary">
                                            Upload a JSON proof file exported from a Carmentis application.
                                        </Typography>
                                    </StepContent>
                                </Step>

                                <Step active={true} completed={false}>
                                    <StepLabel>Verification Process</StepLabel>
                                    <StepContent className="pb-4 pt-2">
                                        <Typography variant="body2" color="text.secondary">
                                            Our system will cryptographically verify the proof against the blockchain.
                                        </Typography>
                                    </StepContent>
                                </Step>

                                <Step active={true} completed={false}>
                                    <StepLabel>View Results</StepLabel>
                                    <StepContent className="pb-4 pt-2">
                                        <Typography variant="body2" color="text.secondary">
                                            See detailed verification results and proof data visualization.
                                        </Typography>
                                    </StepContent>
                                </Step>
                            </Stepper>
                        </CardContent>
                    </Paper>
                </Grid>
            </Grid>
        </motion.div>
    );
}

function ProofViewer({ proof, resetProof }: { resetProof: () => void, proof: Record<string, any> }) {
    const wallet = useWallet();
    const state = useAsync(async () => {
        let loader = new proofLoader(proof);
        try {
            const records = await loader.load();
            return { verified: true, records: records.records }
        } catch (error) {
            console.error(error)
            return { verified: false, records: undefined }
        }
    });

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
                className="flex flex-col items-center justify-center py-16"
            >
                <CircularProgress size={60} thickness={4} className="mb-4" />
                <Typography variant="h6" className="font-medium text-gray-800 mb-2">
                    Verifying Proof
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Please wait while we verify the blockchain proof...
                </Typography>
            </motion.div>
        );
    }

    if (state.error || !state.value) {
        return <ProofCheckerFailure error={state.error?.toString() || "Unknown error"} />;
    }

    const data = state.value;
    const header = proof.information;
    const appLedgerId = proof.proofData.appLedgerId;

    const rows = [
        { header: "Proof Verification Status", value: <Chip 
            label={data.verified ? 'Verified' : 'Failed'} 
            color={data.verified ? 'success' : 'error'}
            icon={data.verified ? <CheckCircle /> : <ErrorIcon />}
            className="font-medium"
        /> },
        { header: "Proof Title", value: header.title },
        { header: "Proof Export Time", value: header.exportTime },
        { header: "Virtual Blockchain ID", value: <Link 
            href={`${wallet.explorerEndpoint}/explorer/virtualBlockchain/${appLedgerId}`} 
            target={"_blank"}
            className="text-blue-600 hover:text-blue-800 underline"
        >
            {appLedgerId}
        </Link> },
        { header: "Application", value: header.application },
        { header: "Operator", value: header.applicationOperator },
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <motion.div variants={itemVariants}>
                <Paper elevation={0} className="border border-gray-100 rounded-lg p-6 mb-2 shadow-sm">
                    <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <Box>
                            <Typography variant="h5" className="font-bold text-gray-800 mb-2">
                                Proof Verification Results
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {header.title}
                            </Typography>
                        </Box>

                        <Button 
                            variant="outlined" 
                            startIcon={<Refresh />}
                            onClick={() => resetProof()}
                            size="large"
                            className="px-4"
                        >
                            Verify Another Proof
                        </Button>
                    </Box>
                </Paper>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Paper elevation={0} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <Box className={`p-5 ${data.verified ? 'bg-green-50' : 'bg-red-50'} border-b border-gray-100 flex items-center`}>
                        <Avatar className={`${data.verified ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} mr-4`} sx={{ width: 40, height: 40 }}>
                            {data.verified ? <VerifiedUser /> : <ErrorIcon />}
                        </Avatar>
                        <Typography variant="h6" className="font-semibold text-gray-800">
                            Proof Information
                        </Typography>
                    </Box>

                    <CardContent className="p-0">
                        <Table>
                            <tbody>
                                {rows.map((row, index) => (
                                    <TableRow key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                        <TableCell className="font-medium text-gray-700 w-1/3 py-4 px-6">
                                            {row.header}
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
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
                <motion.div variants={itemVariants}>
                    <Paper elevation={0} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <Box className="p-5 bg-blue-50 border-b border-gray-100 flex items-center">
                            <Avatar className="bg-blue-100 text-blue-600 mr-4" sx={{ width: 40, height: 40 }}>
                                <DataObject />
                            </Avatar>
                            <Typography variant="h6" className="font-semibold text-gray-800">
                                Proof Data Visualization
                            </Typography>
                        </Box>

                        <CardContent className="p-8">
                            <ProofRecordViewer records={data.records} />
                        </CardContent>
                    </Paper>
                </motion.div>
            )}
        </motion.div>
    );
}

function ProofRecordViewer({ records }: { records: { height: number, record: Record<string, any> }[] }) {
    // Animation variants
    const timelineVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    // Import Block icon
    const Block = DataObject;

    return (
        <motion.div
            variants={timelineVariants}
            initial="hidden"
            animate="visible"
            className="mt-2"
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
                    <motion.div key={i} variants={itemVariants}>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot 
                                    color="primary" 
                                    sx={{ 
                                        width: 16, 
                                        height: 16,
                                        margin: '8px 0'
                                    }} 
                                />
                                {i < records.length - 1 && (
                                    <TimelineConnector sx={{ minHeight: 40 }} />
                                )}
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 mb-6 overflow-hidden">
                                    <Box className="p-4 bg-blue-50 border-b border-gray-100 flex items-center">
                                        <Avatar className="bg-blue-100 text-blue-600 mr-3" sx={{ width: 32, height: 32 }}>
                                            <Block fontSize="small" />
                                        </Avatar>
                                        <Typography variant="h6" className="font-medium text-gray-800">
                                            Block {record.height}
                                        </Typography>
                                        <Chip 
                                            label={`#${record.height}`} 
                                            size="small"
                                            className="ml-auto bg-blue-100 text-blue-700"
                                        />
                                    </Box>
                                    <CardContent className="p-6">
                                        <BlockViewer initialPath={[]} data={record.record} />
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
