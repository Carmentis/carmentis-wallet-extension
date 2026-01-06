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

import React, { ReactElement, useEffect, useState } from 'react';
import '../global.css';

import { Route, Routes, useNavigate } from 'react-router';
import Parameters from '@/entrypoints/main/parameters/Parameters.tsx';
import { DropdownAccountSelection } from '@/components/shared/DropdownAccountSelection.tsx';
import Skeleton from 'react-loading-skeleton';
import { motion, AnimatePresence } from "framer-motion";
import 'react-loading-skeleton/dist/skeleton.css';
import HistoryPage from '@/entrypoints/main/history/page.tsx';
import {
    Badge,
    Box,
    Card,
    CardContent,
    CardHeader,
    Tooltip,
    Typography,
    Grid,
    Divider,
    Avatar,
    Button,
    Chip
} from '@mui/material';
import { SpinningWheel } from '@/components/shared/SpinningWheel.tsx';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
//import TokenTransferPage from '@/entrypoints/main/transfer/page.tsx';
import NotificationRightBar from "@/entrypoints/main/dashboard/NotificationRightBar.tsx";
import { getUserKeyPair } from "@/entrypoints/main/wallet.tsx";
import ActivityPage from "@/entrypoints/main/activity/Activity.tsx";
import VirtualBlockchainViewer from "@/entrypoints/main/activity/VirtualBlockchainViewer.tsx";
import ProofChecker from "@/entrypoints/main/proofChecker/ProofChecker.tsx";
import { useAsync, useAsyncFn } from "react-use";
import { DashboardNavbar } from "@/entrypoints/main/dashboard/DashboardNavbar.tsx";
import {
    AddCard,
    Checklist,
    Home,
    MenuBook,
    Search,
    History,
    SwapHoriz,
    Settings,
    Storage,
    CheckCircle,
    NetworkCheck,
    Wallet,
    TrendingUp,
    Notifications,
    ArrowForward,
    BarChart,
    AccountBalance
} from "@mui/icons-material";
import TokenTransferPage from "@/entrypoints/main/transfer/TokenTransfer.tsx";
import {useOptimizedAccountBalance} from "@/hooks/useOptimizedAccountBalance.tsx";
import {AccountDataStorage} from "@/utils/db/AccountDataStorage.ts";
import {activeAccountState, nodeEndpointState, walletState} from "@/states/globals.tsx";
import {useWallet} from "@/hooks/useWallet.tsx";
import {useAuthenticatedAccount} from "@/hooks/useAuthenticatedAccount.tsx";
import {useAuthenticationContext} from "@/hooks/useAuthenticationContext.tsx";
import {useMainInterfaceActions} from "@/hooks/useMainInterfaceAction.tsx";
import {useApplicationNotification} from "@/hooks/useApplicationNotification.tsx";
import {DashboardLayout} from "@/entrypoints/main/dashboard/DashboardLayout.tsx";
import {SidebarItem} from "@/entrypoints/main/dashboard/SidebarItem.tsx";
import {ResourcesSection} from "@/entrypoints/main/dashboard/components/ResourcesSection.tsx";
import {QuickActionCard} from "@/entrypoints/main/dashboard/components/QuickActionCard.tsx";
import {
    NodeConnectionStatusSidebarItem
} from "@/entrypoints/main/dashboard/components/NodeConnectionStatusSidebarItem.tsx";
import {StatsCard} from "@/entrypoints/main/dashboard/components/StatsCard.tsx";
import {useAccountBalanceBreakdown} from "@/hooks/useAccountBalanceBreakdown.tsx";
import {CMTSToken} from "@cmts-dev/carmentis-sdk/client";

const EXPLORER_DOMAIN = "http://explorer.themis.carmentis.io"

/**
 * A React component that renders the main dashboard interface.
 * It includes the navigation bar and sets up routing for different
 * dashboard sections.
 *
 * @return {ReactElement} The rendered dashboard component containing a navbar and routed sections.
 */
export function Dashboard(): ReactElement {
    // load the authentication context
    const wallet = useWallet();

    return (
        <DashboardLayout
            navbar={<DashboardNavbar />}
            sidebar={<DashboardSidebar />}
        >
            <Routes>
                <Route
                    path="/"
                    element={
                        <DashboardHome key={wallet.activeAccountId} />
                    }
                />
                <Route
                    path="/activity"
                    element={<ActivityPage />}
                />
                <Route
                    path="/activity/:hash"
                    element={<VirtualBlockchainViewer />}
                />
                <Route
                    path="/proofChecker"
                    element={<ProofChecker />}
                />
                <Route
                    path="/transfer"
                    element={<TokenTransferPage />}
                />
                <Route
                    path="/history"
                    element={<HistoryPage />}
                />
                <Route
                    path="/parameters"
                    element={<Parameters />}
                />
            </Routes>
            <NotificationRightBar />
        </DashboardLayout>
    );
}

