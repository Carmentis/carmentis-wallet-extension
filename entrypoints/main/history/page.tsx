import {
	Card,
	CardContent,
	Paper,
	Table, TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { useWallet } from '@/entrypoints/main/contexts/authentication.context.tsx';
import { FlexCenter } from '@/entrypoints/main/components/layout/flex-center.tsx';
import { AccountTransactionHistoryEntry, useTransactionHistory } from '@/entrypoints/hooks/sdk.hook.tsx';
import React, { useEffect, useState } from 'react';
import NoTokenAccount from '@/entrypoints/components/no-token-account.tsx';

export default function HistoryPage() {
	const wallet = useWallet();
	const activeAccount = wallet.getActiveAccount().unwrap();
	const [history, setHistory] = useState<AccountTransactionHistoryEntry[]>([]);

	useEffect(() => {
		const fetchAccountHistory = async () => {
			const history = await useTransactionHistory('', '');
			setHistory(history)
		} // TODO do the integration

		fetchAccountHistory();
	}, []);

	if (!activeAccount.hasAccountVirtualBlockchain()) {
		return <NoTokenAccount/>
	}

	return <TimelineHistory
		history={history}
	/>
}

function TimelineHistory(
	{history}: {history: AccountTransactionHistoryEntry[]}
) {
	return <Card>
		<CardContent>
			<Typography variant={"h5"}>Transaction History</Typography>
			<TableContainer>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Date</TableCell>
							<TableCell align="right">Type</TableCell>
							<TableCell align="right">From</TableCell>
							<TableCell align="right">To</TableCell>
							<TableCell align="right">Amount</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{history.map((row,index) => (
							<TableRow
								key={index}
							>
								<TableCell component="th" scope="row">
									{new Date(row.timestamp).toLocaleString()}
								</TableCell>
								<TableCell align="right">{row.type}</TableCell>
								<TableCell align="right">{row.linkedAccount}</TableCell>
								<TableCell align="right">--</TableCell>
								<TableCell align="right">{row.amount}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</CardContent>
	</Card>
}

