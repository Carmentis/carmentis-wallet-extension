import {createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState} from 'react';
import { Optional } from '@/entrypoints/main/Optional.tsx';
import {getUserKeyPair, SignatureKeyPair, Wallet} from '@/entrypoints/main/wallet.tsx';
import { Account } from '@/entrypoints/main/Account.tsx';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {Encoders} from "@/entrypoints/main/Encoders.tsx";
import * as sdk from "@cmts-dev/carmentis-sdk/client";


export interface AuthenticationContainer {
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

export const walletState = atom<Wallet|undefined>({
	key: "wallet",
	default: undefined,
})

export const activeAccountState = selector<Account | undefined>({
	key: 'activeAccount',
	get: ({get}) => {
		const wallet = get(walletState);
		if (!wallet || !wallet.activeAccountId)
			return undefined;
		return wallet.accounts.find(v => v.id === wallet.activeAccountId);
	}
})


export const activeAccountKeyPairState = selector<SignatureKeyPair|undefined>({
	key: "activeAccountKeyPair",
	get: async ({get}) => {
		const wallet = get(walletState);
		const activeAccount = get(activeAccountState)
		if (!wallet || !activeAccount)
			return undefined;
		return await getUserKeyPair(wallet, activeAccount);
	}
})

export const activeAccountPublicKeyState = selector<string|undefined>({
	key: "activeAccountPublicKey",
	get: ({get}) => {
		const keyPair = get(activeAccountKeyPairState);
		if (!keyPair)
			return undefined;
		return Encoders.ToHexa(keyPair.publicKey);
	}
})


export const tokenAccountState = selector<string|undefined>({
	key: 'tokenAccountState',
	get: ({get}) => {
		const activeAccount = get(activeAccountState);
		if (!activeAccount) return undefined;
		return activeAccount.accountVirtualBlockchainId
	}
})

export const nodeEndpointState = selector({
	key: 'nodeEndpointState',
	get: ({get}) => {
		const wallet = get(walletState);
		return wallet?.nodeEndpoint;
	}
})

export const passwordState = atom<string|undefined>({
	key: "password",
	default: '',
})

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
	const setPassword = useSetRecoilState(passwordState);

	const authenticationContainer: AuthenticationContainer = {
        disconnect: () => {
			setWallet(undefined);
			setPassword(undefined)
		},
		connect: (wallet, password) =>  {
			setWallet(wallet);
			setPassword(password)
		}
    };

	useEffect(() => {
		if (wallet) {
			sdk.blockchain.blockchainCore.setNode(wallet.nodeEndpoint);
		}
	}, [wallet]);


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
	const wallet = useRecoilValue(walletState);
	if (!wallet) throw new Error('Attempting to access an undefined wallet')
	return wallet;
}

export function useAuthenticatedAccount() : Account {
	const wallet = useWallet();
	const activeAccount = wallet.accounts.find(a => a.id === wallet.activeAccountId);
	if (!activeAccount) throw new Error('Cannot access active account: No active account found')
	return activeAccount;
}
