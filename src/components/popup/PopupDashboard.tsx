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
import "react-loading-skeleton/dist/skeleton.css";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {Box, Button, Typography} from "@mui/material";
import {getUserKeyPair} from "@/entrypoints/main/wallet.tsx";
import {
    EncoderFactory, WalletRequestType, WalletRequestValidation, WalletResponse,
    wiExtensionWallet,
} from "@cmts-dev/carmentis-sdk/client";
import {BACKGROUND_REQUEST_TYPE, BackgroundRequest, ClientResponse,} from "@/entrypoints/background.ts";
import PopupEventApproval from "@/components/popup/PopupEventApproval.tsx";
import {errorState} from "@/components/popup/states.ts";
import Skeleton from "react-loading-skeleton";
import image from '@/assets/success.png';
import { motion } from "framer-motion";
import { CheckCircle } from "react-bootstrap-icons";
import {activeAccountState, clientRequestSessionState, showSuccessScreenState, walletState} from "@/states/globals.tsx";
import {Account} from "@/types/Account.ts";
import {Wallet} from "@/types/Wallet.ts";
import CarmentisLogoDark from "@/components/shared/CarmentisLogoDark.tsx";
import {
    ClientBridgeValidation
} from "../../../../carmentis-core/src/common/type/valibot/clientBridge/ClientBridgeEncoder.ts";
import {wallet} from "@/lib/carmentis-nodejs-sdk";



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
    console.log("Client request in useClientRequest:", clientRequest)
    const noRequest = clientRequest === undefined;
    const error = useRecoilValue(errorState);
    const success = useRecoilValue(showSuccessScreenState);
    const walletRequest = clientRequest ? WalletRequestValidation.validateWalletRequest(clientRequest.data) : undefined;
    return { walletRequest, clientRequest, noRequest, error, success  };
}

export function PopupDashboard() {
    return <PopupLayout>
        <PopupBody/>
    </PopupLayout>
}

function PopupLayout({children}: PropsWithChildren) {
    return (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="w-full h-full p-3 overflow-auto">
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
            className="h-full w-full flex flex-col justify-between space-y-2 bg-white rounded-lg shadow-sm p-3"
        >
            <motion.div 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="border-b border-gray-50 pb-2"
            >
                {header}
            </motion.div>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 overflow-y-auto py-1"
            >
                {body}
            </motion.div>
            <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-2 border-t border-gray-50"
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
        <div className="w-full flex space-x-2">
            <motion.div 
                className="w-1/2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Button 
                    onClick={handleAccept}
                    disabled={isAccepting}
                    className="w-full py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm transition-all duration-200 rounded-md"
                    variant="contained"
                    size="small"
                    startIcon={isAccepting ? (
                        <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : <CheckCircle className="h-3.5 w-3.5" />}
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
                    className="w-full py-1.5 border-gray-200 text-gray-700 hover:bg-gray-50 text-sm transition-all duration-200 rounded-md"
                    variant="outlined"
                    size="small"
                >
                    Decline
                </Button>
            </motion.div>
        </div>
    );
}


function NotificationDataField({ value }: { value: string }) {
    return (
        <div className="w-full max-w-full overflow-hidden rounded-md bg-gray-50 border border-gray-100">
            <div className="p-2.5 overflow-x-auto font-mono text-sm text-gray-700 break-all">
                {value}
            </div>
        </div>
    );
}

function ValueWithLabel({ label, value }: { label: string, value: string }) {
    return (
        <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1.5">{label}</p>
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
    const {walletRequest, clientRequest, noRequest, error, success} = useClientRequest();
    console.log(walletRequest, clientRequest)

    // by default when there is no client request display the default dashboard
    if (error) return <PopupError/>
    if (success) return <PopupSuccess/>
    if (noRequest)  return <PopupIdleBody/>
    if (walletRequest.type === WalletRequestType.AUTH_BY_PUBLIC_KEY) return <PopupAuthByPublicKeyBody/>
    if (walletRequest.type === WalletRequestType.DATA_APPROVAL) return <PopupEventApproval/>

    return <>You have a request!</>
}

function PopupSuccess() {
    return (
        <Box 
            width={'100%'} 
            height={"100%"} 
            display={"flex"} 
            flexDirection={"column"}
            justifyContent={"center"} 
            alignItems={"center"}
            className="p-6"
        >
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20 
                }}
                className="bg-green-100 rounded-full p-4 mb-4"
            >
                <CheckCircle className="text-green-600 h-12 w-12" />
            </motion.div>

            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
            >
                <Typography variant="h6" className="text-gray-800 mb-2">
                    Success!
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                    Your request has been processed
                </Typography>
            </motion.div>
        </Box>
    );
}

