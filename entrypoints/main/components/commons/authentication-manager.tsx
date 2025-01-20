/*
 * Copyright (c) Carmentis. All rights reserved.
 * Licensed under the Apache 2.0 licence.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import {
	createContext, Dispatch, PropsWithChildren, ReactElement,
	SetStateAction,
	useContext, useEffect,
	useState,
} from 'react';
import { Wallet } from '@/entrypoints/main/Wallet.tsx';
import { SecureWalletStorage } from '@/entrypoints/main/WalletStorage.tsx';
import { Optional } from '@/entrypoints/main/Optional.tsx';
import pino from 'pino';
import { SessionStorage } from '@/entrypoints/main/session-storage.tsx';
import { CarmentisProvider } from '@/src/providers/carmentisProvider.tsx';
import * as Carmentis from '@/lib/carmentis-nodejs-sdk.js';


// setup the internationalisation
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import detector from 'i18next-browser-languagedetector';

import translationFR from '@/src/locales/fr/translation.json';
import translationEN from '@/src/locales/en/translation.json';
import { AuthenticationContextProvider, useAuthenticationContext } from '@/entrypoints/main/contexts/authentication.context.tsx';
import { ApplicationStatusContextProvider, useApplicationStatus } from '@/entrypoints/main/contexts/application-status.context.tsx';
import { TokenAccountContextProvider } from '@/entrypoints/main/contexts/token-account.context.tsx';

const resources = {
	fr: {
		translation: translationFR,
	},
	en: {
		translation: translationEN,
	},
};
i18n
	.use(detector)
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		fallbackLng: 'en', // use en if detected lng is not available
		interpolation: {
			escapeValue: false, // react already safes from xss
		},
	});


const logger = pino({
	level: 'debug',
});

// create the different contexts
export const LoggerContext = createContext(logger);

function configureEndpointsFromWallet(wallet: Optional<Wallet>) {
	if (wallet.isEmpty()) {
		console.warn('Endpoints not set since the provided wallet is not defined.');
	} else {
		// configure the SDK based on the wallet preferences
		Carmentis.registerDataEndpoint(wallet.unwrap().getDataEndpoint());
		Carmentis.registerNodeEndpoint(wallet.unwrap().getNodeEndpoint());
	}
}

function AuthenticationDataAccess({ children }: PropsWithChildren) {
	const { wallet, setWallet, password, setPassword } = useAuthenticationContext();
	const {
		setApplicationInitialised,
		setAccountCreated,
		setAccountNotCreated,
		setApplicationNotInitialised,
	} = useApplicationStatus();

	let logger = useContext(LoggerContext);


	// store the wallet locally when the wallet has changed
	useEffect(() => {
		// prevent local storage clearing when the wallet is updated to an empty one
		if (wallet.isSome()) {
			console.log('[context page] an update of the wallet has been detected: store the wallet in local and session');


			const w = wallet.unwrap();
			const provider = new CarmentisProvider();
			SecureWalletStorage.CreateSecureWalletStorage(provider, password.unwrap()).then(storage => {
				storage.writeWalletContextToLocalStorage(w).then(() => {

					// store the wallet in session
					SessionStorage.WriteSessionState({
						state: {
							wallet: w,
							password: password.unwrap(),
						},
					}).then(_ => {
						// update the wallet
						configureEndpointsFromWallet(wallet);
						setAccountCreated();
					}).catch(error => {
						console.error(error);
					});
				}).catch(error => {
					console.error(error);
				});
			});
		}

	}, [wallet]);


	// search for installed wallet, if not redirect to onboarding page
	SecureWalletStorage.IsEmpty().then(isEmpty => {
		// if the storage do not contain any wallet, then the user do not have created an account and should be
		// redirected to the wallet creation page

		if (isEmpty) {
			logger.info('Wallet not found on local storage.');
			setAccountNotCreated();
			setApplicationInitialised();
			return;
		}

		setAccountCreated();

		// if there is a wallet, good!
		if (!wallet.isEmpty()) {
			logger.info('Wallet is in session:', wallet);
			setApplicationInitialised();
			return;
		}

		// search in session if a wallet exists
		SessionStorage.ContainsWallet().then((isWalletInSession) => {
			// if the wallet exist in session, load the application state from session
			if (isWalletInSession) {
				SessionStorage.GetSessionState().then(result => {
					const sessionWallet = result.state.wallet;
					const sessionPassword = result.state.password;

					logger.info('Wallet open but not active: use the wallet found in session: ', sessionWallet);
					setWallet(Optional.From(sessionWallet));
					configureEndpointsFromWallet(Optional.From(sessionWallet));
					setPassword(Optional.From(sessionPassword));
					setApplicationInitialised();
				});

			} else {
				// otherwise, try with the wallet returned by the login page
				if (!wallet.isEmpty()) {
					const walletObject: Wallet = wallet.unwrap();
					logger.info('Wallet open but no active account chosen:', walletObject);

					// store the account in session
					SessionStorage.WriteSessionState({
						state: {
							wallet: walletObject,
							password: password.unwrap(),
						},
					}).then(_ => {
						// and update the application state
						setApplicationInitialised();
					});
				} else {
					setApplicationInitialised();
				}
			}
		});


	}).catch(error => {
		console.error('An error occured while initializing the application: ', error);
	});


	return <>
		<LoggerContext.Provider value={logger}>
			{children}
		</LoggerContext.Provider>
	</>;
}

export function AuthenticationManager({ children }: PropsWithChildren) {
	return <AuthenticationContextProvider>
		<ApplicationStatusContextProvider>
			<AuthenticationDataAccess>
				<TokenAccountContextProvider>
					{children}
				</TokenAccountContextProvider>
			</AuthenticationDataAccess>
		</ApplicationStatusContextProvider>
	</AuthenticationContextProvider>;

}