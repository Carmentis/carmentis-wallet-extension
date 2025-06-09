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

import React, {PropsWithChildren, ReactElement, useState} from "react";
import {PopupNavbar} from "@/entrypoints/components/popup/PopupNavbar.tsx";
import "react-loading-skeleton/dist/skeleton.css";
import {activeAccountState, walletState} from '@/entrypoints/contexts/authentication.context.tsx';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {clientRequestSessionState, showSuccessScreenState} from "@/entrypoints/states/client-request-session.state.tsx";
import {Box, Button, Typography} from "@mui/material";
import {Encoders} from "@/entrypoints/main/Encoders.tsx";
import {getUserKeyPair, Wallet} from "@/entrypoints/main/wallet.tsx";
import * as sdk from '@cmts-dev/carmentis-sdk/client';
import {BACKGROUND_REQUEST_TYPE, BackgroundRequest, ClientResponse,} from "@/entrypoints/background.ts";
import {Account} from "@/entrypoints/main/Account.tsx";
import PopupEventApproval from "@/entrypoints/components/popup/PopupEventApproval.tsx";
import {errorState} from "@/entrypoints/components/popup/popup-even-approval.state.ts";
import Skeleton from "react-loading-skeleton";
import image from '~/assets/success.png';
import { motion } from "framer-motion";
import { CheckCircle } from "react-bootstrap-icons";



export interface RecordConfirmationData {
    // these variables are obtained at the processRecord step
    applicationId: string | undefined
    applicationVersion: number | undefined,
    applicationName: string | undefined,
    rootDomain: string | undefined,
    ts: number | undefined,
    gas: number | undefined,
    gasPrice: number | undefined,
    data: object | undefined

    // these variables are obtained at the confirmRequest step
    flowId: string | undefined,
    microBlockId: string | undefined,
    nonce: number | undefined,
    authorPublicKey: string | undefined,
}

export const useClearClientRequest = () => {
    const setClientRequest = useSetRecoilState(clientRequestSessionState);
    return () => {
        setClientRequest(undefined);
    }
}

export const useWallet = () =>  {
    return useRecoilValue(walletState);
}

export const useActiveAccount = () =>  {
    return useRecoilValue(activeAccountState);
}

export const useAccept = () => {
    const clearRequest = useClearClientRequest();
    const setShow = useSetRecoilState(showSuccessScreenState);
    return () => {
        clearRequest()
        setShow(true)
        setTimeout(() => setShow(false), 1000)
    }
}

export const useUserKeyPair = () =>  {
    const wallet = useWallet();
    const activeAccount = useActiveAccount();
    return async () => {
        const keyPair = await getUserKeyPair(wallet!, activeAccount!);
        return keyPair
    }
}


export const useClientRequest = () => {
    const clientRequest = useRecoilValue(clientRequestSessionState);
    const noRequest = clientRequest === undefined;
    const error = useRecoilValue(errorState);
    const success = useRecoilValue(showSuccessScreenState);
    return { clientRequest, noRequest, error, success  };
}

export function PopupDashboard() {
    return <PopupLayout>
        <PopupBody/>
    </PopupLayout>
}

function PopupLayout({children}: PropsWithChildren) {
    return (
        <div className="flex flex-col h-full bg-white">
            <div className="w-full h-full p-4 overflow-auto">
                {children}
            </div>
        </div>
    );
}


export type PopupNotificationProps = {
    header: ReactElement,
    body: ReactElement,
    footer: ReactElement,
};
export function PopupNotificationLayout({header, body, footer}: PopupNotificationProps) {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full flex flex-col justify-between space-y-4 bg-white rounded-lg p-4"
        >
            <motion.div 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="border-b border-gray-100 pb-4"
            >
                {header}
            </motion.div>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 overflow-y-auto py-2"
            >
                {body}
            </motion.div>
            <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-4 border-t border-gray-100"
            >
                {footer}
            </motion.div>
        </motion.div>
    );
}

export type AcceptDeclineButtonsFooterProps = {
    accept: () => void,
    decline?: () => void
}
export function AcceptDeclineButtonsFooter(props: AcceptDeclineButtonsFooterProps) {
    const clearRequest = useClearClientRequest();
    const [isAccepting, setIsAccepting] = useState(false);

    function handleAccept() {
        setIsAccepting(true);
        try {
            props.accept();
        } catch (error) {
            console.error("Error accepting request:", error);
            setIsAccepting(false);
        }
    }

    function decline() {
        if (props.decline) { 
            props.decline();
        } else {
            clearRequest();
        }
    }

    return (
        <div className="w-full flex space-x-3">
            <motion.div 
                className="w-1/2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Button 
                    onClick={handleAccept}
                    disabled={isAccepting}
                    className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-all duration-200 rounded-lg shadow-sm"
                    variant="contained"
                    startIcon={isAccepting ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : <CheckCircle className="h-4 w-4" />}
                >
                    {isAccepting ? "Processing..." : "Accept"}
                </Button>
            </motion.div>
            <motion.div 
                className="w-1/2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Button 
                    onClick={decline}
                    disabled={isAccepting}
                    className="w-full py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-all duration-200 rounded-lg"
                    variant="outlined"
                >
                    Decline
                </Button>
            </motion.div>
        </div>
    );
}


