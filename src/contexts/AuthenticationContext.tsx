import {createContext, PropsWithChildren} from 'react';
import {useRecoilState} from 'recoil';
import {walletState} from "@/states/states.tsx";
import {Wallet} from "@/types/Wallet.ts";

export interface AuthenticationContainer {
	connect: (wallet: Wallet) => void,
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
	const [wallet, setWallet] = useRecoilState(walletState);

	const authenticationContainer: AuthenticationContainer = {
        disconnect: () => {
			setWallet(undefined);
		},
		connect: (wallet) =>  {
			setWallet(wallet);
		}
    };



	return <AuthenticationContext.Provider value={authenticationContainer}>
		{children}
	</AuthenticationContext.Provider>
}


