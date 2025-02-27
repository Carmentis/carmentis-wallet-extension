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

import React, {PropsWithChildren, ReactElement, useEffect, useRef, useState} from "react";
import {PopupNavbar} from "@/entrypoints/components/popup/PopupNavbar.tsx";
import "react-loading-skeleton/dist/skeleton.css";
import {activeAccountState, useWallet, walletState} from '@/entrypoints/contexts/authentication.context.tsx';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {clientRequestSessionState} from "@/entrypoints/states/client-request-session.state.tsx";
import {Box, Button, List, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";
import {Encoders} from "@/entrypoints/main/Encoders.tsx";
import {getUserKeyPair, Wallet} from "@/entrypoints/main/wallet.tsx";
import * as sdk from '@cmts-dev/carmentis-sdk/client';
import {
    BACKGROUND_REQUEST_TYPE,
    BackgroundRequest,
    CLIENT_REQUEST_TYPE,
    ClientAuthenticationResponse, ClientResponse, QRDataClientRequest,
} from "@/entrypoints/background.ts";
import {Splashscreen} from "@/entrypoints/components/Splashscreen.tsx";
import {Account} from "@/entrypoints/main/Account.tsx";
import {SpinningWheel} from "@/entrypoints/components/SpinningWheel.tsx";
import PopupEventApproval from "@/entrypoints/components/popup/popup-event-approval.tsx";
import {errorState} from "@/entrypoints/components/popup/popup-even-approval.state.ts";
import Skeleton from "react-loading-skeleton";


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

export interface Flow {
    applicationId: string;
    appDescription: {
        name: string,
        rootDomain: string,
        homepageUrl: string,
        logoUrl: string,
    },
    "flowObject": {
        "chain": {
            currentNonce: number,
            hash: Uint8Array,
            "microBlock":
                {
                    "version": 1,
                    "nonce": 1,
                    "ts": 1729169460,
                    "gas": 1890,
                    "gasPrice": 100000,
                }[]
        }
    }
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
    decline: () => void
}
export function AcceptDeclineButtonsFooter(props: AcceptDeclineButtonsFooterProps) {
    return <div className={"w-full flex  space-x-2"}>
        <div className={"w-1/2"} onClick={props.accept}>
            <Button className={"uppercase w-full"} variant={"contained"}>Accept</Button>
        </div>
        <div className={"w-1/2"} onClick={props.decline}>
            <Button className={"uppercase w-full"} variant={"contained"}>decline</Button>
        </div>
    </div>
}


function NotificationDataField( value: {value: string} ) {
    return <p className="w-100 p-2 bg-gray-100 rounded-md">
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
    const clientRequest = useRecoilValue(clientRequestSessionState);
    if (!clientRequest) return <Skeleton />;
    return <>
        <ValueWithLabel label={"Origin"} value={clientRequest.origin} />
        <ValueWithLabel label={"Received at"} value={new Date(clientRequest.timestamp).toLocaleString()} />
    </>
}


function PopupBody() {
    // the current client request stored in session (possibly undefined)
    const wallet = useRecoilValue(walletState);
    const activeAccount = useRecoilValue(activeAccountState);
    const [clientRequest, setClientRequest] = useRecoilState(clientRequestSessionState);
    const error = useRecoilValue(errorState);
    console.log("[popup dashboard] Current client request:", clientRequest)

    async function accept() {
        if (clientRequest === undefined) throw "Invalid state: wiWallet and clientRequest cannot be null at this step";
        const wiWallet = new sdk.wiExtensionWallet();
        const keyPair = await getUserKeyPair(wallet as Wallet, activeAccount as Account)
        const req = wiWallet.getRequestFromMessage(clientRequest.data)
        const answer = wiWallet.signAuthenticationByPublicKey(Encoders.ToHexa(keyPair.privateKey), req.object);

        const response: BackgroundRequest<ClientResponse> = {
            backgroundRequestType: BACKGROUND_REQUEST_TYPE.CLIENT_RESPONSE,
            payload: answer
        }

        console.log("[popup dashboard] Response:", response)
        browser.runtime.sendMessage(response);
        setClientRequest(undefined);
    }

    function decline() {
        setClientRequest(undefined);
    }

    // by default when there is no client request display the default dashboard
    if (error) return <PopupError/>
    if (!clientRequest)  return <PopupIdleBody/>
    const wiWallet = new sdk.wiExtensionWallet();
    const req = wiWallet.getRequestFromMessage(clientRequest.data)
    if (req.type === sdk.constants.SCHEMAS.WIRQ_AUTH_BY_PUBLIC_KEY) return <PopupAuthByPublicKeyBody accept={accept} decline={decline}/>
    if (req.type === sdk.constants.SCHEMAS.WIRQ_GET_EMAIL) return <PopupGetEmail/>
    if (req.type === sdk.constants.SCHEMAS.WIRQ_GET_USER_DATA) return <PopupGetUserData/>
    if (req.type === sdk.constants.SCHEMAS.WIRQ_DATA_APPROVAL) return <PopupEventApproval/>

    return <>You have a request!</>
}

function PopupError() {
    const [error, setError] = useRecoilState(errorState);
    const wallet = useRecoilValue(walletState);

    const header = <Typography variant={"h6"}>Error</Typography>
    const body = <>
        <p>
            An error occurred:
        </p>
        <NotificationDataField value={error.join(", ")}/>
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
    const activeAccount = useRecoilValue(activeAccountState);
    const [clientRequest, setClientRequest] = useRecoilState(clientRequestSessionState);
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
        setClientRequest(undefined);
    }

    async function decline() {
        setClientRequest(undefined)
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
    const footer = <AcceptDeclineButtonsFooter accept={accept} decline={decline}/>
    return <PopupNotificationLayout header={header} body={body} footer={footer}/>
}

function PopupGetEmail() {
    const activeAccount = useRecoilValue(activeAccountState);
    const [clientRequest, setClientRequest] = useRecoilState(clientRequestSessionState);

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
        setClientRequest(undefined);
    }

    async function decline() {
        setClientRequest(undefined)
    }

    const header =  <Typography variant={"h6"}>Email Access</Typography>;
    const body = <>
        <p>
            An application wants to access the email stored in your wallet.
        </p>
        <OriginAndDateOfCurrentRequest/>
    </>
    const footer = <AcceptDeclineButtonsFooter accept={accept} decline={decline}/>
    return <PopupNotificationLayout header={header} body={body} footer={footer}/>
}

function PopupIdleBody() {
    return <div className={"h-full w-full"}>
        <div id="popup-dashboard-main-container" className="h-full w-full flex justify-center items-center">
            <img src="/assets/img/logo.svg" className="w-20 h-20" alt=""/>
        </div>
    </div>
}



type ClientRequestApproveCallback = {
    accept: () => Promise<void>,
    decline: () => void,
}
function PopupAuthByPublicKeyBody(
    {accept, decline} : PropsWithChildren<ClientRequestApproveCallback>
) {
    const header = <Typography variant={"h6"}>Authentication request</Typography>;
    const body = <>
        <p>
            An application wants you to authenticate. You need to
            approve the authentication or decline if
            it is a mistake.
        </p>

        <OriginAndDateOfCurrentRequest/>
    </>
    const footer = <AcceptDeclineButtonsFooter accept={accept} decline={decline}/>
    return <PopupNotificationLayout header={header} body={body} footer={footer}/>
}