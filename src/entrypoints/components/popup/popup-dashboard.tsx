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

import React, {PropsWithChildren, useEffect, useRef} from "react";
import {PopupNavbar} from "@/entrypoints/components/popup/PopupNavbar.tsx";
import "react-loading-skeleton/dist/skeleton.css";
import {activeAccountState, useWallet, walletState} from '@/entrypoints/contexts/authentication.context.tsx';
import {useRecoilState, useRecoilValue} from "recoil";
import {clientRequestSessionState} from "@/entrypoints/states/client-request-session.state.tsx";
import {Button, Typography} from "@mui/material";
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
        <PopupNavbar/>
        <div className={"w-full h-full p-4"}>
            {children}
        </div>
    </>
}


function PopupBody() {
    // the current client request stored in session (possibly undefined)
    const wallet = useRecoilValue(walletState);
    const activeAccount = useRecoilValue(activeAccountState);
    const [clientRequest, setClientRequest] = useRecoilState(clientRequestSessionState);
    console.log("[popup dashboard] Current client request:", clientRequest)

    async function accept() {
        if (clientRequest === undefined) throw "Invalid state: wiWallet and clientRequest cannot be null at this step";
        const wiWallet = new sdk.wiExtensionWallet();
        const keyPair = await getUserKeyPair(wallet as Wallet, activeAccount as Account)
        const req = wiWallet.getRequestFromMessage(clientRequest.data)
        console.log(req, req.object, req.object.challenge)
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
    if (!clientRequest)  return <PopupIdleBody/>
    const wiWallet = new sdk.wiExtensionWallet();
    const req = wiWallet.getRequestFromMessage(clientRequest.data)
    if (req.type === sdk.constants.SCHEMAS.WIRQ_AUTH_BY_PUBLIC_KEY) return <PopupAuthByPublicKeyBody accept={accept} decline={decline}/>
    if (req.type === sdk.constants.SCHEMAS.WIRQ_GET_EMAIL) return <PopupGetEmail/>
    if (req.type === sdk.constants.SCHEMAS.WIRQ_GET_USER_DATA) return <PopupGetUserData/>

    return <>You have a request!</>
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

    return <div className={"h-full w-full flex flex-col justify-between"}>
        <div id="header">
            <Typography variant={"h6"}>Personal Data Access</Typography>
        </div>
        <div id="body" className={"h-full"}>
            <p>
                An application wants to access your personal data.
            </p>
            <p className="font-bold">Origin</p>
            <p className="w-100 p-2 bg-gray-100 rounded-md">
                {clientRequest.origin}
            </p>
            <p className="font-bold">Received at</p>
            <p className="w-100 p-2 bg-gray-100 rounded-md">
                {new Date(clientRequest.timestamp).toLocaleString()}
            </p>
            <p className="font-bold">Shared Information</p>
            <div className="w-100 p-2 bg-gray-100 rounded-md">
                {requiredData.map(d => <span>{d}</span>)}
            </div>
        </div>
        <div id="footer" className={"w-full flex flex-row space-x-2"}>
            <div className={"w-1/2"} onClick={accept}>
                <Button className={"uppercase w-full"} variant={"contained"}>Accept</Button>
            </div>
            <div className={"w-1/2"} onClick={decline}>
                <Button className={"uppercase w-full"} variant={"contained"} >decline</Button>
            </div>
        </div>
    </div>
}

function PopupGetEmail() {
    const activeAccount = useRecoilValue(activeAccountState);
    const [clientRequest, setClientRequest] = useRecoilState(clientRequestSessionState);

    async function accept() {
        if (clientRequest === undefined) throw "Invalid state: wiWallet and clientRequest cannot be null at this step";
        const wiWallet = new sdk.wiExtensionWallet();
        //const answer = wiWallet.approveGetEmailRequest(activeAccount?.email as string);
        const answer = await wiWallet.approveGetEmailRequest(activeAccount?.email as string);
        console.log("[get email] answer:", answer)


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


    return <div className={"h-full w-full flex flex-col justify-between"}>
        <div id="header">
            <Typography variant={"h6"}>Email Access</Typography>
        </div>
        <div id="body" className={"h-full"}>
            <p>
                An application wants to access the email stored in your wallet.
            </p>
            <p className="font-bold">Origin</p>
            <p className="w-100 p-2 bg-gray-100 rounded-md">
                {clientRequest.origin}
            </p>
            <p className="font-bold">Received at</p>
            <p className="w-100 p-2 bg-gray-100 rounded-md">
                {new Date(clientRequest.timestamp).toLocaleString()}
            </p>
        </div>
        <div id="footer" className={"w-full flex flex-row space-x-2"}>
            <div className={"w-1/2"}>
                <Button className={"uppercase w-full"} variant={"contained"} onClick={accept}>Accept</Button>
            </div>
            <div className={"w-1/2"}>
                <Button className={"uppercase w-full"} variant={"contained"} onClick={decline}>decline</Button>
            </div>
        </div>
    </div>
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
    const [cr, setClientRequest] = useRecoilState(clientRequestSessionState);
    const clientRequest = cr as QRDataClientRequest;

    function onAccept(e:MouseEvent) {
        e.preventDefault();
        accept();
    }

    function onDecline(e:MouseEvent){
        e.preventDefault();
        decline();
    }

    return <div className={"h-full w-full flex flex-col justify-between"}>
        <div id="header">
            <Typography variant={"h6"}>Authentication request</Typography>
        </div>
        <div id="body" className={"h-full"}>
            <p>
                An application wants you to authenticate. You need to
                approve the authentication or decline if
                it is a mistake.
            </p>
            <p className="font-bold">Origin</p>
            <p className="w-100 p-2 bg-gray-100 rounded-md">
                {clientRequest.origin}
            </p>
            <p className="font-bold">Received at</p>
            <p className="w-100 p-2 bg-gray-100 rounded-md">
                {new Date(clientRequest.timestamp).toLocaleString()}
            </p>
        </div>
        <div id="footer" className={"w-full flex flex-row space-x-2"}>
            <div className={"w-1/2"}>
                <Button className={"uppercase w-full"} variant={"contained"} onClick={onAccept}>Accept</Button>
            </div>
            <div className={"w-1/2"}>
                <Button className={"uppercase w-full"} variant={"contained"} onClick={onDecline}>decline</Button>
            </div>
        </div>
    </div>
}




/***

 // load the different contexts
 const authenticationContext = useAuthenticationContext();
 let logger = useContext(LoggerContext);


 // load the authentication data
 const [wallet, setWallet] = useRecoilState(walletState);
const activeAccount = useRecoilValue(activeAccountState);

// create a reference on the action messages
const [localActionMessageOption, setLocalActionMessageOption] = useState<Optional<ClientRequest>>(
    Optional.Empty()
);

// initialize the Carmentis wallet callback (should be set at every rendering)
Carmentis.wallet.setRequestCallback(handleClientRequest, handleServerRequest)

// create some references to handle the confirmation of the block and add it in the history
const confirmRecordDetails = useRef<RecordConfirmationData>({
    applicationId: undefined,
    applicationName: undefined,
    applicationVersion: undefined,
    flowId: undefined,
    gas: undefined,
    gasPrice: undefined,
    microBlockId: undefined,
    nonce: undefined,
    rootDomain: undefined,
    ts: undefined,
    data: undefined,
    authorPublicKey: undefined
})


// states for the dashboard
let [showWaitingScreen, setShowWaitingScreen] = useState<boolean>(false);
let [error, setError] = useState<string>("");

// if an action message is defined and contains some processing data, then an event approval is under execution
// restore it
let initialState = RequestTreatmentState.IN_PROGRESS;
let [actionRequestState, setActionRequestState] = useState<RequestTreatmentState>(initialState);

function executeBackgroundTask(
    task : Promise<void>,
    option : BackgroundTaskExecutionOption = {
        closeWaitingScreenOnSuccess: true
    }
) {
    // assert that options are correctly defined
    if ( typeof option.closeWaitingScreenOnSuccess !== "boolean" ) {
        throw new Error("closeWaitingScreenOnSuccess must be boolean");
    }

    // execute the task
    setShowWaitingScreen(true);
    task.then(() => {
        if ( option.closeWaitingScreenOnSuccess ) {
            setShowWaitingScreen(false);
        }
    }).catch((error) => {
        setShowWaitingScreen(false);
        AbortWithError(error);
    })
}



function CloseOnSuccess() {
    setError("")
    setActionRequestState(RequestTreatmentState.SUCCESS)
    setShowWaitingScreen(false);
    deleteClientRequest()
    setTimeout(() => {
        //window.close()
    }, 1000)

}

function AbortWithError( error : string | Error ) {
    console.error("[popup] aborting with error: ", error)
    if ( error instanceof Error ) {
        error = error.message;
    }
    setError(error)
    setActionRequestState(RequestTreatmentState.ERROR);
    setShowWaitingScreen(false);
}


function RejectRequest() {
    logger.info(`[popup] Reject approval`)
    deleteClientRequest()
    window.close()
}



function AllowQRCodeProcess(QRCodeData: string) {
    // if the QRCodeData is undefined, it is highly due to an expired page.
    if ( QRCodeData == undefined ) {
        AbortWithError( "The QR code seems outdated, please reload the QR code and retry." );
        return
    }

    console.log("[popup] at allow QRCode process: ", localActionMessageOption)

    logger.info(`[popup] Start QRCode request with ${QRCodeData}`)
    executeBackgroundTask(new Promise<void>((resolve, reject) => {
        return Carmentis.wallet.getRequestByQRCode(QRCodeData)
            .then(request => {
                logger.info("[popup] QRCode request: response: ", request)
                if (request) {
                    request.accept().then(response => {
                        console.log("[popup] request accepted with response from the server:", response);
                    }).catch(reject)
                } else {
                    reject("Returned response is empty.")
                }
            })
    }));
}



async function handleClientRequest(request) {
    logger.info("[popup] receive client request from operator", request);

    if ( !clientRequest ) {
        throw new Error("no action messages");
    } else {
        console.log("[popup] there is an action message!", clientRequest);
    }

    console.log("[popup] action messages: ", clientRequest)


    switch (request.type) {
        case "signIn": {
            setShowWaitingScreen(false);
            updateActionMessageType("signIn");
            break;
        }
        case "authentication": {
            setShowWaitingScreen(false);
            updateActionMessageType("authentication")
            break;
        }
        case "eventApproval": {
            actionMessage.type = "eventApproval";
            prepareRequestEventApproval(request)
            updateActionMessageType("eventApproval");
            break;
        }
        default:
            AbortWithError("Unknown request type: " + request.type);
            break;
    }

    function updateActionMessageType(type : "signIn" | "authentication" | "eventApproval") {

    }
}


function onAcceptSignInRequest() {

    // generate the private signature key and derive the public signature key from it
    const currentActionMessageOption = localActionMessageOption;
    if ( currentActionMessageOption.isEmpty()  ) {
        throw new Error("container Empty container")
    }

    const currentActionMessage = currentActionMessageOption.unwrap();
    const request = currentActionMessage.clientRequest;




    executeBackgroundTask(new Promise<void>(async (resolve, reject) => {
        if (!wallet || !activeAccount) return;
        const keyPair = await getUserKeyPair(wallet, activeAccount);
        const message = Encoders.FromHexa(request.data.sessionPublicKey)
        const signature = sdk.crypto.secp256k1.sign(keyPair.privateKey, message);
        resolve();
        CloseOnSuccess()
        request.answer({
            success: true,
            data: {
                pubKey: Encoders.ToHexa(keyPair.publicKey),
                sessionPubKeySignature: Encoders.ToHexa(signature)
            }
        });
    }));
}


function prepareRequestEventApproval( request ) {
    // TODO redo the function
    /*
    const [applicationId, recordId] = request.data.id.split("-");

    executeBackgroundTask(new Promise<void>((resolve,reject) => {
        console.log("[popup] executing background request event approval")

        const activeAccount = wallet.getActiveAccount().unwrap();
        wallet.getUserKeyPairForAppliaction(activeAccount, applicationId)
            .then(userKeyPair => {
                return request.answer({
                    message: "walletHandshake",
                    recordId: recordId,
                    publicKey: Encoders.ToHexa(userKeyPair.publicKey)
                })
            }).then(answer => {
                console.log("[popup] The anwser has respond with an answer: ", answer)
                // we voluntary do not resolve the request since we do want to remove the spinning wheel
                //resolve()
            }).catch(error => {
                console.error("[popup] The event approval process has failed: ", error);
                reject(error)
            })
    }), {
        closeWaitingScreenOnSuccess: false
    });
     *
}


function acceptRequestEventApproval() {
    const actionMessage = localActionMessageOption.unwrap();
    if ( !actionMessage.serverRequest ) {
        throw new Error("Illegal state: the action message should embed a server request.")
    }
    const request = actionMessage.serverRequest;
    executeBackgroundTask(new Promise((resolve, reject) => {
        request.answer({
            message: "confirmRecord",
            recordId: request.data.recordId
        });

        request.clientAnswer({
            success: true,
            recordId: request.data.recordId
        });
    }));
}


function handleRequestAuthentication() {
    // TODO do the handle request authentication
    /*
    const actionMessage = localActionMessageOption.unwrap();
    if ( !actionMessage.clientRequest ) {
        throw new Error("Illegal state: the action message should embed a client request.")
    }
    let request = actionMessage.clientRequest;

    // handle the case where the user's email is not verified
    if (!activeAccount.getEmail().isEmpty() && activeAccount.hasVerifiedEmail()) {
        let emailProof: EmailValidationProofData = activeAccount.getEmailValidationProofData();
        request.answer({
            success: true,
            proof: emailProof
        });
        CloseOnSuccess()
    } else {
        AbortWithError("Your email has not been configured or is not verified.")
    }
     *
}


function handleServerRequest(serverRequest : ServerRequest | ConfirmRecordRequest) {

    // debug
    console.log("[popup] receive server request:", serverRequest);
    console.log("[popup] action messages: ", actionMessages)

    switch (serverRequest.type) {
        case "blockData": {
            requestBlockData(serverRequest as ServerRequest);
            break;
        }
        case "confirmRecord": {
            handleConfirmRecord(serverRequest as ConfirmRecordRequest);
            break;
        }
        default:
            throw new Error("[popup] Unknown request type: " + serverRequest.type);
    }
}




function requestBlockData(serverRequest : ServerRequest) {
    let data = String.fromCharCode.apply(String, serverRequest.data.blockData);
    console.log("[popup] requestBlockData:", serverRequest, data);

    executeBackgroundTask(new Promise<void>((resolve, reject) => {
        Carmentis.prepareApproval(
            serverRequest.data.applicationId,
            serverRequest.data.flowId,
            new Uint8Array(serverRequest.data.blockData)
        ).then((flow : Flow) => {
            console.log("[popup] received flow: ", flow)

            // process the record based on the current block
            const nbBlocks = flow.flowObject.chain.microBlock.length;
            const currentBlock = flow.flowObject.chain.microBlock[nbBlocks-1];
            const nonce =  currentBlock.nonce;
            Carmentis.processRecord(flow, nonce).then(res => {
                console.log("[popup] processRecord output: ", res)
                if (res === undefined) {
                    reject("Failure when processing record: empty records.")
                }

                // store the record details from the result
                confirmRecordDetails.current.applicationId = flow.applicationId;
                confirmRecordDetails.current.gas = currentBlock.gas;
                confirmRecordDetails.current.gasPrice = currentBlock.gasPrice;
                confirmRecordDetails.current.ts = currentBlock.ts;
                confirmRecordDetails.current.applicationName = flow.appDescription.name;
                confirmRecordDetails.current.applicationVersion = currentBlock.version;
                confirmRecordDetails.current.rootDomain = flow.appDescription.rootDomain;
                confirmRecordDetails.current.data = res
                confirmRecordDetails.current.flowId = serverRequest.data.flowId
                confirmRecordDetails.current.nonce = flow.flowObject.chain.currentNonce;

                /*
                // store the processRecord in the session
                setActionMessages((messages : ClientRequest[]) => {
                    messages[0].eventApprovalData = res;
                    return messages
                })
                 *

                resolve()
            }).catch(reject)

        }).catch((error : Error) => {
            console.error("An error occurred while handling requestBlockData:", error)
            reject(error)
        });
    }));

}

interface ConfirmRecordRequest {
    type: "confirmRecord";
    data: {
        flowId: string,
        microBlockId: string,
        nonce: number
    }
}
function handleConfirmRecord(request: ConfirmRecordRequest) {
    console.log("[popup] confirm record:", request);

    // set the final block's information in the history
    confirmRecordDetails.current.flowId = request.data.flowId;
    confirmRecordDetails.current.microBlockId = request.data.microBlockId;
    confirmRecordDetails.current.nonce = request.data.nonce;

    // insert the block in indexeddb
    AccountDataStorage.connectDatabase(activeAccount).then((db) => {
        return db.addApprovedBlockInActiveAccountHistory( confirmRecordDetails.current )
    }).then(() => {
        CloseOnSuccess()
    })

    /*
    setWallet(walletOption => {
        const wallet = walletOption.unwrap();
        const updatedWallet = wallet.addApprovedBlockInActiveAccountHistory(
            {...confirmRecordDetails.current}
        );
        return Optional.From(updatedWallet)
    })


    CloseOnSuccess()
     *
}

return <>
        <PopupNavbar/>
        <div className="h-full">
            {clientRequest !== undefined ? clientRequest.id : ''}
            { !showWaitingScreen && localActionMessageOption.isEmpty() &&
                <div id="popup-dashboard-main-container" className="h-full w-full flex justify-center items-center">
                    <img src="/src/assets/img/logo.svg" className="w-20 h-20" alt=""/>
                </div>
            }
            { !showWaitingScreen && !localActionMessageOption.isEmpty()  &&
                <>
                    { actionRequestState == RequestTreatmentState.IN_PROGRESS &&
                        <>
                            { localActionMessageOption.unwrap().type === "unknown" &&
                                <QRCodeProcessRequestApproval
                                    message={localActionMessageOption.unwrap()}
                                    onAccept={AllowQRCodeProcess}
                                    onReject={RejectRequest}/>
                            }

                            { localActionMessageOption.unwrap().type === "signIn" &&
                                <SignInRequestApproval onAccept={onAcceptSignInRequest} onReject={RejectRequest}></SignInRequestApproval>
                            }

                            { localActionMessageOption.unwrap().type === "eventApproval" &&
                                <EventRequestApproval
                                    applicationName={confirmRecordDetails.current.applicationName}
                                    applicationId={confirmRecordDetails.current.applicationId}
                                    flowId={confirmRecordDetails.current.flowId}
                                    nonce={confirmRecordDetails.current.nonce}
                                    data={Optional.From(localActionMessageOption.unwrap().eventApprovalData)}
                                    onAccept={acceptRequestEventApproval}
                                    onReject={RejectRequest}></EventRequestApproval>
                            }

                            { localActionMessageOption.unwrap().type === "authentication"&&
                                <AuthenticationRequest
                                    email={activeAccount.email}
                                    onAccept={handleRequestAuthentication}
                                    onReject={RejectRequest}></AuthenticationRequest>
                            }
                        </>
                    }

                    {actionRequestState == RequestTreatmentState.ERROR &&
                        <div className="flex flex-col h-full w-full p-4">
                            <h3>Request Error</h3>
                            <p>An error has been detected during the execution of the process.</p>
                            <p className="p-4 bg-red-100 rounded-md w-100 ">
                                {error}
                            </p>
                            <p>The problem may come from an outdated request, please close the request and retry.</p>
                            <button className="w-100 btn-primary"
                                    onClick={RejectRequest}>
                                Close
                            </button>
                        </div>
                    }
                </>
            }
            {showWaitingScreen &&
                <div className="w-full h-full flex items-center justify-center mt-6">
                    <div className="h-12 w-12">

                        <SpinningWheel/>
                    </div>
                </div>

            }
            {actionRequestState == RequestTreatmentState.SUCCESS &&
                <div className="flex min-h-full justify-center content-center w-100 items-center">
                    <img src="/src/assets/img/approve.png" className="h-20 w-20" alt=""/>
                </div>
            }
        </div>

    </>
***/