function NotificationDataField({ value }: { value: string }) {
    return (
        <div className="w-full max-w-full overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
            <div className="p-3 overflow-x-auto font-mono text-sm text-gray-700 break-all">
                {value}
            </div>
        </div>
    );
}

function ValueWithLabel({ label, value }: { label: string, value: string }) {
    return (
        <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
            <NotificationDataField value={value} />
        </div>
    );
}

export function OriginAndDateOfCurrentRequest() {
    const {clientRequest} = useClientRequest();
    if (!clientRequest) return <Skeleton />;
    return <>
        <ValueWithLabel label={"Origin"} value={clientRequest.origin} />
        <ValueWithLabel label={"Received at"} value={new Date(clientRequest.timestamp).toLocaleString()} />
    </>
}


function PopupBody() {
    // the current client request stored in session (possibly undefined)
    const {clientRequest, noRequest, error, success} = useClientRequest();

    // by default when there is no client request display the default dashboard
    if (error) return <PopupError/>
    if (success) return <PopupSuccess/>
    if (noRequest)  return <PopupIdleBody/>
    const wiWallet = new sdk.wiExtensionWallet();
    const req = wiWallet.getRequestFromMessage(clientRequest.data)
    if (req.type === sdk.constants.SCHEMAS.WIRQ_AUTH_BY_PUBLIC_KEY) return <PopupAuthByPublicKeyBody/>
    if (req.type === sdk.constants.SCHEMAS.WIRQ_GET_EMAIL) return <PopupGetEmail/>
    if (req.type === sdk.constants.SCHEMAS.WIRQ_GET_USER_DATA) return <PopupGetUserData/>
    if (req.type === sdk.constants.SCHEMAS.WIRQ_DATA_APPROVAL) return <PopupEventApproval/>

    return <>You have a request!</>
}

function PopupSuccess() {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-6">
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20 
                }}
                className="bg-blue-100 rounded-full p-4 mb-4"
            >
                <CheckCircle className="text-blue-600 h-12 w-12" />
            </motion.div>

            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Success!
                </h2>
                <p className="text-gray-600">
                    Your request has been processed
                </p>
            </motion.div>
        </div>
    );
}

function PopupError() {
    const wallet = useWallet();
    const [error, setError] = useRecoilState(errorState);

    function renderNotificationError(error: unknown) {
        if (typeof error === 'string') {
            return error;
        } else if (Array.isArray(error) && error.every(v => typeof v === 'string')) {
            return error.join(", ");
        } else if ('message' in error && typeof error.message === 'string') {
            return error.message;
        } else if (typeof error !== 'undefined' && 'toString' in error && typeof error.toString === 'function') {
            return error.toString();
        } else {
            return `${error}`;
        }
    }

    const errorMessage = renderNotificationError(error);

    const header = (
        <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-800">
                Error Occurred
            </h2>
        </div>
    );

    const body = (
        <div className="space-y-4">
            <div className="bg-red-50 border-l-2 border-red-400 p-4 rounded-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">
                            {errorMessage}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-700 mb-2">
                    The error might be caused by an invalid configuration of the server or an incorrect setup of your wallet.
                </p>
                <p className="text-sm text-gray-700 mb-4">
                    Please ensure that the application and your wallet are connected to the same network to avoid compatibility issues.
                </p>

                <div className="mb-2 text-sm font-medium text-gray-700">Current node:</div>
                <NotificationDataField value={wallet?.nodeEndpoint!} />
            </div>
        </div>
    );

    const footer = (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Button 
                className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all duration-200 rounded-lg shadow-sm" 
                onClick={() => setError(undefined)} 
                variant="contained"
            >
                Dismiss
            </Button>
        </motion.div>
    );

    return <PopupNotificationLayout header={header} body={body} footer={footer} />;
}


