import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from 'react';
import { useAuthenticationContext, useWallet } from '@/entrypoints/main/contexts/authentication.context.tsx';

/**
 * Represents the type of a token account. This can include a valid string that specifies
 * the type of the account or an undefined value if the account type is not set.
 *
 * This type is used to differentiate various token account types and allows handling
 * the scenarios where the account type may either be specified or absent.
 */
export type TokenAccountType = string | undefined;
/**
 * TokenAccount interface defines the structure for managing a token account state.
 * It includes a property for the current token account hash and a function to update it.
 *
 * Properties:
 *   - tokenAccountHash: Represents the current state or value of the token account.
 *   - setTokenAccountHash: A setter function to update the value of the token account state.
 */
export interface TokenAccount {
	tokenAccountHash: TokenAccountType,
	setTokenAccountHash: Dispatch<SetStateAction<TokenAccountType>>
}

/**
 * TokenAccountContext is a React Context used to manage and provide access
 * to the current state of a TokenAccount object throughout the component tree.
 * It allows components to share the token account state without passing props
 * manually at every level.
 *
 * The context initializes with an undefined value, which can be replaced with
 * a TokenAccount object at a higher level in the app. Components using this
 * context should handle cases where the value might be undefined.
 *
 * Example usage involves wrapping a component hierarchy with a context provider
 * set with a specific TokenAccount, allowing nested components to consume
 * or manipulate the shared state.
 *
 * @type {React.Context<(TokenAccount|undefined)>}
 */
export const TokenAccountContext = createContext<TokenAccount|undefined>(undefined);
/**
 * Provides a context for managing the state of a token account hash within the application.
 * Uses authentication context to derive the relevant token account information.
 * Handles and updates the token account hash based on the authentication wallet and active account.
 *
 * @param {PropsWithChildren} props - Props containing children elements to be rendered within the provider context.
 * @return {JSX.Element} A context provider component that supplies the token account hash and its state updater function.
 */
export function TokenAccountContextProvider({children}: PropsWithChildren) {
	const [tokenAccountHash, setTokenAccountHash] = useState<TokenAccountType>(undefined);
	const authentication = useAuthenticationContext();
	useEffect(() => {
		const wallet = authentication.wallet;
		if (wallet.isEmpty()) {
			setTokenAccountHash(undefined);
		} else {
			const activeAccount = wallet.unwrap().getActiveAccount();
			if (activeAccount.isEmpty()) {
				setTokenAccountHash(undefined);
			} else {
				const tokenAccount = activeAccount.unwrap().getAccountVirtualBlockchain();
				setTokenAccountHash(
					tokenAccount
				)
			}

		}

	}, [authentication]);

	return <TokenAccountContext.Provider value={{tokenAccountHash, setTokenAccountHash}}>
		{children}
	</TokenAccountContext.Provider>
}

/**
 * Hook to access the token account context.
 * This function allows components to access the token account data
 * managed by the TokenAccountContext. It should only be used within
 * a TokenAccountContext provider, otherwise it will throw an error.
 *
 * @return {object} The token account context object.
 */
export function useTokenAccount() {
	const context = useContext(TokenAccountContext);
	if (!context) throw new Error("Cannot use token account outside of the provider")
	return context;
}