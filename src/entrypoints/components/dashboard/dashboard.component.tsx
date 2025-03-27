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

import React, {ReactElement, useEffect, useState} from 'react';
import '../../main/global.css';

import {Route, Routes, useNavigate} from 'react-router';
import Parameters from '@/entrypoints/components/dashboard/parameters.component.tsx';
import {DropdownAccountSelection} from '@/entrypoints/components/dashboard/dropdown-account-selection.component.tsx';
import Skeleton from 'react-loading-skeleton';
import * as sdk from '@cmts-dev/carmentis-sdk/client';

import 'react-loading-skeleton/dist/skeleton.css';
import {
	activeAccountState,
	nodeEndpointState,
	useAuthenticatedAccount,
	useAuthenticationContext,
	useWallet, walletState,
} from '@/entrypoints/contexts/authentication.context.tsx';
import {NavbarSidebarLayout} from '@/entrypoints/components/layout/navbar-sidebar.layout.tsx';
import {SidebarItem} from '@/entrypoints/components/layout/sidebar-components.tsx';
import HistoryPage from '@/entrypoints/main/history/page.tsx';
import {useAccountBalanceHook} from '@/entrypoints/components/hooks/sdk.hook.tsx';
import {Badge, Box, Card, CardContent, CardHeader, Tooltip, Typography} from '@mui/material';
import {SpinningWheel} from '@/entrypoints/components/SpinningWheel.tsx';
import axios from 'axios';
import {useRecoilValue} from 'recoil';
import TokenTransferPage from '@/entrypoints/main/transfer/page.tsx';
import {AccountDataStorage} from "@/utils/db/account-data-storage.ts";
import NotificationRightBar from "@/entrypoints/components/notification-rightbar.component.tsx";
import {useMainInterfaceActions} from "@/entrypoints/states/main-interface.state.tsx";
import {useApplicationNotificationHook} from "@/entrypoints/states/application-nofications.state.tsx";
import {getUserKeyPair} from "@/entrypoints/main/wallet.tsx";
import {BlockViewer} from "@/entrypoints/components/popup/popup-event-approval.tsx";
import ActivityPage from "@/entrypoints/components/dashboard/activity.tsx";
import VirtualBlockchainViewer from "@/entrypoints/components/dashboard/virtual-blockchain-viewer.tsx";
import ProofChecker from "@/entrypoints/components/dashboard/proof-checker.tsx";
import {useAsync, useAsyncFn} from "react-use";
import {DashboardNavbar} from "@/entrypoints/components/dashboard/dashboard-navbar.tsx";
import {Checklist, Loop, MenuBook, Search} from "@mui/icons-material";
import {Boxes, Check2Square, GearFill} from "react-bootstrap-icons";

const EXPLORER_DOMAIN = "http://explorer.themis.carmentis.io"

/**
 * Renders a span element containing the provided text or a loading skeleton if the text is undefined.
 *
 * @param {Object} props - The properties object.
 * @param {string|number|undefined} props.text - The text to display inside the span. If undefined, a skeleton is displayed instead.
 * @return {JSX.Element} The rendered span element with the text or a skeleton loader.
 */
function SpanWithLoader({ text }: { text: string | number | undefined }) {
	if (text === undefined) return <Skeleton />;
	return <span>{text}</span>;
}

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
			<NotificationRightBar/>
		</NavbarSidebarLayout>
	);
}

function DashboardSidebar() {
	return <>
		<SidebarItem icon={'bi-house'} text={'Home'} activeRegex={/\/$/} link={'/'} />
		<SidebarItem icon={'bi-box-fill'} text={'Activity'} activeRegex={/activity/} link={'/activity'} />
		<SidebarItem icon={'bi-arrows'} text={'Token transfer'} activeRegex={/transfer$/} link={'/transfer'} />
		<SidebarItem icon={'bi-clock'} text={'History'} activeRegex={/history$/} link={'/history'} />
		<SidebarItem icon={'bi-check'} text={'Proof checker'} activeRegex={/proofChecker/} link={'/proofChecker'} />
		<SidebarItem icon={'bi-gear'} text={'Parameters'} activeRegex={/parameters$/} link={'/parameters'} />
		<NodeConnectionStatusSidebarItem/>
	</>;
}



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



	if (loaded) return <Tooltip title={`Connecting to ${node}...`} placement={"right"}>
		<div className={"flex w-full justify-center items-center h-11"}>
			<div className="w-5">
				<SpinningWheel/>
			</div>
		</div>
	</Tooltip>

	const tooltipMessage = success ?
		`Connected to node ${node}` :
		`Connection failure at ${node}`;
	return <Tooltip title={tooltipMessage} placement={"right"}>
		<div className={"flex w-full justify-center items-center h-11"} onClick={sendPing}>
			<Badge color={success ? "success" : "error"} variant="dot" invisible={false}>
				<i className={"bi bi-hdd-network text-lg"}></i>
			</Badge>
		</div>
	</Tooltip>
}




/**
 * Represents the home dashboard component of the application.
 * It includes welcome cards, email configuration notifications,
 * and a list of virtual blockchains for the active user account.
 *
 * This method utilizes the active user account information and
 * navigation functionality.
 *
 * @return {JSX.Element} The rendered dashboard home component including
 * welcome cards, notification card, and virtual blockchains list.
 */
function DashboardHome() {
	return <>
		<div className="container mx-auto px-4">
			<DashboardOverview/>
		</div>

	</>;
}