function PopupGetUserData() {
    const markAsAccepted = useAccept();
    const activeAccount = useActiveAccount();
    const {clientRequest} = useClientRequest();
    const wiWallet = new sdk.wiExtensionWallet();
    const req = wiWallet.getRequestFromMessage(clientRequest.data);
    const requiredData : string[] = req.object.requiredData!

    function mapRequiredDataItemWithValue(requiredItem: string) {
        if (requiredItem === 'firstname') return activeAccount?.firstname || '';
        if (requiredItem === 'lastname' ) return activeAccount?.lastname || '';
        if (requiredItem === 'email') return activeAccount?.email || '';
        return ''
    }

    async function accept() {
        if (clientRequest === undefined) throw "Invalid state: wiWallet and clientRequest cannot be null at this step";

        // transform each data
        const userData = requiredData.map(mapRequiredDataItemWithValue)

        const wiWallet = new sdk.wiExtensionWallet();
        const answer = await wiWallet.approveGetUserDataRequest(userData);

        const response: BackgroundRequest<ClientResponse> = {
            backgroundRequestType: BACKGROUND_REQUEST_TYPE.CLIENT_RESPONSE,
            payload: answer
        }

        console.log("[popup dashboard] Response:", response)
        browser.runtime.sendMessage(response);
        markAsAccepted();
    }

    const header = (
        <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-800">
                Personal Data Request
            </h2>
        </div>
    );

    const body = (
        <div className="space-y-4">
            <div className="bg-blue-50 border-l-2 border-blue-400 p-4 rounded-lg text-sm text-blue-700">
                An application is requesting access to your personal information. Please review the details below.
            </div>
            <OriginAndDateOfCurrentRequest/>

            <div className="mt-4">
                <p className="font-medium text-gray-700 mb-2 text-sm">
                    Requested Information:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {requiredData.map((d, i) => (
                        <div key={i} className="flex items-center mb-2 last:mb-0">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            <p className="text-sm text-gray-700">
                                {d}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
    const footer = <AcceptDeclineButtonsFooter accept={accept} />
    return <PopupNotificationLayout header={header} body={body} footer={footer}/>
}

function PopupGetEmail() {
    const markAsAccepted = useAccept();
    const activeAccount = useRecoilValue(activeAccountState);
    const clientRequest = useRecoilValue(clientRequestSessionState);

    async function accept() {
        if (clientRequest === undefined) throw "Invalid state: wiWallet and clientRequest cannot be null at this step";
        const wiWallet = new sdk.wiExtensionWallet();
        const answer = await wiWallet.approveGetEmailRequest(activeAccount?.email as string);
        console.log("[get email] answer:", answer)

        const response: BackgroundRequest<ClientResponse> = {
            backgroundRequestType: BACKGROUND_REQUEST_TYPE.CLIENT_RESPONSE,
            payload: answer
        };

        console.log("[popup dashboard] Response:", response)
        browser.runtime.sendMessage(response);
        markAsAccepted();
    }

    const header = (
        <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-800">
                Email Access Request
            </h2>
        </div>
    );

    const body = (
        <div className="space-y-4">
            <div className="bg-blue-50 border-l-2 border-blue-400 p-4 rounded-lg text-sm text-blue-700">
                An application is requesting access to your email address. Please review the details below.
            </div>
            <OriginAndDateOfCurrentRequest/>
        </div>
    )
    const footer = <AcceptDeclineButtonsFooter accept={accept}/>
    return <PopupNotificationLayout header={header} body={body} footer={footer}/>
}

function PopupIdleBody() {
    return (
        <div className="h-full w-full bg-white">
            <div className="h-full w-full flex flex-col justify-center items-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }}
                    className="bg-blue-50 p-5 rounded-full mb-6"
                >
                    <img 
                        src="/assets/img/logo.svg" 
                        className="w-16 h-16" 
                        alt="Carmentis Logo"
                    />
                </motion.div>
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Carmentis Wallet</h2>
                    <p className="text-sm text-gray-600 max-w-xs mb-6">
                        Your secure gateway to the Carmentis ecosystem
                    </p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button 
                            variant="contained" 
                            className="py-2.5 px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-sm transition-all duration-200"
                            onClick={() => {
                                const openMainRequest = {
                                    backgroundRequestType: BACKGROUND_REQUEST_TYPE.BROWSER_OPEN_ACTION,
                                    payload: { location: "main" }
                                };
                                browser.runtime.sendMessage(openMainRequest);
                            }}
                        >
                            Open Dashboard
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}



function PopupAuthByPublicKeyBody() {
    const maskAsAccepted = useAccept();
    const {clientRequest} = useClientRequest();
    const genKeyPair = useUserKeyPair()

    async function accept() {
        if (clientRequest === undefined) throw "Invalid state: wiWallet and clientRequest cannot be null at this step";
        const wiWallet = new sdk.wiExtensionWallet();
        const keyPair = await genKeyPair()
        const req = wiWallet.getRequestFromMessage(clientRequest.data)
        const answer = wiWallet.signAuthenticationByPublicKey(Encoders.ToHexa(keyPair.privateKey), req.object);

        const response: BackgroundRequest<ClientResponse> = {
            backgroundRequestType: BACKGROUND_REQUEST_TYPE.CLIENT_RESPONSE,
            payload: answer
        }

        console.log("[popup dashboard] Response:", response)
        browser.runtime.sendMessage(response);
        maskAsAccepted()
    }

    const header = (
        <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-.257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-800">
                Authentication Request
            </h2>
        </div>
    );

    const body = (
        <div className="space-y-4">
            <div className="bg-blue-50 border-l-2 border-blue-400 p-4 rounded-lg text-sm text-blue-700">
                An application wants you to authenticate. Please review the details below before approving.
            </div>
            <OriginAndDateOfCurrentRequest/>
        </div>
    )
    const footer = <AcceptDeclineButtonsFooter accept={accept}/>
    return <PopupNotificationLayout header={header} body={body} footer={footer}/>
}
