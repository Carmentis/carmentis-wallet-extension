import * as sdk from '../../../../../carmentis-core/dist/client';
import {useRecoilValue} from "recoil";
import {activeAccountPublicKeyState} from "@/entrypoints/contexts/authentication.context.tsx";
import useSWR from "swr";


/**
 * Retrieves the account balance for a specified public key.
 *
 * @param {string} accountPublicKey - The public key of the account to retrieve the balance for.
 * @return {Promise<number>} The account balance in ECO tokens.
 * @throws Will throw an error if the account balance cannot be retrieved.
 */
export async function useAccountBalance(accountPublicKey: string): Promise<number> {
	try {
		console.log("Load account by public key: ", accountPublicKey)
		const accountVbHash = await sdk.blockchain.blockchainQuery.getAccountByPublicKey(accountPublicKey);
		console.log("Get account state: ", accountVbHash)
		const accountState = await sdk.blockchain.blockchainQuery.getAccountState(accountVbHash);
		console.log("obtained account state: ", accountState)
		return accountState.balance / sdk.constants.ECO.TOKEN;
	} catch (e) {
		console.log(e)
		throw new Error(`${e}`)
	}
}




/**
 * Custom hook to fetch and manage the account balance for the active account.
 * It leverages the Recoil state for the active account's public key and uses `useSWR`
 * for data fetching and caching.
 *
 * @return {object} An SWR response object containing the account balance data, loading state, and error state.
 */
export function useAccountBalanceHook() {
	const accountPublicKey = useRecoilValue(activeAccountPublicKeyState);
	return useSWR(
		accountPublicKey ? ['balanceAccount', accountPublicKey] : null,
		([, pk]) => useAccountBalance(pk as string)
	);
}


/**
 * Fetches the transaction history for a given account based on its public key.
 *
 * @param {string} accountPublicKey - The public key of the account whose transaction history is to be retrieved.
 * @param {number} [offset=0] - The starting position (offset) for fetching the history. Defaults to 0.
 * @param {number} [maxRecords=50] - The maximum number of transaction records to fetch. Defaults to 50.
 * @return {Promise<AccountTransactionHistoryEntry[]>} A promise that resolves to an array of account transaction history entries.
 * @throws {Error} Throws an error if the account history retrieval fails.
 */
export async function useAccountHistory(
	accountPublicKey: string,
	offset = 0,
	maxRecords = 50,
): Promise<AccountTransactionHistoryEntry[]> {
	try {
		// load the current account state
		const accountVbHash = await sdk.blockchain.blockchainQuery.getAccountByPublicKey(accountPublicKey);
		const accountState = await sdk.blockchain.blockchainQuery.getAccountState(accountVbHash);
		const history = await sdk.blockchain.blockchainQuery.getAccountHistory(
			accountVbHash,
			accountState.lastHistoryHash,
			maxRecords
		);

		return history.map(h => {
			return {...h, amount: h.amount / sdk.constants.ECO.TOKEN}
		})
	} catch (e) {
		console.log(e)
		throw new Error(`${e}`)
	}
}

export function useAccountTransactionHistoryHook(
	offset = 0,
	maxRecords = 50,
) {
	const accountPublicKey = useRecoilValue(activeAccountPublicKeyState);
	return useSWR(
		accountPublicKey ? ['accountTransactionHistory', accountPublicKey, offset, maxRecords] : null,
		([, pk, o, m]) => useAccountHistory(pk as string, o, m)
	);
}

export async function searchAccountHashByPublicKey(publicKey: string) {
	return new Promise<string>(async (resolve, reject) => {
		try {
			sdk.blockchain.blockchainQuery.getAccountByPublicKey(publicKey)
				.then(hash => resolve(hash))
				.catch(error => reject(error));
		} catch (e) {
			reject(e)
		}
	})
}

export async function transferTokensToPublicKey(senderPrivateKey: string, senderPublicKey: string, receiverPublicKey: string, tokenAmount: number) {
	try {
		console.log("Searching for accounts")
		const senderAccountHash  = await sdk.blockchain.blockchainQuery.getAccountByPublicKey(senderPublicKey);
		const receiverAccountHash = await sdk.blockchain.blockchainQuery.getAccountByPublicKey(receiverPublicKey);

		console.log("Configuring SDK for the sending")
		const vb = new sdk.blockchain.accountVb();
		await vb.load(senderAccountHash);
		sdk.blockchain.blockchainCore.setUser(
			sdk.blockchain.ROLES.USER,
			senderPrivateKey
		);

		console.log("Create transfer")
		const transfer = vb.createTransfer(receiverAccountHash, tokenAmount * sdk.constants.ECO.TOKEN);
		transfer.addPublicReference("public ref");
		transfer.addPrivateReference("private ref");
		await transfer.commit();

		console.log("Signing of the transaction")
		await vb.sign();
		vb.setGasPrice(sdk.constants.ECO.TOKEN);

		console.log("Publishing the transaction")
		await vb.publish();
	} catch (e) {
		throw e;
	}

}





/**
 * Represents an entry in the account transaction history.
 *
 * This type captures the details of a single transaction associated
 * with an account, including its metadata and relevant linked information.
 */
export type AccountTransactionHistoryEntry = {
	height: number,
	previousHistoryHash: string,
	type: number,
	name: string,
	timestamp: number,
	linkedAccount: string,
	amount: number,
	chainReference: string
}

/**
 * Retrieves the transaction history for a specified account.
 *
 * @param {string} accountVbHash - The unique hash of the account to retrieve transaction history for.
 * @param {string} lastHistoryHash - The hash of the last transaction history entry to serve as a reference point.
 * @return {Promise<AccountTransactionHistoryEntry[]>} A promise resolving to an array of transaction history entries for the given account.
 */
export async function useTransactionHistory(
	accountVbHash: string,
	lastHistoryHash: string,
) : Promise<AccountTransactionHistoryEntry[]> {
	return await sdk.blockchain.blockchainQuery.getAccountHistory(
		accountVbHash,
		lastHistoryHash,
	);
}