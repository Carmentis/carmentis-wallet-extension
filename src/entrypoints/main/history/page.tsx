import {Grid, Paper, Typography} from '@mui/material';
import React from 'react';
import NoTokenAccount from '@/components/shared/NoTokenAccount.tsx';
import {Splashscreen} from "@/components/shared/Splashscreen.tsx";
import {motion} from "framer-motion";
import {TransactionHistory} from "@/entrypoints/main/history/TransactionHistory.tsx";
import {BalanceAvailability, CMTSToken} from "@cmts-dev/carmentis-sdk/client";
import {useAccountBalanceBreakdown} from "@/hooks/useAccountBalanceBreakdown.tsx";
import {PageHeader} from "@/components/shared/PageHeader.tsx";

export default function HistoryPage() {
    const balanceResponse = useAccountBalanceBreakdown()

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

    if (balanceResponse.isLoadingBreakdown) return <Splashscreen />
    if (balanceResponse.breakdownLoadingError) {
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
            <PageHeader
                title="Transaction History"
                subtitle="View your account balance and transaction history"
            />

            {/* Token Cards */}
            <motion.div variants={itemVariants}>
                <Grid container spacing={4} className="mb-6">
                    <TokenCards breakdown={balanceResponse.breakdown} />
                </Grid>
            </motion.div>

            {/* Transaction History */}
            <motion.div variants={itemVariants}>
                <TransactionHistory />
            </motion.div>
        </motion.div>
    );
}

function TokenCards(input: { breakdown: BalanceAvailability }) {
    const breakdown = input.breakdown.getBreakdown();

    const tokens = [
        { label: 'Spendable', amount: breakdown.spendable },
        { label: 'Staked', amount: breakdown.staked },
        { label: 'Vested', amount: breakdown.vested },
    ];

    return (
        <>
            {tokens.map(({ label, amount }) => (
                <Grid item xs={12} sm={4} key={label}>
                    <Paper elevation={0} className="border border-gray-200 rounded-lg p-6">
                        <Typography variant="body2" className="text-gray-500 mb-2">
                            {label}
                        </Typography>
                        <Typography variant="h5" className="font-semibold text-gray-900">
                            {CMTSToken.createAtomic(amount).toString()}
                        </Typography>
                    </Paper>
                </Grid>
            ))}
        </>
    );
}

