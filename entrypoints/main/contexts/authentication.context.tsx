import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';
import { Optional } from '@/entrypoints/main/Optional.tsx';
import { Wallet } from '@/entrypoints/main/Wallet.tsx';
import { Account } from '@/entrypoints/main/Account.tsx';

/**
 * Represents a container for managing authentication state and actions.
 *
 * This interface defines the structure for handling user authentication,
 * including password management, wallet association, and connection/disconnection actions.
 *
 * @interface AuthenticationContainer
 * @property {Optional<string>} password - The current user's password, if available.
 * @property {Dispatch<SetStateAction<Optional<string>>>} setPassword - Function to update the password state.
 * @property {Optional<Wallet>} wallet - The current user's wallet, if available.
 * @property {Dispatch<SetStateAction<Optional<Wallet>>>} setWallet - Function to update the wallet state.
 * @property {(wallet: Wallet, password: string) => void} connect - Method to establish a connection using the provided wallet and password.
 * @property {() => void} disconnect - Method to terminate the current authentication session.
 */
export interface AuthenticationContainer {
	password : Optional<string>,
	setPassword: Dispatch<SetStateAction<Optional<string>>>,
	wallet: Optional<Wallet>,
	setWallet: Dispatch<SetStateAction<Optional<Wallet>>>,
	connect: (wallet: Wallet, password: string) => void,
	disconnect: () => void,
}

/**
 * Represents a React context for managing authentication-related state
 * within the application.
 *
 * `AuthenticationContext` is used to provide and consume authentication
 * data and functions throughout the React component tree. It is initialized
 * with a default value of `undefined`.
 *
 * This context can supply an `AuthenticationContainer` or remain `undefined`
 * if no authentication provider is available.
 *
 * Frequently used in conjunction with a context provider to wrap components
 * and ensure authentication data is accessible across the application.
 */
export const AuthenticationContext = createContext<AuthenticationContainer|undefined>(undefined);

/**
 * AuthenticationContextProvider is a component that supplies an authentication context to its child components.
 * It manages and provides access to wallet and password state, along with methods to connect and disconnect.
 *
 * @param {PropsWithChildren} props - Component properties including children elements.
 * @return {JSX.Element} A provider component that wraps its children within the authentication context.
 */
export function AuthenticationContextProvider(
	{children}: PropsWithChildren
) {
	const [wallet, setWallet] = useState<Optional<Wallet>>(Optional.Empty());
	const [password, setPassword] = useState<Optional<string>>(Optional.Empty());

	const authenticationContainer: AuthenticationContainer = {
        password: password,
        setPassword: setPassword,
        wallet: wallet,
        setWallet: setWallet,
        disconnect: () => {
			setWallet(Optional.Empty());
			setPassword(Optional.Empty())
		},
		connect: (wallet, password) =>  {
			setWallet(Optional.From(wallet));
			setPassword(Optional.From(password))
		}
    };


	return <AuthenticationContext.Provider value={authenticationContainer}>
		{children}
	</AuthenticationContext.Provider>
}

/**
 * A custom hook that provides access to the authentication context.
 * This hook must be used within a component wrapped by `AuthenticationContextProvider`.
 *
 * @throws {Error} If the hook is called outside of the `AuthenticationContextProvider`.
 */
export function useAuthenticationContext() {
	const context = useContext(AuthenticationContext);
	if (!context) throw new Error('Cannot call useAuthenticationContext outside of AuthenticationContextProvider')
	return context;
}


export function useWallet() : Wallet {
	const context = useAuthenticationContext();
	const walletOptional = context.wallet;
	if (walletOptional.isEmpty()) throw new Error('Cannot access wallet: No wallet defined')
	return walletOptional.unwrap();
}

export function useAuthenticatedAccount() : Account {
	const wallet = useWallet();
	const activeAccount = wallet.getActiveAccount();
	if (activeAccount.isEmpty()) throw new Error('Cannot access active account: No active account found')
	return activeAccount.unwrap();
}
