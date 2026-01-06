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

import React, { ReactElement } from 'react';
import '../global.css';

import { Route, Routes, useNavigate } from 'react-router';
import Parameters from '@/entrypoints/main/parameters/Parameters.tsx';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import HistoryPage from '@/entrypoints/main/history/page.tsx';
import NotificationRightBar from "@/entrypoints/main/dashboard/NotificationRightBar.tsx";
import ActivityPage from "@/entrypoints/main/activity/Activity.tsx";
import VirtualBlockchainViewer from "@/entrypoints/main/activity/VirtualBlockchainViewer.tsx";
import ProofChecker from "@/entrypoints/main/proofChecker/ProofChecker.tsx";
import { DashboardNavbar } from "@/entrypoints/main/dashboard/DashboardNavbar.tsx";
import {
    Dashboard as DashboardIcon,
    Receipt,
    Send,
    Settings,
    Widgets,
    VerifiedUser
} from "@mui/icons-material";
import TokenTransferPage from "@/entrypoints/main/transfer/TokenTransfer.tsx";
import {useWallet} from "@/hooks/useWallet.tsx";
import {useAuthenticatedAccount} from "@/hooks/useAuthenticatedAccount.tsx";
import {DashboardLayout} from "@/entrypoints/main/dashboard/DashboardLayout.tsx";
import {SidebarItem} from "@/entrypoints/main/dashboard/SidebarItem.tsx";
import {
    NodeConnectionStatusSidebarItem
} from "@/entrypoints/main/dashboard/components/NodeConnectionStatusSidebarItem.tsx";
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
        <div className="flex flex-col h-full py-4 bg-white">
            <div className="flex-1 space-y-1">
                <SidebarItem icon={<DashboardIcon />} text={'Home'} activeRegex={/\/$/} link={'/'} />
                <SidebarItem icon={<Send />} text={'Transfer'} activeRegex={/transfer$/} link={'/transfer'} />
                <SidebarItem icon={<Widgets />} text={'Activity'} activeRegex={/activity/} link={'/activity'} />
                <SidebarItem icon={<Receipt />} text={'History'} activeRegex={/history$/} link={'/history'} />
                <SidebarItem icon={<VerifiedUser />} text={'Proof Checker'} activeRegex={/proofChecker/} link={'/proofChecker'} />
            </div>
            <div className="border-t border-gray-200 pt-2">
                <SidebarItem icon={<Settings />} text={'Settings'} activeRegex={/parameters$/} link={'/parameters'} />
                <NodeConnectionStatusSidebarItem />
            </div>
        </div>
    );
}


/**
 * Main dashboard home component
 */
function DashboardHome() {
    return <DashboardOverview />;
}

/**
 * Dashboard overview component showing user information and metrics
 */
function DashboardOverview() {
    const activeAccount = useAuthenticatedAccount();
    const balanceBreakdownResponse = useAccountBalanceBreakdown();

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                    {activeAccount.pseudo}
                </h1>
                <p className="text-sm text-gray-500">
                    Your wallet overview
                </p>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-3 gap-4">
                <BalanceCard
                    label="Spendable"
                    amount={balanceBreakdownResponse.isLoadingBreakdown ? null :
                        balanceBreakdownResponse.breakdown?.getBreakdown().spendable}
                    isLoading={balanceBreakdownResponse.isLoadingBreakdown}
                />
                <BalanceCard
                    label="Staked"
                    amount={balanceBreakdownResponse.isLoadingBreakdown ? null :
                        balanceBreakdownResponse.breakdown?.getBreakdown().staked}
                    isLoading={balanceBreakdownResponse.isLoadingBreakdown}
                />
                <BalanceCard
                    label="Vested"
                    amount={balanceBreakdownResponse.isLoadingBreakdown ? null :
                        balanceBreakdownResponse.breakdown?.getBreakdown().vested}
                    isLoading={balanceBreakdownResponse.isLoadingBreakdown}
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4">
                <ActionCard
                    icon={<Send />}
                    label="Transfer"
                    description="Send tokens to other accounts"
                    link="/transfer"
                />
                <ActionCard
                    icon={<Widgets />}
                    label="Activity"
                    description="View blockchain activity"
                    link="/activity"
                />
                <ActionCard
                    icon={<Receipt />}
                    label="History"
                    description="Track transaction history"
                    link="/history"
                />
            </div>
        </div>
    );
}

/**
 * Simple balance card
 */
function BalanceCard({ label, amount, isLoading }: { label: string, amount: number | undefined, isLoading: boolean }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="text-xs font-medium text-gray-500 mb-3">{label}</div>
            {isLoading ? (
                <Skeleton height={32} width={120} />
            ) : (
                <div className="text-2xl font-semibold text-gray-900 tracking-tight">
                    {amount !== undefined ? CMTSToken.createAtomic(amount).toString() : "--"}
                </div>
            )}
        </div>
    );
}

/**
 * Simple action card
 */
function ActionCard({ icon, label, description, link }: { icon: React.ReactElement, label: string, description: string, link: string }) {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => navigate(link)}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-left group"
        >
            <div className="text-gray-600 group-hover:text-blue-600 mb-3 flex items-center justify-center w-10 h-10 bg-gray-50 rounded-lg group-hover:bg-blue-100">
                {icon}
            </div>
            <div className="text-sm font-medium text-gray-900 mb-1">{label}</div>
            <div className="text-xs text-gray-500">{description}</div>
        </button>
    );
}




export default Dashboard;
