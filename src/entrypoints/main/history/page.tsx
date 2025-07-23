import {Avatar, Box, Grid, Typography} from '@mui/material';
import React from 'react';
import NoTokenAccount from '@/components/NoTokenAccount.tsx';
import {Splashscreen} from "@/components/Splashscreen.tsx";
import {motion} from "framer-motion";
import {History as HistoryIcon} from "@mui/icons-material";
import {useOptimizedAccountBalance} from "@/hooks/useOptimizedAccountBalance.tsx";
import {TransactionHistory} from "@/entrypoints/main/history/TransactionHistory.tsx";
import {BalanceCard} from "@/entrypoints/main/history/BalanceCard.tsx";

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

