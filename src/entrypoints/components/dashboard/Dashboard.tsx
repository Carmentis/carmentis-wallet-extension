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
import '../../main/global.css';

import { Route, Routes, useNavigate } from 'react-router';
import Parameters from '@/entrypoints/components/dashboard/Parameters.tsx';
import { DropdownAccountSelection } from '@/entrypoints/components/dashboard/DropdownAccountSelection.tsx';
import Skeleton from 'react-loading-skeleton';
import * as sdk from '@cmts-dev/carmentis-sdk/client';
import { motion, AnimatePresence } from "framer-motion";
import 'react-loading-skeleton/dist/skeleton.css';
import {
    activeAccountState,
    nodeEndpointState,
    useAuthenticatedAccount,
    useAuthenticationContext,
    useWallet, walletState,
} from '@/entrypoints/contexts/authentication.context.tsx';
import { NavbarSidebarLayout } from '@/entrypoints/components/layout/navbar-sidebar.layout.tsx';
import { SidebarItem } from '@/entrypoints/components/layout/sidebar-components.tsx';
import HistoryPage from '@/entrypoints/main/history/page.tsx';
import { useAccountBalanceHook } from '@/entrypoints/components/hooks/sdk.hook.tsx';
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
import { SpinningWheel } from '@/entrypoints/components/SpinningWheel.tsx';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
//import TokenTransferPage from '@/entrypoints/main/transfer/page.tsx';
import { AccountDataStorage } from "@/utils/db/account-data-storage.ts";
import NotificationRightBar from "@/entrypoints/components/NotificationRightBar.tsx";
import { useMainInterfaceActions } from "@/entrypoints/states/main-interface.state.tsx";
import { useApplicationNotificationHook } from "@/entrypoints/states/application-nofications.state.tsx";
import { getUserKeyPair } from "@/entrypoints/main/wallet.tsx";
import ActivityPage from "@/entrypoints/components/dashboard/Activity.tsx";
import VirtualBlockchainViewer from "@/entrypoints/components/dashboard/VirtualBlockchainViewer.tsx";
import ProofChecker from "@/entrypoints/components/dashboard/ProofChecker.tsx";
import { useAsync, useAsyncFn } from "react-use";
import { DashboardNavbar } from "@/entrypoints/components/dashboard/DashboardNavbar.tsx";
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
import TokenTransferPage from "@/entrypoints/components/dashboard/TokenTransfer.tsx";

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
        <NavbarSidebarLayout
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
        </NavbarSidebarLayout>
    );
}

/**
 * Sidebar component for the dashboard with navigation items
 */
function DashboardSidebar() {
    return (
        <motion.div
            className="flex flex-col h-full py-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, staggerChildren: 0.05 }}
        >
            <SidebarItem icon={<Home />} text={'Home'} activeRegex={/\/$/} link={'/'} />
            <SidebarItem icon={<Storage />} text={'Activity'} activeRegex={/activity/} link={'/activity'} />
            <SidebarItem icon={<SwapHoriz />} text={'Token transfer'} activeRegex={/transfer$/} link={'/transfer'} />
            <SidebarItem icon={<History />} text={'History'} activeRegex={/history$/} link={'/history'} />
            <SidebarItem icon={<CheckCircle />} text={'Proof checker'} activeRegex={/proofChecker/} link={'/proofChecker'} />
            <SidebarItem icon={<Settings />} text={'Parameters'} activeRegex={/parameters$/} link={'/parameters'} />

            <div className="mt-auto">
                <NodeConnectionStatusSidebarItem />
            </div>
        </motion.div>
    );
}

/**
 * Node connection status indicator for the sidebar
 */
