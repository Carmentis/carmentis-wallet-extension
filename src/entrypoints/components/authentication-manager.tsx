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

import {createContext, PropsWithChildren, Suspense, useContext, useEffect, useState,} from 'react';
import {Wallet} from '@/entrypoints/main/wallet.tsx';
import {SecureWalletStorage} from '@/utils/db/wallet-storage.ts';
import pino from 'pino';
import {CarmentisProvider} from '@/providers/carmentisProvider.tsx';
import * as Carmentis from '@/lib/carmentis-nodejs-sdk.js';
import * as sdk from '../../../../carmentis-core/dist/client';


// setup the internationalisation
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import detector from 'i18next-browser-languagedetector';

import translationFR from '@/locales/fr/translation.json';
import translationEN from '@/locales/en/translation.json';
import {
	AuthenticationContextProvider,
	passwordState,
	walletState,
} from '@/entrypoints/contexts/authentication.context.tsx';
import {
	ApplicationStatusContextProvider,
	useApplicationStatus,
} from '@/entrypoints/contexts/application-status.context.tsx';
import {RecoilRoot, useRecoilState, useRecoilValue} from 'recoil';
import {toast, ToastContainer} from "react-toastify";
import {useSessionStorage} from "react-use";
import {Splashscreen} from "@/entrypoints/components/Splashscreen.tsx";
import {Encoders} from "@/entrypoints/main/Encoders.tsx";
import ApplicationNotificationContext from "@/entrypoints/contexts/application-notification.context.tsx";

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

function configureEndpointsFromWallet(wallet: Wallet | undefined) {
    if (!wallet) {
        console.warn('Endpoints not set since the provided wallet is not defined.');
    } else {
        // configure the SDK based on the wallet preferences
        sdk.blockchain.blockchainCore.setNode(
            wallet.nodeEndpoint
        )
        Carmentis.registerNodeEndpoint(wallet.nodeEndpoint);
        Carmentis.registerDataEndpoint(wallet.emailOracleEndpoint);
    }
}

function AuthenticationDataAccess({children}: PropsWithChildren) {
    const [wallet, setWallet] = useRecoilState(walletState);
    const [walletInSession, setWalletInSession] = useSessionStorage<Wallet | undefined>('walletSession', undefined)
    const password = useRecoilValue(passwordState);
    const [isLoading, setLoading] = useState(true);




    const {
        setAccountCreated,
    } = useApplicationStatus();


    // store the wallet locally when the wallet has changed
    useEffect(() => {
        // prevent local storage clearing when the wallet is updated to an empty one
        setLoading(true);
        if (wallet) {
            configureEndpointsFromWallet(wallet);
            setWalletInSession(wallet)
            console.log('[context page] an update of the wallet has been detected: store the wallet in local and session');
            const provider = new CarmentisProvider();
            SecureWalletStorage.CreateSecureWalletStorage(provider, password).then(storage => {
                storage.writeWalletToStorage(wallet).then(() => {
                    setAccountCreated();
                }).catch(error => {
                    console.error(error);
                });
            });
        }

    }, [wallet]);

    const applicationStartup = async () => {
        // no locally stored wallet => need to setup
        const walletIsInStorage = !(await SecureWalletStorage.IsEmpty());
        const walletIsStoredInSession = walletInSession !== undefined;
        console.log("Wallet in storage?", walletIsInStorage)
        console.log("Wallet in session?", walletInSession !== undefined)

        if (!wallet && !walletIsStoredInSession && !walletIsInStorage) {
            console.log("No wallet found in storage and nowhere else: Onboarding required")
            setLoading(false);
            return;
        } else if (!wallet && !walletIsStoredInSession && walletIsInStorage) {
            console.log("Wallet found in storage but not found in session or state: Login required");
            setAccountCreated()
            setLoading(false)
        } else if (wallet && walletIsInStorage) {
            console.log("wallet found in state and in session: Running")
            setLoading(false);
        } else if (!wallet && walletIsStoredInSession) {
            console.log("wallet found in session and but not in state: Loading from session")
            setWallet(walletInSession)
            setLoading(false);
        } else {
            console.log(`Strange state detected:, ${wallet !== undefined}, ${walletIsStoredInSession}, ${walletIsInStorage}`)
        }


    }

    applicationStartup();

    if (wallet && !walletInSession || isLoading) return <Splashscreen/>
    return <>

        {children}
    </>;
}

export function useToast() {
    return {
        success: (msg: string) => toast(msg),
        error: (msg: string) => toast(msg)
    }
}


export function AuthenticationManager({children}: PropsWithChildren) {
    let logger = useContext(LoggerContext);

    return <RecoilRoot>
        <Suspense fallback={<Splashscreen/>}>
            <ApplicationNotificationContext>
                <LoggerContext.Provider value={logger}>
                    <ToastContainer/>
                    <AuthenticationContextProvider>
                        <ApplicationStatusContextProvider>
                            <AuthenticationDataAccess>
                                {children}
                            </AuthenticationDataAccess>
                        </ApplicationStatusContextProvider>
                    </AuthenticationContextProvider>
                </LoggerContext.Provider>
            </ApplicationNotificationContext>
        </Suspense>
    </RecoilRoot>;

}