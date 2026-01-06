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

import {useOptimizedAccountBalance} from "@/hooks/useOptimizedAccountBalance.tsx";
import {useAuthenticatedAccount} from "@/hooks/useAuthenticatedAccount.tsx";
import NoTokenAccount from "@/components/shared/NoTokenAccount.tsx";
import {motion} from "framer-motion";
import {Avatar, Box, CardContent, Paper, Typography} from "@mui/material";
import {AccountBalance} from "@mui/icons-material";
import Skeleton from "react-loading-skeleton";
import React from "react";
import {useAccountBalanceBreakdown} from "@/hooks/useAccountBalanceBreakdown.tsx";

export function BalanceCard() {
    const balanceBreakdownResponse = useAccountBalanceBreakdown();
    const activeAccount = useAuthenticatedAccount();

    // Animation variants
    const cardVariants = {
        hidden: {opacity: 0, y: 20},
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

    if (balanceBreakdownResponse.breakdownLoadingError) {
        return <NoTokenAccount/>
    }


    return (
        <motion.div variants={cardVariants}>
            <Paper elevation={0} className="border border-gray-100 rounded-lg overflow-hidden h-full">
                <Box className="p-4 bg-green-50 border-b border-gray-100 flex items-center">
                    <Avatar className="bg-green-100 text-green-600 mr-3">
                        <AccountBalance/>
                    </Avatar>
                    <Typography variant="h6" className="font-semibold text-gray-800">
                        Current Balance
                    </Typography>
                </Box>

                <CardContent className="p-6 flex flex-col items-center justify-center">
                    {balanceBreakdownResponse.isLoadingBreakdown ? (
                        <Skeleton height={60} width={200}/>
                    ) : (
                        <>
                            <Typography variant="h3" className="font-bold text-gray-800 mb-2">
                                {balanceBreakdownResponse.breakdown?.getBalance().toString()}
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