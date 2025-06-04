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
            <Box className="mb-6">
                <Typography variant="h4" className="font-bold text-gray-800 mt-4 mb-2">
                    Blockchain Proof Verification
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                    Upload and verify blockchain proofs to validate data integrity and authenticity
                </Typography>
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
            className="flex flex-col items-center justify-center py-12"
        >
            <Paper elevation={0} className="border border-red-100 rounded-lg p-8 max-w-md mx-auto text-center">
                <Avatar className="mx-auto mb-4 bg-red-50 text-red-500 w-20 h-20">
                    <ErrorIcon fontSize="large" />
                </Avatar>

                <Typography variant="h5" className="font-bold text-gray-800 mb-2">
                    Verification Failed
                </Typography>

                <Typography variant="body1" className="text-gray-600 mb-6">
                    We couldn't verify this proof. The file might be malformed or corrupted.
                </Typography>

                <Button 
                    variant="outlined" 
                    color="error"
                    startIcon={<Refresh />}
                    onClick={() => window.location.reload()}
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
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} className="border border-gray-100 rounded-lg overflow-hidden h-full">
                        <Box className="p-4 bg-blue-50 border-b border-gray-100 flex items-center">
                            <Avatar className="bg-blue-100 text-blue-600 mr-3">
                                <FileUpload />
                            </Avatar>
                            <Typography variant="h6" className="font-semibold text-gray-800">
                                Upload Proof
                            </Typography>
                        </Box>

                        <CardContent className="p-6 flex flex-col items-center">
                            <input
                                type="file"
                                accept="application/json"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileUpload}
                            />

                            <Box 
                                className={`w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
                                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                                }`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <Avatar 
                                    className="mx-auto mb-4 bg-blue-50 text-blue-500 w-16 h-16"
                                    sx={{ width: 64, height: 64 }}
                                >
                                    <UploadFile fontSize="large" />
                                </Avatar>

                                <Typography variant="h6" className="font-medium text-gray-800 mb-1">
                                    {fileName ? fileName : 'Drag & Drop or Click to Upload'}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" className="mb-4">
                                    Upload a JSON proof file to verify
                                </Typography>

                                <Button
                                    variant="outlined"
                                    startIcon={<FileUpload />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}
                                >
                                    Select File
                                </Button>
                            </Box>
                        </CardContent>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={0} className="border border-gray-100 rounded-lg overflow-hidden h-full">
                        <Box className="p-4 bg-green-50 border-b border-gray-100 flex items-center">
                            <Avatar className="bg-green-100 text-green-600 mr-3">
                                <Info />
                            </Avatar>
                            <Typography variant="h6" className="font-semibold text-gray-800">
                                About Proof Verification
                            </Typography>
                        </Box>

                        <CardContent className="p-6">
                            <Typography variant="body1" className="mb-4">
                                Blockchain proofs provide cryptographic verification of data integrity and authenticity.
                            </Typography>

                            <Stepper orientation="vertical" className="mt-4">
                                <Step active={true} completed={true}>
                                    <StepLabel>Upload Proof File</StepLabel>
                                    <StepContent>
                                        <Typography variant="body2" color="text.secondary">
                                            Upload a JSON proof file exported from a Carmentis application.
                                        </Typography>
                                    </StepContent>
                                </Step>

                                <Step active={true} completed={false}>
                                    <StepLabel>Verification Process</StepLabel>
                                    <StepContent>
                                        <Typography variant="body2" color="text.secondary">
                                            Our system will cryptographically verify the proof against the blockchain.
                                        </Typography>
                                    </StepContent>
                                </Step>

                                <Step active={true} completed={false}>
                                    <StepLabel>View Results</StepLabel>
                                    <StepContent>
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
            className="space-y-6"
        >
            <motion.div variants={itemVariants}>
                <Box className="flex justify-between items-center mb-6">
                    <Box>
                        <Typography variant="h5" className="font-bold text-gray-800 mb-1">
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
                    >
                        Verify Another Proof
                    </Button>
                </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Paper elevation={0} className="border border-gray-100 rounded-lg overflow-hidden">
                    <Box className={`p-4 ${data.verified ? 'bg-green-50' : 'bg-red-50'} border-b border-gray-100 flex items-center`}>
                        <Avatar className={`${data.verified ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} mr-3`}>
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
                                        <TableCell className="font-medium text-gray-700 w-1/3">
                                            {row.header}
                                        </TableCell>
                                        <TableCell>
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
                    <Paper elevation={0} className="border border-gray-100 rounded-lg overflow-hidden">
                        <Box className="p-4 bg-blue-50 border-b border-gray-100 flex items-center">
                            <Avatar className="bg-blue-100 text-blue-600 mr-3">
                                <DataObject />
                            </Avatar>
                            <Typography variant="h6" className="font-semibold text-gray-800">
                                Proof Data Visualization
                            </Typography>
                        </Box>

                        <CardContent className="p-6">
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

    return (
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
                {records.map((record, i) => (
                    <motion.div key={i} variants={itemVariants}>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot color="primary" />
                                {i < records.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                                <Card className="border border-gray-100 shadow-sm mb-4">
                                    <CardContent>
                                        <Typography variant="h6" className="font-medium text-gray-800 mb-3">
                                            Block {record.height}
                                        </Typography>
                                        <Divider className="mb-3" />
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
