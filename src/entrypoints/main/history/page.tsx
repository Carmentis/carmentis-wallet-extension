import {
    Button,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    Paper,
    Grid,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
    TablePagination,
    useTheme
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import NoTokenAccount from '@/entrypoints/components/NoTokenAccount.tsx';
import { SparkLineChart } from "@mui/x-charts";
import Skeleton from "react-loading-skeleton";
import { Splashscreen } from "@/entrypoints/components/Splashscreen.tsx";
import { motion, AnimatePresence } from "framer-motion";
import {
    AccountBalance,
    History as HistoryIcon,
    TrendingUp,
    ArrowUpward,
    ArrowDownward,
    SwapHoriz,
    CalendarToday,
    Label,
    Person,
    KeyboardArrowDown,
    KeyboardArrowUp
} from "@mui/icons-material";
import { useAuthenticatedAccount } from '@/entrypoints/contexts/authentication.context.tsx';
import {Hash, CMTSToken, Transaction} from "@cmts-dev/carmentis-sdk/client";
import {useAccountTransactionHistoryHook} from "@/hooks/useAccountTransactionHistoryHook.tsx";
import {useOptimizedAccountBalance} from "@/hooks/useOptimizedAccountBalance.tsx";

export default function HistoryPage() {
    const balanceResponse = useOptimizedAccountBalance();

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
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    if (balanceResponse.isLoading) return <Splashscreen />
    if (balanceResponse.error) {
        return <NoTokenAccount />
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={pageVariants}
            className="max-w-4xl mx-auto"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8">
                <Box className="flex items-center mb-4">
                    <Avatar className="bg-purple-100 text-purple-600 mr-3">
                        <HistoryIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" className="font-bold text-gray-800">
                            Transaction History
                        </Typography>
                        <Typography variant="body1" className="text-gray-600">
                            View your account balance and transaction history
                        </Typography>
                    </Box>
                </Box>
            </motion.div>

            {/* Balance and Graph Cards */}
            <motion.div variants={itemVariants}>
                <Grid container spacing={4} className="mb-6">
                    <Grid item xs={12} md={6}>
                        <BalanceCard />
                    </Grid>
                </Grid>
            </motion.div>

            {/* Transaction History */}
            <motion.div variants={itemVariants}>
                <TransactionHistory />
            </motion.div>
        </motion.div>
    );
}

function BalanceCard() {
    const balanceResponse = useOptimizedAccountBalance();
    const activeAccount = useAuthenticatedAccount();

    // Animation variants
    const cardVariants = {
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

    if (balanceResponse.error) {
        return <NoTokenAccount />
    }

    return (
        <motion.div variants={cardVariants}>
            <Paper elevation={0} className="border border-gray-100 rounded-lg overflow-hidden h-full">
                <Box className="p-4 bg-green-50 border-b border-gray-100 flex items-center">
                    <Avatar className="bg-green-100 text-green-600 mr-3">
                        <AccountBalance />
                    </Avatar>
                    <Typography variant="h6" className="font-semibold text-gray-800">
                        Current Balance
                    </Typography>
                </Box>

                <CardContent className="p-6 flex flex-col items-center justify-center">
                    {balanceResponse.isLoading ? (
                        <Skeleton height={60} width={200} />
                    ) : (
                        <>
                            <Typography variant="h3" className="font-bold text-gray-800 mb-2">
                                {balanceResponse.data?.toString()}
                            </Typography>
                            <Typography variant="body2" className="text-gray-500">
                                {activeAccount?.pseudo}'s balance
                            </Typography>
                        </>
                    )}
                </CardContent>
            </Paper>
        </motion.div>
    );
}

const INITIAL_MAX_ENTRIES = 10;

function TransactionHistory() {
    const [maxEntries, setMaxEntries] = useState(INITIAL_MAX_ENTRIES);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(INITIAL_MAX_ENTRIES);
    const { data, isLoading, error } = useAccountTransactionHistoryHook(0, maxEntries);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    // Animation variants
    const tableVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                delay: 0.2
            }
        }
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
        if ((newPage + 1) * rowsPerPage > maxEntries) {
            setMaxEntries(maxEntries + INITIAL_MAX_ENTRIES);
        }
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        if (newRowsPerPage > maxEntries) {
            setMaxEntries(newRowsPerPage);
        }
    };

    const toggleRowExpand = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    if (isLoading) {
        return (
            <Box className="mb-8">
                <Skeleton height={400} />
            </Box>
        );
    }

    if (error || !data) {
        return (
            <Box className="mb-8 p-6 bg-red-50 rounded-lg border border-red-100">
                <Typography variant="h6" className="text-red-700 mb-2">
                    Error Loading Transactions
                </Typography>
                <Typography variant="body2" className="text-red-600">
                    There was an error loading your transaction history. Please try again later.
                </Typography>
            </Box>
        );
    }

    if (!data.containsTransactions()) {
        return (
            <Box className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-100 text-center">
                <Typography variant="h6" className="text-gray-700 mb-2">
                    No Transactions Yet
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                    You haven't made any transactions yet. When you do, they'll appear here.
                </Typography>
            </Box>
        );
    }

    return (
        <motion.div variants={tableVariants} className="mb-8">
            <Paper elevation={0} className="border border-gray-100 rounded-lg overflow-hidden">
                <Box className="p-4 bg-gray-50 border-b border-gray-100 flex items-center">
                    <Avatar className="bg-gray-100 text-gray-600 mr-3">
                        <SwapHoriz />
                    </Avatar>
                    <Typography variant="h6" className="font-semibold text-gray-800">
                        Transaction History
                    </Typography>
                </Box>

                <TableContainer>
                    <Table aria-label="transaction history table">
                        <TableHead className="bg-gray-50">
                            <TableRow>
                                <TableCell width="40px"></TableCell>
                                <TableCell>
                                    <Box className="flex items-center">
                                        <CalendarToday fontSize="small" className="mr-1 text-gray-500" />
                                        Date
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box className="flex items-center">
                                        <Label fontSize="small" className="mr-1 text-gray-500" />
                                        Type
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box className="flex items-center">
                                        <Person fontSize="small" className="mr-1 text-gray-500" />
                                        Linked Account
                                    </Box>
                                </TableCell>
                                <TableCell align="right">Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.getTransactionHeights()
                                .map(height => data.getTransactionAtHeight(height))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((transaction, index) => (
                                    <TransactionRow
                                        key={`${transaction.getTimestamp()}-${index}`}
                                        transaction={transaction}
                                        isExpanded={expandedRow === `${transaction.getTimestamp()}-${index}`}
                                        onToggleExpand={() => toggleRowExpand(`${transaction.getTimestamp()}-${index}`)}
                                    />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.getNumberOfTransactions()}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </motion.div>
    );
}

