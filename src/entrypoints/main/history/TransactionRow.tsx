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

import {Transaction} from "@cmts-dev/carmentis-sdk/client";
import {Box, Chip, Grid, IconButton, TableCell, TableRow, Tooltip, Typography} from "@mui/material";
import {ArrowDownward, ArrowUpward, KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import {AnimatePresence, motion} from "framer-motion";
import React from "react";

export function TransactionRow({
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
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
            >
                <TableCell>
                    <IconButton size="small" onClick={(e) => {
                        e.stopPropagation();
                        onToggleExpand();
                    }}>
                        {isExpanded ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
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
                        icon={isPositive ? <ArrowUpward className="text-green-500" fontSize="small"/> :
                            <ArrowDownward className="text-red-500" fontSize="small"/>}
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
                <TableCell style={{padding: 0}} colSpan={6}>
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{opacity: 0, height: 0}}
                                animate={{opacity: 1, height: 'auto'}}
                                exit={{opacity: 0, height: 0}}
                                transition={{duration: 0.3}}
                            >
                                <Box className="p-4 bg-gray-50">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" className="text-gray-700">
                                                Transaction Details
                                            </Typography>
                                            <Box className="mt-2 space-y-2">
                                                <Box className="flex justify-between">
                                                    <Typography variant="body2"
                                                                className="text-gray-600">Type:</Typography>
                                                    <Typography variant="body2" className="font-medium"></Typography>
                                                </Box>
                                                <Box className="flex justify-between">
                                                    <Typography variant="body2"
                                                                className="text-gray-600">Date:</Typography>
                                                    <Typography variant="body2"
                                                                className="font-medium">{date.toLocaleString()}</Typography>
                                                </Box>
                                                <Box className="flex justify-between">
                                                    <Typography variant="body2"
                                                                className="text-gray-600">Amount:</Typography>
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
                                                <Typography variant="body2"
                                                            className="break-all font-mono bg-gray-100 p-2 rounded">
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