export function PopupError(input: { error?: Error }) {
    const wallet = useWallet();
    const clearClientRequest = useClearClientRequest();
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

    function clear() {
        setError(undefined);
        clearClientRequest()
    }

    const errorMessage = renderNotificationError(error);

    const header = (
        <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            </div>
            <Typography variant="h6" className="text-gray-800">
                Error Occurred
            </Typography>
        </div>
    );

    const body = (
        <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                <div className="flex">
                    <div className="shrink-0">
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

            <div>
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
        <Button 
            className="uppercase w-full py-2 bg-red-500 hover:bg-red-600 text-white transition-all duration-200" 
            onClick={clear}
            variant="contained"
        >
            Dismiss
        </Button>
    );

    return <PopupNotificationLayout header={header} body={body} footer={footer} />;
}


function PopupIdleBody() {
    return (
        <div className="h-full w-full bg-linear-to-b from-gray-50 to-white">
            <div className="h-full w-full flex flex-col justify-center items-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }}
                    className="bg-white p-4 rounded-full shadow-sm mb-4"
                >
                    <CarmentisLogoDark/>
                </motion.div>
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                >
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Carmentis Wallet</h2>
                    <p className="text-xs text-gray-600 max-w-xs mb-4">
                        Your secure gateway to the Carmentis ecosystem
                    </p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-center space-x-2 mt-2"
                    >
                        <Button 
                            variant="outlined" 
                            size="small"
                            className="text-xs py-1 px-3 text-blue-600 border-blue-200"
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
    const {walletRequest} = useClientRequest();
    const genKeyPair = useUserKeyPair()


    async function accept() {
        if (walletRequest === undefined || walletRequest.type !== WalletRequestType.AUTH_BY_PUBLIC_KEY) throw "Invalid state: wiWallet and clientRequest cannot be null at this step";
        const wiWallet = new wiExtensionWallet();
        const keyPair = await genKeyPair()
        const answer = await wiWallet.signAuthenticationByPublicKey(
            keyPair.privateKey,
            walletRequest
        );

        const response: BackgroundRequest<WalletResponse> = {
            backgroundRequestType: BACKGROUND_REQUEST_TYPE.CLIENT_RESPONSE,
            payload: answer
        }

        console.log("[popup dashboard] Response:", response)
        browser.runtime.sendMessage(response);
        maskAsAccepted()
    }

    const header = (
        <Box className="flex items-center">
            <Box className="bg-blue-50 p-1.5 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-.257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                </svg>
            </Box>
            <Typography variant="subtitle1" className="font-medium text-gray-800">
                Authentication Request
            </Typography>
        </Box>
    );

    const body = (
        <Box className="space-y-3">
            <Box className="bg-blue-50 border-l-2 border-blue-400 p-2 rounded-r-md text-xs text-blue-700">
                An application wants you to authenticate. Please review the details below before approving.
            </Box>
            <OriginAndDateOfCurrentRequest/>
        </Box>
    )
    const footer = <AcceptDeclineButtonsFooter accept={accept}/>
    return <PopupNotificationLayout header={header} body={body} footer={footer}/>
}