function NodeConnectionStatusSidebarItem() {
    const [loaded, setLoaded] = useState(true);
    const [success, setSuccess] = useState(false);
    const node = useRecoilValue(nodeEndpointState);

    async function sendPing() {
        if (!node) return
        setLoaded(true);
        console.log(`Contacting ${node}`)
        axios.get(node)
            .then(() => setSuccess(true))
            .catch((error) => {
                console.log(error)
                setSuccess(false)
            })
            .finally(() => setLoaded(false))
    }

    useEffect(() => {
        sendPing()
    }, [node]);

    if (loaded) return (
        <Tooltip title={`Connecting to ${node}...`} placement="right">
            <div className="flex w-full justify-center items-center h-11 px-3 py-2">
                <div className="w-5">
                    <SpinningWheel />
                </div>
            </div>
        </Tooltip>
    );

    const tooltipMessage = success ?
        `Connected to node ${node}` :
        `Connection failure at ${node}`;

    return (
        <Tooltip title={tooltipMessage} placement="right">
            <motion.div
                className="flex w-full justify-center items-center h-11 px-3 py-2 cursor-pointer"
                onClick={sendPing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Badge color={success ? "success" : "error"} variant="dot" invisible={false}>
                    <NetworkCheck className="text-lg" />
                </Badge>
            </motion.div>
        </Tooltip>
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
    const balance = useAccountBalanceHook();
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
            <motion.div variants={itemVariants} className="mb-8">
                <Box className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Typography variant="h4" className="font-bold text-gray-800 mb-2">
                                Welcome, {activeAccount.firstname}!
                            </Typography>
                            <Typography variant="body1" className="text-gray-600">
                                Here's an overview of your Carmentis wallet activity and balance
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} className="flex justify-end">
                            <Avatar
                                className="bg-green-100 text-green-600 w-16 h-16 text-2xl font-bold"
                                sx={{ width: 64, height: 64 }}
                            >
                                {activeAccount?.firstname?.charAt(0) || ''}
                                {activeAccount?.lastname?.charAt(0) || ''}
                            </Avatar>
                        </Grid>
                    </Grid>
                </Box>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <StatsCard
                            title="Balance"
                            icon={<AccountBalance className="text-green-500" />}
                            value={balance.isLoading ? <Skeleton height={40} width={120} /> :
                                balance.error || typeof balance.data !== 'number' ? "--" : `${balance.data} CMTS`}
                            subtitle="Your current token balance"
                            color="green"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <StatsCard
                            title="Activities"
                            icon={<BarChart className="text-blue-500" />}
                            value={numberVb.loading ? <Skeleton height={40} width={80} /> :
                                numberVb.error || typeof numberVb.value !== 'number' ? "--" : numberVb.value}
                            subtitle="Total blockchain activities"
                            color="blue"
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
                    <Grid item xs={12} md={4}>
                        <QuickActionCard
                            title="Transfer Tokens"
                            icon={<SwapHoriz />}
                            description="Send tokens to another account"
                            link="/transfer"
                            color="purple"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <QuickActionCard
                            title="View Activity"
                            icon={<Storage />}
                            description="Check your recent blockchain activity"
                            link="/activity"
                            color="blue"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <QuickActionCard
                            title="Account Settings"
                            icon={<Settings />}
                            description="Manage your account preferences"
                            link="/parameters"
                            color="green"
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

/**
 * Stats card component for displaying metrics
 */
function StatsCard({ title, icon, value, subtitle, color = "blue" }) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-700",
        green: "bg-green-50 text-green-700",
        purple: "bg-purple-50 text-purple-700",
        orange: "bg-orange-50 text-orange-700",
    };

    return (
        <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="h-full"
        >
            <Card className="border border-gray-100 shadow-sm h-full overflow-hidden">
                <CardContent className="p-6">
                    <Box display="flex" alignItems="center" mb={2}>
                        <Box className={`p-2 rounded-full mr-3 ${colorClasses[color]}`}>
                            {icon}
                        </Box>
                        <Typography variant="h6" className="font-medium text-gray-700">
                            {title}
                        </Typography>
                    </Box>

                    <Typography variant="h4" className="font-bold text-gray-800 mb-1">
                        {value}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
}

/**
 * Quick action card component for navigation
 */
function QuickActionCard({ title, icon, description, link, color = "blue" }) {
    const navigate = useNavigate();

    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
        green: "bg-green-50 text-green-600 hover:bg-green-100",
        purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
        orange: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(link)}
            className="cursor-pointer h-full"
        >
            <Card className="border border-gray-100 shadow-sm h-full overflow-hidden">
                <CardContent className="p-5">
                    <Box className={`p-2 rounded-full w-fit mb-3 ${colorClasses[color]}`}>
                        {icon}
                    </Box>

                    <Typography variant="h6" className="font-semibold text-gray-800 mb-1">
                        {title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" className="mb-3">
                        {description}
                    </Typography>

                    <Box display="flex" alignItems="center" className="text-sm font-medium text-blue-600">
                        Get Started <ArrowForward fontSize="small" className="ml-1" />
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
}

/**
 * Resources section with external links
 */
function ResourcesSection() {
    const navigate = useNavigate();
    const wallet = useWallet();
    const explorerUrl = wallet.explorerEndpoint;
    const open = (link: string) => window.open(link, "_blank");

    const isBeta = typeof explorerUrl === 'string' && explorerUrl.includes("beta");
    const exchangeLink = isBeta ? "https://exchange.beta.carmentis.io" : "https://exchange.alpha.carmentis.io";

    const resources = [
        {
            title: 'Documentation',
            icon: <MenuBook />,
            description: "Read the official Carmentis documentation",
            link: 'https://docs.carmentis.io',
            color: "blue"
        },
        {
            title: 'Blockchain Explorer',
            icon: <Search />,
            description: "Explore the Carmentis blockchain",
            link: explorerUrl,
            color: "purple"
        },
        {
            title: 'Token Exchange',
            icon: <AddCard />,
            description: "Purchase Carmentis tokens",
            link: exchangeLink,
            color: "green"
        },
        {
            title: 'Proof Checker',
            icon: <CheckCircle />,
            description: "Verify blockchain proofs",
            link: `${explorerUrl}/proofChecker`,
            color: "orange"
        }
    ];

    return (
        <Grid container spacing={3}>
            {resources.map((resource, index) => (
                <Grid item xs={12} md={6} lg={3} key={resource.title}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <ResourceCard
                            title={resource.title}
                            icon={resource.icon}
                            description={resource.description}
                            onClick={() => open(resource.link)}
                            color={resource.color}
                        />
                    </motion.div>
                </Grid>
            ))}
        </Grid>
    );
}

/**
 * Resource card component for external resources
 */
function ResourceCard({ title, icon, description, onClick, color = "blue" }) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
    };

    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.97 }}
            className="h-full cursor-pointer"
            onClick={onClick}
        >
            <Card className="border border-gray-100 shadow-sm h-full overflow-hidden">
                <CardContent className="p-4 flex flex-col items-center text-center">
                    <Box className={`p-2 rounded-full mb-3 ${colorClasses[color]}`}>
                        {icon}
                    </Box>

                    <Typography variant="h6" className="font-semibold text-gray-800 mb-1">
                        {title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" className="mb-2">
                        {description}
                    </Typography>

                    <Chip
                        label="Open"
                        size="small"
                        className="mt-auto"
                        clickable
                        color="primary"
                        variant="outlined"
                    />
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default Dashboard;
