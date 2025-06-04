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
import PopupEventApproval from "@/entrypoints/components/popup/popup-event-approval.tsx";
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

function  PopupLayout({children}: PropsWithChildren) {
    return (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="h-[74px] w-full shadow-sm bg-white z-10">
                <PopupNavbar/>
            </div>
            <div className="w-full h-[calc(100%-74px)] p-4 overflow-auto">
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
        <div className="h-full w-full flex flex-col justify-between space-y-4 bg-white rounded-lg shadow-sm p-4">
            <div id="header" className="border-b border-gray-100 pb-3">
                {header}
            </div>
            <div id="body" className="flex-1 overflow-y-auto py-2">
                {body}
            </div>
            <div id="footer" className="pt-3 border-t border-gray-100">
                {footer}
            </div>
        </div>
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
            <div className="w-1/2">
                <Button 
                    onClick={handleAccept}
                    disabled={isAccepting}
                    className="uppercase w-full py-2 bg-green-500 hover:bg-green-600 text-white transition-all duration-200"
                    variant="contained"
                    startIcon={isAccepting ? (
                        <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : <CheckCircle className="h-4 w-4" />}
                >
                    {isAccepting ? "Processing..." : "Accept"}
                </Button>
            </div>
            <div className="w-1/2">
                <Button 
                    onClick={decline}
                    disabled={isAccepting}
                    className="uppercase w-full py-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    variant="outlined"
                >
                    Decline
                </Button>
            </div>
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
            <Typography variant="h6" className="text-gray-800">
                Error Occurred
            </Typography>
        </div>
    );

    const body = (
        <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
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
            onClick={() => setError(undefined)} 
            variant="contained"
        >
            Dismiss
        </Button>
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

    const header = <>
        <Typography variant={"h6"}>Personal Data Access</Typography>
        <p>
            An application wants to access your personal data.
        </p>
    </>
    const body = <>
        <OriginAndDateOfCurrentRequest/>
        <p className="font-bold">Shared Information</p>
        <p>
            The application wants the following information:
        </p>
        <ul>
            {requiredData.map(d => <li>- {d}</li>)}
        </ul>
    </>
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

    const header =  <Typography variant={"h6"}>Email Access</Typography>;
    const body = <>
        <p>
            An application wants to access the email stored in your wallet.
        </p>
        <OriginAndDateOfCurrentRequest/>
    </>
    const footer = <AcceptDeclineButtonsFooter accept={accept}/>
    return <PopupNotificationLayout header={header} body={body} footer={footer}/>
}

function PopupIdleBody() {
    return (
        <div className="h-full w-full">
            <div className="h-full w-full flex flex-col justify-center items-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        duration: 0.5
                    }}
                >
                    <img 
                        src="/assets/img/logo.svg" 
                        className="w-24 h-24 mb-6" 
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
                    <p className="text-sm text-gray-600 max-w-xs">
                        Your secure gateway to the Carmentis ecosystem
                    </p>
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

    const header = <Typography variant={"h6"}>Authentication request</Typography>;
    const body = <>
        <p>
            An application wants you to authenticate. You need to
            approve the authentication or decline if
            it is a mistake.
        </p>

        <OriginAndDateOfCurrentRequest/>
    </>
    const footer = <AcceptDeclineButtonsFooter accept={accept}/>
    return <PopupNotificationLayout header={header} body={body} footer={footer}/>
}