/**
 * Sidebar component for the dashboard with navigation items
 */
function DashboardSidebar() {
    return (
        <motion.div
            className="flex flex-col h-full py-6 bg-white border-r border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, staggerChildren: 0.05 }}
        >


            <SidebarItem icon={<Home />} text={'Home'} activeRegex={/\/$/} link={'/'} />
            <SidebarItem icon={<Storage />} text={'Activity'} activeRegex={/activity/} link={'/activity'} />
            <SidebarItem icon={<SwapHoriz />} text={'Token Transfer'} activeRegex={/transfer$/} link={'/transfer'} />
            <SidebarItem icon={<History />} text={'History'} activeRegex={/history$/} link={'/history'} />

            <SidebarItem icon={<CheckCircle />} text={'Proof Checker'} activeRegex={/proofChecker/} link={'/proofChecker'} />
            <SidebarItem icon={<Settings />} text={'Parameters'} activeRegex={/parameters$/} link={'/parameters'} />

            <div className="mt-auto border-t border-gray-100 pt-4">
                <NodeConnectionStatusSidebarItem />
            </div>
        </motion.div>
    );
}


/**
 * Main dashboard home component
 */
function DashboardHome() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto"
        >
            <DashboardOverview />
        </motion.div>
    );
}

/**
 * Dashboard overview component showing user information and metrics
 */
function DashboardOverview() {
    const activeAccount = useAuthenticatedAccount();
    const balanceBreakdownResponse = useAccountBalanceBreakdown();
    const numberVb = useAsync(async () => {
        const db = await AccountDataStorage.connectDatabase(activeAccount);
        return db.getNumberOfApplicationVirtualBlockchainId();
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
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* Welcome Section */}
            <motion.div variants={itemVariants} className="mb-6">
                <Typography variant="h5" className="font-semibold text-gray-800 mb-1">
                    Welcome, {activeAccount.pseudo}
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                    Overview of your wallet
                </Typography>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants}>
                <Grid container spacing={3}>
                    <Grid size={4}>
                        <StatsCard
                            title="Spendable"
                            value={balanceBreakdownResponse.isLoadingBreakdown ? <Skeleton height={40} width={120} /> :
                                balanceBreakdownResponse.breakdown ? CMTSToken.createAtomic(balanceBreakdownResponse.breakdown.getBreakdown().spendable).toString() : "--" }
                            subtitle="Available"
                        />
                    </Grid>
                    <Grid size={4}>
                        <StatsCard
                            title="Staked"
                            value={balanceBreakdownResponse.isLoadingBreakdown ? <Skeleton height={40} width={120} /> :
                                balanceBreakdownResponse.breakdown ? CMTSToken.createAtomic(balanceBreakdownResponse.breakdown.getBreakdown().staked).toString() : "--" }
                            subtitle="Locked in staking"
                        />
                    </Grid>
                    <Grid size={4}>
                        <StatsCard
                            title="Vested"
                            value={balanceBreakdownResponse.isLoadingBreakdown ? <Skeleton height={40} width={120} /> :
                                balanceBreakdownResponse.breakdown ? CMTSToken.createAtomic(balanceBreakdownResponse.breakdown.getBreakdown().vested).toString() : "--" }
                            subtitle="Time-locked"
                        />
                    </Grid>
                </Grid>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
                <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                    Quick Actions
                </Typography>
                <Grid container spacing={3}>
                    <Grid size={4}>
                        <QuickActionCard
                            title="Transfer Tokens"
                            icon={<SwapHoriz />}
                            description="Send tokens to another account"
                            link="/transfer"
                        />
                    </Grid>
                    <Grid size={4}>
                        <QuickActionCard
                            title="View Activity"
                            icon={<Storage />}
                            description="Check your recent blockchain activity"
                            link="/activity"
                        />
                    </Grid>
                    <Grid size={4}>
                        <QuickActionCard
                            title="Account Settings"
                            icon={<Settings />}
                            description="Manage your account preferences"
                            link="/parameters"
                        />
                    </Grid>
                </Grid>
            </motion.div>

            {/* Resources Section */}
            <motion.div variants={itemVariants}>
                <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                    Resources & Tools
                </Typography>
                <ResourcesSection />
            </motion.div>
        </motion.div>
    );
}




export default Dashboard;
