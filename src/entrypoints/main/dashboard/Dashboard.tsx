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
            <div className="flex items-center px-4 py-3 mx-2 rounded-lg">
                <div className="w-5 mr-3">
                    <SpinningWheel />
                </div>
                <Typography variant="body2" className="text-gray-600 font-medium">
                    Connecting...
                </Typography>
            </div>
        </Tooltip>
    );

    const tooltipMessage = success ?
        `Connected to node ${node}` :
        `Connection failure at ${node}`;

    const statusColor = success ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";
    const statusText = success ? "Connected" : "Connection Error";
    const statusBorder = success ? "border-green-100" : "border-red-100";

    return (
        <Tooltip title={tooltipMessage} placement="right">
            <motion.div
                className={`flex items-center px-4 py-3 mx-2 rounded-lg cursor-pointer border ${statusBorder} ${statusColor}`}
                onClick={sendPing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Badge 
                    color={success ? "success" : "error"} 
                    variant="dot" 
                    invisible={false}
                    className="mr-3"
                >
                    <NetworkCheck className="text-lg" />
                </Badge>
                <Typography variant="body2" className="font-medium">
                    {statusText}
                </Typography>
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
    const {data: balance, isLoading, error} = useOptimizedAccountBalance();
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
                <Box className="bg-linear-to-r from-blue-50 to-blue-100/30 rounded-xl border border-blue-100 p-8 shadow-sm">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Typography variant="h4" className="font-bold text-gray-800 mb-3">
                                Welcome, {activeAccount.pseudo}!
                            </Typography>
                            <Typography variant="body1" className="text-gray-600 mb-4">
                                Here's an overview of your Carmentis wallet activity and balance
                            </Typography>

                        </Grid>
                        <Grid item xs={12} md={4} className="flex justify-end">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-200 rounded-full blur-md opacity-30"></div>
                                <Avatar
                                    className="bg-blue-50 text-blue-600 w-20 h-20 text-3xl font-bold border-2 border-blue-100 relative shadow-md"
                                    sx={{ width: 80, height: 80 }}
                                >
                                    {activeAccount?.pseudo?.charAt(0) || ''}
                                </Avatar>
                            </div>
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
                            icon={<AccountBalance className="text-blue-500" />}
                            value={isLoading ? <Skeleton height={40} width={120} /> :
                                balance ?  balance.toString() : "--" }
                            subtitle="Your current token balance"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <StatsCard
                            title="Activities"
                            icon={<BarChart className="text-blue-500" />}
                            value={numberVb.loading ? <Skeleton height={40} width={80} /> :
                                numberVb.error || typeof numberVb.value !== 'number' ? "--" : numberVb.value}
                            subtitle="Total blockchain activities"
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
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <QuickActionCard
                            title="View Activity"
                            icon={<Storage />}
                            description="Check your recent blockchain activity"
                            link="/activity"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
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

/**
 * Stats card component for displaying metrics
 */
function StatsCard({ title, icon, value, subtitle, color = "blue" }) {
    // Always use blue for consistency with onboarding style
    const iconClass = "bg-blue-50 text-blue-600";

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.2 } }}
            className="h-full"
        >
            <Card className="border border-gray-100 h-full overflow-hidden rounded-xl shadow-sm">
                <CardContent className="p-6">
                    <Box display="flex" alignItems="center" mb={3}>
                        <Box className={`p-2.5 rounded-full mr-3 ${iconClass} border border-blue-100`}>
                            {icon}
                        </Box>
                        <Typography variant="h6" className="font-medium text-gray-700">
                            {title}
                        </Typography>
                    </Box>

                    <Box className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-3">
                        <Typography variant="h4" className="font-bold text-gray-800">
                            {value}
                        </Typography>
                    </Box>

                    <Typography variant="body2" className="text-gray-500">
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

    // Always use blue for consistency with onboarding style
    const iconClass = "bg-blue-50 text-blue-600";

    return (
        <motion.div
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(link)}
            className="cursor-pointer h-full"
        >
            <Card className="border border-gray-100 h-full overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200">
                <CardContent className="p-6">
                    <Box className={`p-3 rounded-full w-fit mb-4 ${iconClass} border border-blue-100`}>
                        {icon}
                    </Box>

                    <Typography variant="h6" className="font-semibold text-gray-800 mb-2">
                        {title}
                    </Typography>

                    <Typography variant="body2" className="text-gray-500 mb-4">
                        {description}
                    </Typography>

                    <Button 
                        variant="outlined" 
                        size="small" 
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 normal-case"
                        endIcon={<ArrowForward fontSize="small" />}
                    >
                        Get Started
                    </Button>
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
            link: 'https://docs.carmentis.io'
        },
        {
            title: 'Blockchain Explorer',
            icon: <Search />,
            description: "Explore the Carmentis blockchain",
            link: explorerUrl
        },
        {
            title: 'Token Exchange',
            icon: <AddCard />,
            description: "Purchase Carmentis tokens",
            link: exchangeLink
        },
        {
            title: 'Proof Checker',
            icon: <CheckCircle />,
            description: "Verify blockchain proofs",
            link: `${explorerUrl}/proofChecker`
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
    // Always use blue for consistency with onboarding style
    const iconClass = "bg-blue-50 text-blue-600";

    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -5, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.97 }}
            className="h-full cursor-pointer"
            onClick={onClick}
        >
            <Card className="border border-gray-100 h-full overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200">
                <CardContent className="p-5 flex flex-col items-center text-center">
                    <Box className={`p-3 rounded-full mb-3 ${iconClass} border border-blue-100`}>
                        {icon}
                    </Box>

                    <Typography variant="h6" className="font-semibold text-gray-800 mb-2">
                        {title}
                    </Typography>

                    <Typography variant="body2" className="text-gray-500 mb-3">
                        {description}
                    </Typography>

                    <Chip
                        label="Open External Link"
                        size="small"
                        className="mt-auto bg-blue-50 border border-blue-200 text-blue-600"
                        clickable
                        icon={<ArrowForward fontSize="small" />}
                    />
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default Dashboard;
