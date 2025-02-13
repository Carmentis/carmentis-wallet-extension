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


import 'react-loading-skeleton/dist/skeleton.css';
import {Formatter} from '@/entrypoints/main/Formatter.tsx';
import {VirtualBlockchainDetailComponent} from '@/entrypoints/components/dashboard/virtual-blockchain-detail.component.tsx';
import {VirtualBlockchainView} from '@/entrypoints/main/virtual-blockchain-view.tsx';
import {
	nodeEndpointState,
	useAuthenticatedAccount,
	useAuthenticationContext,
	useWallet,
} from '@/entrypoints/contexts/authentication.context.tsx';
import {NavbarSidebarLayout} from '@/entrypoints/components/layout/navbar-sidebar.layout.tsx';
import {SidebarItem} from '@/entrypoints/components/layout/sidebar-components.tsx';
import HistoryPage from '@/entrypoints/main/history/page.tsx';
import {useAccountBalanceHook} from '@/entrypoints/components/hooks/sdk.hook.tsx';
import {Badge, Card, CardContent, Tooltip, Typography} from '@mui/material';
import {SpinningWheel} from '@/entrypoints/components/SpinningWheel.tsx';
import axios from 'axios';
import {useRecoilValue} from 'recoil';
import TokenTransferPage from '@/entrypoints/main/transfer/page.tsx';
import {AccountDataStorage} from "@/utils/db/account-data-storage.ts";
import NotificationRightBar from "@/entrypoints/components/notification-rightbar.component.tsx";
import {useMainInterfaceActions} from "@/entrypoints/states/main-interface.state.tsx";
import {useApplicationNotificationHook} from "@/entrypoints/states/application-nofications.state.tsx";

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
	console.log("dashboard wallet?", wallet)

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
		<SidebarItem icon={'bi-arrows'} text={'Token transfer'} activeRegex={/transfer$/} link={'/transfer'} />
		<SidebarItem icon={'bi-clock'} text={'History'} activeRegex={/history$/} link={'/history'} />
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
 * Renders the navigation bar for the dashboard including account selection,
 * navigation menu, and relevant user actions such as accessing parameters, logging out, and help documentation.
 *
 * @return {JSX.Element} The Dashboard navigation bar component, enabling user interaction for menu toggle, navigation, and actions.
 */
function DashboardNavbar() {
	// state to show the navigation
	const authentication = useAuthenticationContext();
	const [showMenu, setShowMenu] = useState<boolean>(false);

	// create the navigation
	const navigate = useNavigate();


	function goToParameters() {
		setShowMenu(false);
		navigate('/parameters');
	}

	function logout() {
		setShowMenu(false);
		authentication.disconnect();
	}

	function goToHelp() {
		setShowMenu(false);
		window.open('https://docs.carmentis.io', '_blank');
	}


	return <>
		<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 h-full">
			<div
				className="flex items-center rtl:space-x-reverse h-4 border-gray-100">

				<DropdownAccountSelection allowAccountCreation={true} large={true}></DropdownAccountSelection>
			</div>


			<div className="relative inline-block text-left">
				<div className={"flex flex-row justify-center items-center space-x-4"}>
					<ClickableAppNotifications/>
					<ClickableThreeDots onClick={() => setShowMenu(!showMenu)}/>
				</div>


				<div hidden={!showMenu} onMouseLeave={() => setShowMenu(false)}
					 className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
					 role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
					<div className="py-1" role="none">
						<div
							className="block px-4 py-2 text-sm text-gray-700 hover:text-green-400 hover:cursor-pointer"
							id="menu-item-0" onClick={goToParameters}>Parameters
						</div>
						<div
							className="block px-4 py-2 text-sm text-gray-700 hover:text-green-400 hover:cursor-pointer"
							id="menu-item-1" onClick={logout}>Logout
						</div>
						<div
							className="block px-4 py-2 text-sm text-gray-700 hover:text-green-400 hover:cursor-pointer"
							id="menu-item-0" onClick={goToHelp}>
							Get help
						</div>
					</div>
				</div>
			</div>
		</div>
	</>;
}

