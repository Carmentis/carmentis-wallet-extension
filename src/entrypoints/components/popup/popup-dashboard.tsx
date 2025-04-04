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

import React, {PropsWithChildren, ReactElement} from "react";
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
    return <>
        <div className={"h-[74px] w-full"}>
            <PopupNavbar/>
        </div>
        <div className={"w-full h-[calc(100%-74px)] p-4"}>
            {children}
        </div>
    </>
}


export type PopupNotificationProps = {
    header: ReactElement,
    body: ReactElement,
    footer: ReactElement,
};
export function PopupNotificationLayout({header, body, footer}: PopupNotificationProps) {
    return <div className={"h-full w-full flex flex-col justify-between space-y-2"}>
        <div id="header">
            {header}
        </div>
        <div id="body" className={"h-full max-h-full overflow-y-auto"}>
            {body}
        </div>
        <div id="footer" className={"w-full flex flex-row space-x-2"}>
            {footer}
        </div>
    </div>
}

export type AcceptDeclineButtonsFooterProps = {
    accept: () => void,
    decline?: () => void
}
export function AcceptDeclineButtonsFooter(props: AcceptDeclineButtonsFooterProps) {
    const clearRequest = useClearClientRequest();

    function decline() {
        if (props.decline) { props.decline() }
        else {
            clearRequest();
        }
    }

    return <div className={"w-full flex  space-x-2"}>
        <div className={"w-1/2"} onClick={props.accept}>
            <Button className={"uppercase w-full"} variant={"contained"}>Accept</Button>
        </div>
        <div className={"w-1/2"} onClick={decline}>
            <Button className={"uppercase w-full"} variant={"outlined"}>decline</Button>
        </div>
    </div>
}


function NotificationDataField( value: {value: string} ) {
    return <p className="w-full max-w-full  overflow-x-auto p-2 bg-gray-100 rounded-md">
        {value.value}
    </p>
}

function ValueWithLabel({label, value}: { label: string, value: string }) {
    return <div>
        <p className="font-bold">{label}</p>
        <NotificationDataField value={value}/>
    </div>
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
    return <Box width={'100%'} height={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"} >
        <img width={"100px"} src={image}/>
    </Box>
}

function PopupError() {
    const wallet = useWallet();
    const [error, setError] = useRecoilState(errorState);

    function renderNotificationError( error: unknown ) {
        if (typeof error === 'string') {
            return <NotificationDataField value={error}/>
        } else if (Array.isArray(error) && error.every(v => typeof v === 'string')) {
            return  <NotificationDataField value={error.join(", ")}/>
        } else if ( 'message' in error && typeof error.message === 'string' ) {
            return  <NotificationDataField value={error.message}/>
        } else if (typeof error !== 'undefined' && 'toString' in error && typeof error.toString === 'function') {
            return  <NotificationDataField value={error.toString()}/>
        } else {
            return <NotificationDataField value={`${error}`}/>
        }
    }

    const header = <Typography variant={"h6"}>Error</Typography>
    const body = <>
        <p>
            An error occurred:
        </p>
        {renderNotificationError(error)}
        <p>

            The error might be caused by an invalid configuration of the server or an incorrect setup of your
            wallet.
            Please ensure that the application and your wallet are connected to the same network to avoid
            compatibility issues. You are currently connected to the following node:
        </p>
        <NotificationDataField value={wallet?.nodeEndpoint!}/>
    </>
    const footer = <Button className={"uppercase w-full"} onClick={() => setError(undefined)} variant={"contained"}>Close</Button>

    return <PopupNotificationLayout header={header} body={body} footer={footer}/>
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
    return <div className={"h-full w-full"}>
        <div id="popup-dashboard-main-container" className="h-full w-full flex justify-center items-center">
            <img src="/assets/img/logo.svg" className="w-20 h-20" alt=""/>
        </div>
    </div>
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