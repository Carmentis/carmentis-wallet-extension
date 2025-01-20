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

import React, {useContext, useEffect, useRef, useState} from "react";
import {ActionMessage} from "@/entrypoints/main/ActionMessage.tsx";
import {ActionMessageContext} from "@/entrypoints/main/components/commons/ActionMessage.tsx";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js"
import * as sdk from '@cmts-dev/carmentis-sdk';
import {Wallet} from "@/entrypoints/main/Wallet.tsx";
import {Encoders} from "@/entrypoints/main/Encoders.tsx";
import {Account, EmailValidationProofData} from "@/entrypoints/main/Account.tsx";
import {QRCodeProcessRequestApproval} from "@/entrypoints/main/components/popup/QRCodeProcessRequestApproval.tsx";
import {PopupNavbar} from "@/entrypoints/main/components/popup/PopupNavbar.tsx";
import {Optional} from "@/entrypoints/main/Optional.tsx";
import {SpinningWheel} from "@/entrypoints/main/components/commons/SpinningWheel.tsx";
import {SignInRequestApproval} from "@/entrypoints/main/components/popup/SignInRequestApproval.tsx";
import {EventRequestApproval} from "@/entrypoints/main/components/popup/EventRequestApproval.tsx";
import {AuthenticationRequest} from "@/entrypoints/main/components/popup/AuthenticationRequest.tsx";
import "react-loading-skeleton/dist/skeleton.css";
import {
    LoggerContext
} from "@/entrypoints/main/components/commons/authentication-manager.tsx";
import {IndexedStorage} from "@/entrypoints/main/IndexedStorage.tsx";
import { useAuthenticationContext } from '@/entrypoints/main/contexts/authentication.context.tsx';

// the request state is only meaningful when a request is running.
enum RequestTreatmentState {
    IN_PROGRESS = "IN_PROGRESS",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
}


interface BackgroundTaskExecutionOption {
    showWaitingScreen?: boolean;
    closeWaitingScreenOnSuccess?: boolean
}

interface ServerRequest {
    "type": "blockData" | "confirmRecord",
    "data": {
        "recordId": string,
        "applicationId": string,
        "flowId": string | undefined,
        "blockData": string
    }
}



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


    // load the different contexts
    const authenticationContext = useAuthenticationContext();
    const { actionMessages, setActionMessages } = useContext(ActionMessageContext);
    let logger = useContext(LoggerContext);

    // load the authentication data
    const wallet: Wallet = authenticationContext.wallet.unwrap();
    const setWallet = authenticationContext.setWallet;
    let activeAccount: Account = wallet.getActiveAccount().unwrap();

    // create a reference on the action messages
    const [localActionMessageOption, setLocalActionMessageOption] = useState<Optional<ActionMessage>>(
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


    // update the page when the action messages is updated
    useEffect(() => {
        setActionRequestState(RequestTreatmentState.IN_PROGRESS)
        if ( actionMessages.length === 0 ) {
            setLocalActionMessageOption(Optional.Empty())
        } else {
            setLocalActionMessageOption(Optional.From(actionMessages[0]))
        }
    }, [actionMessages]);

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


    /**
     * Function called on the success.
     *
     * @constructor
     */
    function CloseOnSuccess() {
        setError("")
        setActionRequestState(RequestTreatmentState.SUCCESS)
        setShowWaitingScreen(false);
        setActionMessages([])
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

    /**
     * Event function called when the user rejects to perform an action.
     *
     * This function can be called at several places and is used to clean the state.
     *
     */
    function RejectRequest() {
        logger.info(`[popup] Reject approval`)
        setActionMessages([])
        window.close()
    }


    /**
     * Event function called when the user agreed to execute an action indicated by the QRCode.
     *
     * @param QRCodeData
     *
     * @constructor
     */
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


    /**
     * This function is the client callback function called by the Carmentis SDK when a request is received and
     * must be handled.
     *
     * @param request The received request to handle.
     */
    async function handleClientRequest(request) {
        logger.info("[popup] receive client request from operator", request);

        if ( actionMessages.length === 0 ) {
            throw new Error("no action messages");
        } else {
            console.log("[popup] there is an action message!", actionMessages);
        }

        const actionMessage : ActionMessage = actionMessages[0];
        setActionMessages(messages => {
            messages[0].clientRequest = request;
            return messages
        });
        console.log("[popup] action messages: ", actionMessages)


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
            setActionMessages(messages => {
                messages[0].type = type;
                return messages
            });
        }
    }


    /**
     * This function is called when the user accepts to sign-in.
     *
     *
     */
    function onAcceptSignInRequest() {

        // generate the private signature key and derive the public signature key from it
        const wallet: Wallet = authenticationContext.wallet.unwrap();
        const currentActionMessageOption = localActionMessageOption;
        if ( currentActionMessageOption.isEmpty()  ) {
            throw new Error("container Empty container")
        }

        const currentActionMessage = currentActionMessageOption.unwrap();
        const request = currentActionMessage.clientRequest;




        executeBackgroundTask(new Promise<void>((resolve, reject) => {
            const activeAccount = wallet.getActiveAccount().unwrap();
            wallet.getAccountAuthenticationKeyPair(activeAccount).then(keyPair => {
                Carmentis.sign(keyPair.privateKey, Encoders.FromHexa(request.data.sessionPublicKey))
                    .then(signature => {
                        resolve();
                        CloseOnSuccess()
                        request.answer({
                            success: true,
                            data: {
                                pubKey: Encoders.ToHexa(keyPair.publicKey),
                                sessionPubKeySignature: Encoders.ToHexa(signature)
                            }
                        });
                })
            })
        }));
    }


    function prepareRequestEventApproval( request ) {
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
    }

    /**
     * This function is called when the wallet receives an event approval request.
     *
     * An event approval request is called mainly when the approval of a user is required.
     */
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

    /**
     * Handle authentication request.
     *
     *
     */
    function handleRequestAuthentication() {
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

    }


    /**
     * Event function called when a request is received from the server
     *
     * @param serverRequest
     */
    function handleServerRequest(serverRequest : ServerRequest | ConfirmRecordRequest) {

        // debug
        console.log("[popup] receive server request:", serverRequest);
        console.log("[popup] action messages: ", actionMessages)

        switch (serverRequest.type) {
            case "blockData": {
                // we update the serverRequest if and only a request is under processing which is not the case here
                setActionMessages(messages => {
                    messages[0].serverRequest = serverRequest;
                    return messages
                })
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




    /**
     * Event function called by the operator to display the content of the block.
     *
     * @param serverRequest
     */
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


                    // store the processRecord in the session
                    setActionMessages((messages : ActionMessage[]) => {
                        messages[0].eventApprovalData = res;
                        return messages
                    })

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
        IndexedStorage.ConnectDatabase(activeAccount).then((db : IndexedStorage) => {
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
         */
    }

    return <>
        <PopupNavbar/>
        <div className="h-full">
            {/* Default page when no action is requested. */}
            { !showWaitingScreen && localActionMessageOption.isEmpty() &&
                <div id="popup-dashboard-main-container" className="h-full w-full flex justify-center items-center">
                    <img src="/assets/img/logo.svg" className="w-20 h-20" alt=""/>
                </div>
            }

            {/* Pages when an action is requested. */}
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
                                    email={activeAccount.getEmail()}
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
                    <img src="/assets/img/approve.png" className="h-20 w-20" alt=""/>
                </div>
            }
        </div>

    </>
}