function ClickableAppNotifications() {
	const actions = useMainInterfaceActions();
	const {notifications, isLoading} = useApplicationNotificationHook();

	const badgeContent = isLoading ? undefined : notifications.length;
	return <Badge onClick={() => actions.showNotifications()} badgeContent={badgeContent} color={"primary"}>
		<i className={"bi bi-envelope text-xl"}></i>
	</Badge>
}

function ClickableThreeDots(input: {onClick: () => void}) {
	return <button onClick={input.onClick}
				   className="inline-flex w-full justify-center rounded-full bg-white p-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
				   id="menu-button" aria-expanded="true" aria-haspopup="true">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
			 strokeWidth="1.5"
			 stroke="currentColor" className="size-6">
			<path strokeLinecap="round" strokeLinejoin="round"
				  d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"/>
		</svg>
	</button>
}

/**
 * Truncates a string if its length exceeds the specified maximum size.
 * If truncation occurs, appends "..." to indicate the truncation.
 *
 * @param {string} text - The string to be truncated.
 * @param {number} maxSize - The maximum allowable length of the string.
 * @return {string} The modified string if truncation occurs, otherwise the original string.
 */
function capStringSize(text: string, maxSize: number) {
	if (text.length <= maxSize) return text;
	return text.slice(0, maxSize) + '...';
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
			<DashboardWelcomeCards />
			<DashboardVirtualBlockchainsList />
		</div>

	</>;
}


function AccountBalanceCard() {

	console.log("Attempting to read the balance account hook")
	const {data, isLoading, error} = useAccountBalanceHook();
	console.log("account balance card:", data, isLoading, error)


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
	const activeAccount = useAuthenticatedAccount();
	const [numberOfApplications, setNumberOfApplications] = useState<number | undefined>();
	const [numberOfFlows, setNumberOfFlows] = useState<number | undefined>();
	const [spentGaz, setSpentGaz] = useState<number | undefined>();

	useEffect(() => {
		AccountDataStorage.connectDatabase(activeAccount)
			.then(async (db: AccountDataStorage) => {
				db.getNumberOfApplications().then(setNumberOfApplications);
				db.getFlowsNumberOfAccount().then(setNumberOfFlows);
				db.getSpentGaz().then(setSpentGaz);
			});
	}, []);

	return <div className="mb-5">
		<h3>Overview</h3>


		<div className="flex w-full flex-row space-x-4">
			<AccountBalanceCard />
			<Card className={'flex-1'}>
				<CardContent>
					<h3>Applications</h3>
					<SpanWithLoader text={numberOfApplications}></SpanWithLoader>
				</CardContent>
			</Card>
			<Card className={'flex-1'}>
				<CardContent>

					<h3>Virtual blockchains</h3>
					<SpanWithLoader text={numberOfFlows}></SpanWithLoader>
				</CardContent>
			</Card>
			<Card className={'flex-1'}>
				<CardContent>
					<h3>Spent Gas</h3>
					<SpanWithLoader text={spentGaz}></SpanWithLoader>
				</CardContent>
			</Card>

		</div>
	</div>;
}




/**
 * DashboardVirtualBlockchainsList renders a dashboard interface displaying a list of virtual blockchains (flows).
 * It synchronizes data from the blockchain and database, and allows user interactions like exploring flows and viewing details.
 *
 * @return {JSX.Element} A JSX element representing the dashboard section, which includes a list of flows, detail view for the selected flow, and interactive actions such as opening external links or exploring specific flows.
 */