function TransactionRow({
                            transaction,
                            isExpanded,
                            onToggleExpand
                        }: {
    transaction: Transaction;
    isExpanded: boolean;
    onToggleExpand: () => void;
}) {
    const isPositive = transaction.isPositive()
    const date = transaction.transferredAt();
    const linkedAccount = transaction.getLinkedAccount()

    // Format date nicely
    const formattedDate = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Format time separately
    const formattedTime = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <>
            <TableRow
                hover
                onClick={onToggleExpand}
                className="cursor-pointer transition-colors duration-200 hover:bg-gray-50"
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell>
                    <IconButton size="small" onClick={(e) => {
                        e.stopPropagation();
                        onToggleExpand();
                    }}>
                        {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" className="font-medium">
                        {formattedDate}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                        {formattedTime}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Chip
                        label={formatTransactionType(transaction)}
                        size="small"
                        className={isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                        icon={isPositive ? <ArrowUpward className="text-green-500" fontSize="small" /> : <ArrowDownward className="text-red-500" fontSize="small" />}
                    />
                </TableCell>
                <TableCell>
                    <Tooltip title={linkedAccount.encode()}>
                        <Typography variant="body2" className="max-w-[150px] truncate">
                            {linkedAccount.encode()}
                        </Typography>
                    </Tooltip>
                </TableCell>
                <TableCell align="right">
                    <Typography
                        variant="body2"
                        className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}
                    >
                        {transaction.getAmount().toString()}
                    </Typography>
                </TableCell>
            </TableRow>

            {/* Expanded details */}
            <TableRow>
                <TableCell style={{ padding: 0 }} colSpan={6}>
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Box className="p-4 bg-gray-50">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" className="text-gray-700">
                                                Transaction Details
                                            </Typography>
                                            <Box className="mt-2 space-y-2">
                                                <Box className="flex justify-between">
                                                    <Typography variant="body2" className="text-gray-600">Type:</Typography>
                                                    <Typography variant="body2" className="font-medium"></Typography>
                                                </Box>
                                                <Box className="flex justify-between">
                                                    <Typography variant="body2" className="text-gray-600">Date:</Typography>
                                                    <Typography variant="body2" className="font-medium">{date.toLocaleString()}</Typography>
                                                </Box>
                                                <Box className="flex justify-between">
                                                    <Typography variant="body2" className="text-gray-600">Amount:</Typography>
                                                    <Typography
                                                        variant="body2"
                                                        className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}
                                                    >
                                                        {transaction.getAmount().toString()}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" className="text-gray-700">
                                                Linked Account
                                            </Typography>
                                            <Box className="mt-2">
                                                <Typography variant="body2" className="break-all font-mono bg-gray-100 p-2 rounded">
                                                    {linkedAccount.encode()}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </TableCell>
            </TableRow>
        </>
    );
}

/**
 * Formats transaction type as a string.
 *
 * @param transaction The transaction to format.
 */
function formatTransactionType(transaction: Transaction) {
    if (transaction.isPurchase()) return "Purchase";
    if (transaction.isSale()) return "Sale";
    if (transaction.isEarnedFees()) return "Earned fees";
    if (transaction.isPaidFees()) return "Paid fees";
    if (transaction.isSentPayment()) return "Sent payment";
    if (transaction.isReceivedPayment()) return "Received payment";
    if (transaction.isSentIssuance()) return "Sent issuance"
    if (transaction.isReceivedIssuance()) return "Received issuance"
    return ""
}
