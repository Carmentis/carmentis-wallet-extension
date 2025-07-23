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

import React, {useState} from "react";
import {useAccountTransactionHistoryHook} from "@/hooks/useAccountTransactionHistoryHook.tsx";
import {
    Avatar,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import Skeleton from "react-loading-skeleton";
import {motion} from "framer-motion";
import {CalendarToday, Label, Person, SwapHoriz} from "@mui/icons-material";
import {TransactionRow} from "@/entrypoints/main/history/TransactionRow.tsx";

const INITIAL_MAX_ENTRIES = 10;

export function TransactionHistory() {
    const [maxEntries, setMaxEntries] = useState(INITIAL_MAX_ENTRIES);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(INITIAL_MAX_ENTRIES);
    const {data, isLoading, error} = useAccountTransactionHistoryHook(0, maxEntries);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    // Animation variants
    const tableVariants = {
        hidden: {opacity: 0, y: 20},
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
                <Skeleton height={400}/>
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
                    Reason: {error.message}
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
                        <SwapHoriz/>
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
                                        <CalendarToday fontSize="small" className="mr-1 text-gray-500"/>
                                        Date
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box className="flex items-center">
                                        <Label fontSize="small" className="mr-1 text-gray-500"/>
                                        Type
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box className="flex items-center">
                                        <Person fontSize="small" className="mr-1 text-gray-500"/>
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

