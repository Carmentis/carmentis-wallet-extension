import { blockchain, blockchainQuery } from '@cmts-dev/carmentis-sdk';


/**
 * Retrieves the account balance for a given account hash.
 *
 * @param {string} accountVbHash - The hash identifier of the account whose balance is being requested.
 * @return {Promise<number>} A promise that resolves to the balance of the account as a number.
 */
export async function useAccountBalance(accountVbHash: string): Promise<number> {
	const accountState = await blockchain.blockchainQuery.getAccountState(accountVbHash);
	return accountState.balance;
}

export async function searchAccountHashByPublicKey(publicKey: string) {
	console.log("blockchain.blockchainQuery:", blockchain.blockchainQuery)
	const accountHash = await blockchain.blockchainQuery.getAccountByPublicKey(publicKey);
    return accountHash;
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
	return await blockchain.blockchainQuery.getAccountHistory(
		accountVbHash,
		lastHistoryHash,
	);
}