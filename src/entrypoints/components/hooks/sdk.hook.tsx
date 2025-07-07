import {
	AccountHistory, AccountVb, Hash,
	PrivateSignatureKey,
	ProviderFactory, PublicSignatureKey,
	StringSignatureEncoder,
	TOKEN
} from '@cmts-dev/carmentis-sdk/client';
import {useRecoilValue} from "recoil";
import {
	activeAccountPublicKeyState,
	nodeEndpointState,
	useWallet
} from "@/entrypoints/contexts/authentication.context.tsx";
import useSWR from "swr";
import {Explorer, Blockchain} from "@cmts-dev/carmentis-sdk/client";

/**
 * Fetches the account balance for the given account's public key from the specified node URL.
 *
 * @param {PublicSignatureKey} accountPublicKey - The public signature key of the account whose balance is to be retrieved.
 * @param {string} nodeUrl - The URL of the node to connect to for fetching the account data.
 * @return {Promise<number>} A promise that resolves to the account balance as a number.
 * @throws {Error} If there is an issue retrieving the account information or balance.
 */
export async function useAccountBalance(accountPublicKey: PublicSignatureKey, nodeUrl: string): Promise<number> {
	try {
		// create the explorer
		const provider = ProviderFactory.createInMemoryProviderWithExternalProvider(nodeUrl);
		const explorer = Explorer.createFromProvider(provider);

		// load the hash of the account
		const accountHash = await explorer.getAccountByPublicKey(accountPublicKey);
		const accountState = await explorer.getAccountState(accountHash);
		return accountState.balance / TOKEN;
	} catch (e) {
		console.log("Cannot proceed to the account's balance data:", e)
		return 0
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
	const wallet = useWallet();
	return useSWR(
		accountPublicKey ? ['balanceAccount', accountPublicKey, wallet] : null,
		([, pk, wallet]) => useAccountBalance(pk, wallet.nodeEndpoint)
	);
}


/**
 * Fetches the account history for a given account public key by querying
 * the blockchain explorer. This function retrieves a specific number
 * of historical records starting from a given offset.
 *
 * @param {string} accountPublicKey - The public key of the account for which the history is to be fetched.
 * @param {number} [offset=0] - The starting offset for the history records. Defaults to 0.
 * @param {number} [maxRecords=50] - The maximum number of records to retrieve. Defaults to 50.
 * @return {Promise<AccountHistory>} A promise that resolves to the account history object.
 * @throws {Error} Throws an error if unable to fetch the account history.
 */
export async function useAccountHistory(
	nodeUrl: string,
	accountPublicKey : PublicSignatureKey,
	offset = 0,
	maxRecords = 50,
): Promise<AccountHistory> {
	try {
		// create the explorer
		const provider = ProviderFactory.createInMemoryProviderWithExternalProvider(nodeUrl);
		const explorer = Explorer.createFromProvider(provider);

		// load the hash of the account
		const accountHash = await explorer.getAccountByPublicKey(accountPublicKey);
		const accountState = await explorer.getAccountState(accountHash);
		const history = await explorer.getAccountHistory(
			accountHash,
			Hash.from(accountState.lastHistoryHash),
			maxRecords
		);

		return history;
	} catch (e) {
		console.log(`Cannot load the history of transaction: ${e}`);
		throw new Error(`${e}`)
	}
}

export function useAccountTransactionHistoryHook(
	offset = 0,
	maxRecords = 50,
) {
	const network = useRecoilValue(nodeEndpointState)
	const accountPublicKey = useRecoilValue(activeAccountPublicKeyState);
	return useSWR(
		accountPublicKey ? ['accountTransactionHistory', network, accountPublicKey, offset, maxRecords] : null,
		([, node, pk, o, m]) => useAccountHistory(node, pk, o, m)
	);
}

export async function transferTokensToPublicKey(nodeUrl: string, senderPrivateKey: PrivateSignatureKey, senderPublicKey: PublicSignatureKey, receiverPublicKey: string, tokenAmount: number) {
	try {
		// creating the explorer and the blockchain
		const provider = ProviderFactory.createKeyedProviderExternalProvider(senderPrivateKey, nodeUrl);
		const explorer = Explorer.createFromProvider(provider);
		const blockchain = new Blockchain(provider);

		// load the accounts
		const signatureEncoder = StringSignatureEncoder.defaultStringSignatureEncoder();
		const senderAccountHash  = await explorer.getAccountByPublicKey(senderPublicKey);
		const receiverAccountHash = await explorer.getAccountByPublicKey(signatureEncoder.decodePublicKey(receiverPublicKey));

		// perform the transfer
		const senderAccount = await blockchain.loadAccount(senderAccountHash);
		await senderAccount.transfer({
			account: receiverAccountHash.toBytes(),
			amount: 0,
			publicReference: '',
			privateReference: ''
		})
		senderAccount.setGasPrice(TOKEN);
		await senderAccount.publishUpdates();
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