/**
 *
 * @constructor
 */
function DashboardOverview() {
	const activeAccount = useAuthenticatedAccount();
	const balance = useAccountBalanceHook();
	const numberVb = useAsync(async () => {
		const db = await  AccountDataStorage.connectDatabase(activeAccount);
		return db.getNumberOfApplicationVirtualBlockchainId();
	})

	function renderWelcomeTitle() {
		return <Typography variant={"h4"}>Welcome, {activeAccount.firstname}!</Typography>
	}


	function renderNumberOfApplicationsContent() {
		const title = "Number of activities"
		if (numberVb.loading) return <InfoCard title={title} value={<Skeleton/>}/>
		if (numberVb.error || typeof numberVb.value !== 'number') {
			console.error(numberVb.error)
			return <InfoCard title={title} value={"--"}/>
		}
		return <InfoCard title={title} value={numberVb.value}/>
	}

	function renderBalanceContent() {
		if (balance.isLoading) return <InfoCard title={"Balance"} value={<Skeleton/>}/>
		if (balance.error || typeof balance.data !== 'number') {
			return  <InfoCard title={"Balance"} value={"--"}/>
		}
		return <InfoCard title={"Balance"} value={`${balance.data} CMTS`}/>
	}
	





	return <Box display={"flex"} flexDirection={"column"} gap={2} pt={10}>
		<Box mb={4}>
			{renderWelcomeTitle()}
		</Box>
		<Box display="flex" flexWrap={"wrap"} gap={2}>
			{renderNumberOfApplicationsContent()}
			{renderBalanceContent()}
		</Box>

		<DashboardLinks/>
	</Box>
}


function InfoCard({title, value}: { title: string, value: string | number | JSX.Element }) {
	return (
		<Card className="flex-1">
			<CardContent className="flex flex-col items-start">
				<Typography  className="mb-2 text-gray-800">
					{title}
				</Typography>
				<Typography variant="h6" className="text-gray-900 font-semibold">
					{value}
				</Typography>
			</CardContent>
		</Card>
	);
}


function DashboardLinks() {
	const navigate = useNavigate();
	const wallet = useWallet();
	const explorerUrl = wallet.explorerEndpoint;
	const open = (link: string) => window.open(link, "_blank");

	const items = [
		{title: 'Documentation', icon: <MenuBook/>, description: "Read the documentation to get help.", onClick: () => open('https://docs.carmentis.io')},
		{title: 'Activity', icon: <MenuBook/>, description: "Check your activity.", onClick: () => navigate('/activity')},
		{title: 'Check Proof', icon: <Checklist/>, description: "Verify a proof", onClick: () => open(`${explorerUrl}/proofChecker`)},
		{title: 'Explorer', icon: <Search/>, description: "Explore the chain.", onClick: () => open(explorerUrl)},
		{title: 'Parameters', icon: <GearFill/>, description: "Change parameters of your wallet.", onClick: () => navigate("/parameters")},


	]

	return <Box display={"flex"} flexDirection={"column"} gap={2} mt={10}>
		<Typography variant={"h6"}>Useful Links</Typography>
		<Box display={"flex"} flexWrap={"wrap"} gap={2}>
			{items.map(i => <SmallInfoCard icon={i.icon} title={i.title} description={i.description} onClick={() => i.onClick()} />
			)}
		</Box>
	</Box>
}
function SmallInfoCard({icon, title, description, onClick}: {
	icon: JSX.Element,
	title: string,
	description: string,
	onClick: () => void
}) {
	return (
		<Card className="flex-1 cursor-pointer hover:shadow-lg transition-shadow min-w-72 w-72"
			  onClick={() => onClick()}>
			<CardContent className="flex flex-col items-center">
				<div className="mb-2 text-primary">
					{icon}
				</div>
				<Typography variant="h6" className="text-gray-900 font-semibold">
					{title}
				</Typography>
				<Typography variant="body2" className="text-gray-600 text-center">
					{description}
				</Typography>
			</CardContent>
		</Card>
	);
}

function AccountBalanceCard() {

	const {data, isLoading, error} = useAccountBalanceHook();


	if (isLoading) return <Card className={'flex-1'}>
		<CardContent className={'flex flex-col justify-center'}>
			<div className="h-full w-full">
				<i className={'bi bi-info-circle-fill text-lg'}></i>
			</div>
			<Skeleton/>
		</CardContent>
	</Card>

	if (error) return <Card className={'flex-1'}>
		<CardContent className={'flex flex-col justify-center'}>
			<div className="h-full w-full">
				<i className={'bi bi-info-circle-fill text-lg'}></i>
			</div>
			You not have token account yet.
		</CardContent>
	</Card>;

	return <Card className={'flex-1'}>
		<CardContent>
			<h3>Balance</h3>
			<SpanWithLoader text={data}></SpanWithLoader>
		</CardContent>
	</Card>
}

/**
 * Renders the dashboard welcome cards displaying an overview of metrics including balance, applications,
 * virtual blockchains, and spent gas. It fetches data related to the authenticated account from the indexed
 * storage and updates the state accordingly.
 *
 * @return {JSX.Element} A JSX element consisting of multiple cards for each metric, dynamically
 * updated based on retrieved data from the IndexedStorage database.
 */
function DashboardWelcomeCards() {


	return <div className="mb-5">
		<h3>Overview</h3>


		<div className="flex w-full flex-row space-x-4">
			<AccountBalanceCard />
		</div>
	</div>;
}



export default Dashboard;
