import {
    Button,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import {useAuthenticatedAccount, useWallet} from '@/entrypoints/contexts/authentication.context.tsx';
import {
    AccountTransactionHistoryEntry,
    useAccountBalanceHook,
    useAccountTransactionHistoryHook,
} from '@/entrypoints/components/hooks/sdk.hook.tsx';
import React, {useState} from 'react';
import NoTokenAccount from '@/entrypoints/components/no-token-account.tsx';
import {SparkLineChart} from "@mui/x-charts";
import Skeleton from "react-loading-skeleton";
import {Splashscreen} from "@/entrypoints/components/Splashscreen.tsx";

export default function HistoryPage() {
	const [history, setHistory] = useState<AccountTransactionHistoryEntry[]>([]);
	const balanceResponse = useAccountBalanceHook();

	if (balanceResponse.isLoading) return <Splashscreen/>
	if (balanceResponse.error) {
		return <NoTokenAccount/>
	}

	return <>
		<div id="header" className={"flex flex-row py-8"}>
			<div className="w-8/12">
				<RenderCurrentAccountBalance/>
			</div>
			<div className="w-4/12">
				<RenderAccountGraphHistory
					history={history}
				/>
			</div>
		</div>

			<TimelineHistory
				history={history}
			/>
	</>
}

const INITIAL_MAX_ENTRIES = 50;
function TimelineHistory() {
	const [maxEntries, setMaxEntries] = useState(INITIAL_MAX_ENTRIES);
	const {data, isLoading, error} = useAccountTransactionHistoryHook(0, maxEntries);

	if (isLoading || !data) return <Skeleton/>

	return <Card className={"p-0"}>
		<CardContent className={"p-0"}>
			<TableContainer>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Date</TableCell>
							<TableCell>Type</TableCell>
							<TableCell>Linked Account</TableCell>
							<TableCell align="right">Amount</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map((row,index) => <RenderTransactionRow transaction={row} key={index}/>)}
					</TableBody>
				</Table>
			</TableContainer>
			<div className="flex mt-4 justify-center">
				<Button onClick={() => setMaxEntries(m => m + INITIAL_MAX_ENTRIES)}>Load more</Button>
			</div>
		</CardContent>
	</Card>
}

function RenderTransactionRow(input: { transaction: AccountTransactionHistoryEntry }) {
	const row = input.transaction;
	const isPositive = row.amount >= 0;
	const sign = isPositive ? "+" : "";

	return <TableRow
	>
		<TableCell component="th" scope="row">
			{new Date(row.timestamp).toLocaleString()}
		</TableCell>
		<TableCell>{row.name}</TableCell>
		<TableCell>{row.linkedAccount}</TableCell>
		<TableCell align="right">
			<Typography color={isPositive ? "success" : "error"}>
				{`${sign}${row.amount} CMTS`}
			</Typography>
		</TableCell>
	</TableRow>
}

function RenderCurrentAccountBalance(
) {
	const balanceResponse = useAccountBalanceHook();

	if (balanceResponse.error) {
		return <NoTokenAccount/>
	}

	if (balanceResponse.isLoading) return <Skeleton/>

	return <>
		<Typography color={"textDisabled"} fontSize={"large"}>Balance</Typography>
		<Typography variant={"h4"}>{balanceResponse.data} CMTS</Typography>
	</>;
}

function RenderAccountGraphHistory() {
	const {data, isLoading, error} = useAccountTransactionHistoryHook();

	if (isLoading || !data) return <Skeleton/>

	console.log(data)

	if (data.length === 0) return <></>
	let amount = 0;
	const x : number[] = [];
	data.reverse().forEach(
		h => {
			amount += h.amount;
			x.push(amount)
		}
	);
	const times = data.reverse().map(
		h => h.timestamp
	);

	console.log(x, times)
	return <>
		<SparkLineChart
			sx={{
				'--my-custom-gradient': 'url(#GlobalGradient)',
			}}
			slotProps={{
				popper: {
					sx: {
						'--my-custom-gradient': 'linear-gradient(0deg, #123456, #81b2e4);',
					},
				},
			}}
			showTooltip
			showHighlight
			xAxis={{ scaleType: 'time', data: times }}
			data={x}
			height={100} />
	</>
}