function DashboardVirtualBlockchainsList() {
	const activeAccount = useAuthenticatedAccount();
	const wallet = useWallet();
	const [flows, setFlows] = useState<VirtualBlockchainView[]>([]);
	const [chosenVirtualBlockchainId, setChosenVirtualBlockchainId] = useState<{ applicationId: string, flowId: string } | undefined>();
	const [isLoading, setIsTransition] = useState(false);


	function putDataInStates() {
		AccountDataStorage.connectDatabase(activeAccount)
			.then(async (db) => {
				db.getAllFlowsOfAccount().then(setFlows);
			});
	}

	useEffect(() => {
		synchronizeWithBlockchain();
	}, []);


	function synchronizeWithBlockchain() {
		// TODO
		/*
		IndexedStorage.ConnectDatabase(activeAccount).then(async (db: IndexedStorage) => {
			try {

				const flows = await db.getAllFlowsOfAccount();
				for (const flow of flows) {

					const flowId = flow.virtualBlockchainId;
					const microChain = await Carmentis.getMicroChain(Encoders.FromHexa(flowId));
					const blocksOnChain = microChain.microBlock;
					for (const block of blocksOnChain) {

						const microBlockId: string = Encoders.ToHexa(block.hash);
						const foundInDatabase = await db.checkMicroBlockExists(
							flow.virtualBlockchainId,
							block.nonce,
						);
						if (foundInDatabase) {
							if (typeof block.masterBlock === 'number') {
								console.log('[dashbord] update of existing block:', block);

								await db.updateMasterMicroBlock(
									microBlockId,
									block.masterBlock,
								);
							}
						} else {

							const importMicroBlock: MicroBlock = {
								accountId: activeAccount.id,
								applicationId: flow.applicationId,
								flowId: flowId,
								data: undefined,
								gas: block.gas,
								gasPrice: block.gasPrice,
								isInitiator: false,
								masterBlock: block.masterBlock,
								microBlockId: Encoders.ToHexa(block.hash),
								nonce: block.nonce,
								ts: block.ts,
								version: block.version,
							};

							console.log('[dashboard] add in database:', importMicroBlock);
							await db.addMicroBlock(importMicroBlock);

						}
					}

				}

			} catch (e: any) {
				throw new Error(e);
			}

		});
		 */

	}

	if (isLoading) return <Skeleton count={5} />;


	return <>
		<Card>
			<CardContent>
				<Typography variant={'h6'}>Virtual blockchains</Typography>
				<div className="rounded-gray">
					<table className="table table-auto w-full text-sm text-left rtl:text-right ">
						<thead className="text-xs uppercase bg-gray-50 d">
						<tr>
							<th>Flow Id</th>
							<th>Last update</th>
							<th>Application</th>
							<th>Length</th>
							<th>Domain</th>
							<th></th>
						</tr>
						</thead>
						<tbody>
						{flows.map(flow =>
							<tr
								key={flow.virtualBlockchainId}
								className={
									'hover:bg-gray-100 hover:cursor-pointer ' + (
										chosenVirtualBlockchainId !== undefined && chosenVirtualBlockchainId.flowId === flow.virtualBlockchainId ?
											'bg-gray-200' : ''
									)
								}
								onClick={() => {
									setChosenVirtualBlockchainId({
										applicationId: flow.applicationId,
										flowId: flow.virtualBlockchainId,
									});
								}}>
								<td>{capStringSize(flow.virtualBlockchainId, 20)}</td>
								<td>{Formatter.formatDate(flow.lastUpdate)}</td>
								<td>{flow.applicationName} <span
									className="text-gray-400">({capStringSize(flow.applicationId, 30)})</span></td>
								<td>{flow.flowLength}</td>
								<td onClick={() => window.open('https://' + flow.applicationDomain, '_blank')}
									className="hover:cursor-pointer">{flow.applicationDomain}</td>
								<td onClick={() => window.open(EXPLORER_DOMAIN + '/explorer/microchain/0x' + flow.virtualBlockchainId)}>
									<button className="btn-primary">Explore flow</button>
								</td>
							</tr>)
						}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>

		{chosenVirtualBlockchainId !== undefined &&
			<div className="dashboard-section">
				<VirtualBlockchainDetailComponent key={chosenVirtualBlockchainId.flowId} chosenFlow={chosenVirtualBlockchainId} />
			</div>
		}
	</>;
}

export default Dashboard;
