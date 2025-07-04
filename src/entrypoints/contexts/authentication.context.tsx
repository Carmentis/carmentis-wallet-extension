import {createContext, PropsWithChildren, useContext, useEffect} from 'react';
import {getUserKeyPair, SignatureKeyPair, Wallet} from '@/entrypoints/main/wallet.tsx';
import {Account} from '@/entrypoints/main/Account.tsx';
import {atom, selector, useRecoilState, useRecoilValue} from 'recoil';
import {Encoders} from "@/entrypoints/main/Encoders.tsx";
import {PublicSignatureKey} from "@cmts-dev/carmentis-sdk/client";
import {AtomEffect} from "recoil";

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

function walletSessionStorageEffect<T>(key: string): AtomEffect<T> {
	return ({ setSelf, onSet }) => {
		// Initialize atom from chrome.storage.session
		chrome.storage.session.get([key], (result) => {
			console.log("[walletSession] obtained result:", result)
			if (result[key] !== undefined) {
				setSelf(result[key] as T);
			} else {
				setSelf(undefined);
			}
		});

		// Save atom updates to chrome.storage.session
		onSet((newValue) => {
			console.log("[walletSession] Updating wallet:", newValue)
			if (newValue === undefined) {
				chrome.storage.session.remove([key]);
			} else {
				chrome.storage.session.set({ [key]: newValue });
			}
		});
	};
}

export const walletState = atom<Wallet|undefined>({
	key: "wallet",
	effects: [walletSessionStorageEffect<Wallet|undefined>("walletSession")],
})

export const passwordState = selector<string|undefined>({
	key: "password",
	get: ({get}) => {
        const wallet = get(walletState);
        return wallet?.password;
    }
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

export const activeAccountPublicKeyState = selector<PublicSignatureKey|undefined>({
	key: "activeAccountPublicKey",
	get: ({get}) => {
		const keyPair = get(activeAccountKeyPairState);
		if (!keyPair)
			return undefined;
		return keyPair.publicKey;
	}
})


export const nodeEndpointState = selector({
	key: 'nodeEndpointState',
	get: ({get}) => {
		const wallet = get(walletState);
		return wallet?.nodeEndpoint;
	}
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
	console.log("wallet in context provider", wallet)

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
