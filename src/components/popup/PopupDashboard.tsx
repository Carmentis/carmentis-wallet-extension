import "@/entrypoints/style.css"
import React, {useContext, useEffect, useRef, useState} from "react";
import {AuthenticationContext, AuthenticationContainer, LoggerContext} from "@/entrypoints/main/FullPageApp.tsx";
import {ActionMessage} from "@/src/ActionMessage.tsx";
import {ActionMessageContainer, ActionMessageContext} from "@/entrypoints/popup/PopupApp.tsx";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js"
import {Wallet} from "@/src/Wallet.tsx";
import {Encoders} from "@/src/Encoders.tsx";
import {Account, EmailValidationProofData} from "@/src/Account.tsx";
import {QRCodeProcessRequestApproval} from "@/src/components/popup/QRCodeProcessRequestApproval.tsx";
import {Navbar} from "@/src/components/popup/Navbar.tsx";
import {Optional} from "@/src/Optional.tsx";
import {SpinningWheel} from "@/src/components/commons/SpinningWheel.tsx";
import {SignInRequestApproval} from "@/src/components/popup/SignInRequestApproval.tsx";
import {EventRequestApproval} from "@/src/components/popup/EventRequestApproval.tsx";
import {AuthenticationRequest} from "@/src/components/popup/AuthenticationRequest.tsx";

// the request state is only meaningful when a request is running.
enum RequestTreatmentState {
    ACTION_REQUEST_APPROVAL = "ACTION_REQUEST_APPROVAL",
    SIGNIN_REQUEST_APPROVAL = "SIGNIN_REQUEST_APPROVAL",
    EVENT_APPROVAL = "EVENT_APPROVAL",
    AUTHENTICATION_REQUEST = "AUTHENTICATION_REQUEST",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
}

export function PopupDashboard() {


    let authentication: AuthenticationContainer = useContext(AuthenticationContext);
    const wallet: Wallet = authentication.wallet.unwrap();
    const activeAccountIndex: number = authentication.activeAccountIndex.unwrap();
    let activeAccount: Account = wallet.getAccount(activeAccountIndex);
    let actionMessages: ActionMessageContainer = useContext(ActionMessageContext);
    let authenticationContext: AuthenticationContainer = useContext(AuthenticationContext);
    let logger = useContext(LoggerContext);

    // states for the dashboard
    let [actionRequestState, setActionRequestState] = useState<RequestTreatmentState>(RequestTreatmentState.ACTION_REQUEST_APPROVAL);
    let [showWaitingScreen, setShowWaitingScreen] = useState<boolean>(false);
    let [error, setError] = useState<string>("");

    let [approvedRequest, setApprovedRequest] = useState<Optional<object>>(Optional.Empty());
    let serverRequest = useRef<Optional<object>>(Optional.Empty());
    let [eventApprovalData,  setEventApprovalData] = useState<Optional<object>>(Optional.Empty());

    let currentActionMessage : Optional<ActionMessage> = (
        actionMessages.actionMessages.length === 0 ?
            Optional.Empty() :
            Optional.From( actionMessages.actionMessages[0] )
    );





    interface BackgroundTaskExecutionOption {
        showWaitingScreen?: boolean;
        closeWaitingScreenOnSuccess?: boolean
    }
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
        actionMessages.clearMessages();
        setApprovedRequest(Optional.Empty());
        serverRequest.current = Optional.Empty();
        setEventApprovalData(Optional.Empty());
        setTimeout(() => {
            setActionRequestState(RequestTreatmentState.ACTION_REQUEST_APPROVAL);
            window.close()
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
        setApprovedRequest(Optional.Empty());
        serverRequest.current = Optional.Empty();
        setEventApprovalData(Optional.Empty());
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

        logger.info(`[popup] Start QRCode request with ${QRCodeData}`)
        executeBackgroundTask(new Promise<void>((resolve, reject) => {
            return Carmentis.wallet.getRequestByQRCode(QRCodeData)
                .then(request => {
                    logger.info("[popup] QRCode request: response: ", request)
                    if (request) {
                        request.accept().then(response => {
                            console.log("[popup] request accepted with response from the server:", response);
                        }).catch(error => {
                            reject(error);
                        })
                    } else {
                        reject("Returned response is empty.")
                    }
                })
        }));
    }


    /**
     * Event function called when the user rejects to perform an action.
     *
     * This function can be called at several places and is used to clean the state.
     *
     */
    function RejectRequest() {
        logger.info(`[popup] Reject approval`)
        actionMessages.clearMessages()
        setActionRequestState(RequestTreatmentState.ACTION_REQUEST_APPROVAL);
        setShowWaitingScreen(false);
        setError("");
        setApprovedRequest(Optional.Empty());
        serverRequest.current = Optional.Empty();
        setEventApprovalData(Optional.Empty());
        window.close()
    }


    /**
     * This function is the client callback function called by the Carmentis SDK when a request is received and
     * must be handled.
     *
     * @param request The received request to handle.
     */
    function handleClientRequest(request) {
        logger.info("[popup] receive client request from operator", request);
        setApprovedRequest(Optional.From(request))
        switch (request.type) {
            case "signIn": {
                setShowWaitingScreen(false);
                setActionRequestState(RequestTreatmentState.SIGNIN_REQUEST_APPROVAL);
                break;
            }
            case "authentication": {
                setShowWaitingScreen(false);
                setActionRequestState(RequestTreatmentState.AUTHENTICATION_REQUEST);
                break;
            }
            case "eventApproval": {
                setActionRequestState(RequestTreatmentState.EVENT_APPROVAL)
                prepareRequestEventApproval( request );
                break;
            }
            default:
                AbortWithError("Unknown request type: " + request.type);
                break;
        }
    }


    /**
     * This functions is called when the wallet receives a request to sign-in.
     *
     *
     */
    function handleSignInRequest() {
        let request = approvedRequest.unwrap();

        // generate the private signature key and derive the public signature key from it
        const wallet: Wallet = authenticationContext.wallet.unwrap();
        const seed: Uint8Array = wallet.getSeed();

        executeBackgroundTask(new Promise<void>((resolve, reject) => {
            Carmentis.derivePepperFromSeed(seed, 1).then(pepper => {
                Carmentis.deriveAuthenticationPrivateKey(pepper).then(privateKey => {
                    Carmentis.getPublicKey(privateKey).then(publicKey => {
                        Carmentis.sign(privateKey, Encoders.FromHexa(request.data.sessionPublicKey)).then(signature => {
                            resolve();
                            CloseOnSuccess()
                            request.answer({
                                success: true,
                                data: {
                                    pubKey: Encoders.ToHexa(publicKey),
                                    sessionPubKeySignature: Encoders.ToHexa(signature)
                                }
                            });
                        })
                    })
                })
            });
        }));
    }


    function prepareRequestEventApproval( request ) {
        const [applicationId, recordId] = request.data.id.split("-");

        const seed = wallet.getSeed();

        executeBackgroundTask(new Promise<void>((resolve,reject) => {
            console.log("[popup] executing background request event approval")
            // TODO SECURITY: Why a constant nonce ?
            Carmentis.derivePepperFromSeed(seed, 1).then(pepper => {
                return Carmentis.deriveUserPrivateKey(pepper, Encoders.FromHexa(applicationId)).then(privateKey => {
                    return Carmentis.getPublicKey(privateKey).then(publicKey => {
                        // the client accepts the transaction
                        console.log("[popup] starting walletHandshake")
                        return request.answer({
                            message: "walletHandshake",
                            recordId: recordId,
                            publicKey: Encoders.ToHexa(publicKey)
                        })
                    })
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
     * This functions is called when the wallet receives an event approval request.
     *
     * An event approval request is called mainly when the approval of a user is required.
     */
    function handleRequestEventApproval() {
        const request = serverRequest.current.unwrap();
        executeBackgroundTask(new Promise((resolve, reject) => {
            request.answer({
                message: "confirmRecord",
                recordId: request.data.recordId
            });
            request.clientAnswer({
                success: true,
                recordId: request.data.recordId
            });
            CloseOnSuccess();
        }));
    }

    /**
     * Handle authentication request.
     *
     *
     */
    function handleRequestAuthentication() {
        const request = approvedRequest.unwrap();

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
     * @param request
     */
    function handleServerRequest(request) {
        console.log("[popup] receive server request:", request);
        serverRequest.current = Optional.From(request);
        switch (request.type) {
            case "blockData": {
                requestBlockData(request);
                break;
            }
            case "confirmRecord": {
                handleConfirmRecord(request);
                break;
            }
            default:
                throw new Error("[popup] Unknown request type: " + request.type);
        }
    }


    /**
     * Event function called by the operator to display the content of the block.
     *
     * @param request
     */
    function requestBlockData(request) {
        let data = String.fromCharCode.apply(String, request.data.blockData);
        console.log("[popup] requestBlockData:", data);

        executeBackgroundTask(new Promise<void>((resolve, reject) => {
            Carmentis.prepareApproval(
                request.data.applicationId,
                request.data.flowId,
                new Uint8Array(request.data.blockData)
            ).then(flow => {
                const nbBlocks = flow.flowObject.chain.microBlock.length;
                const nonce =  flow.flowObject.chain.microBlock[nbBlocks - 1].nonce;
                console.log("[popup] received flow: ", flow)
                Carmentis.processRecord(flow, nonce).then(res => {
                    if (res === undefined) {
                        reject("Failure when processing record: empty records.")
                    }
                    console.log("[popup] processRecord output: ", res)
                    setEventApprovalData(Optional.From(res));
                    resolve()
                }).catch(reject)

            }).catch(error => {
                console.error("An error occurred while handling requestBlockData:", error)
                reject(error)
            });
        }));

    }

    function handleConfirmRecord(request) {
        console.log("[popup] confirm record:", request);
        CloseOnSuccess()
    }

    useEffect(() => {
        Carmentis.wallet.setRequestCallback(handleClientRequest, handleServerRequest)
    }, []);


    return <>
        <Navbar activeAccount={activeAccount}/>
        <div className="min-h-full">
            { !showWaitingScreen && !currentActionMessage.isEmpty() &&
                <>
                    { actionRequestState == RequestTreatmentState.ACTION_REQUEST_APPROVAL &&
                        <QRCodeProcessRequestApproval message={currentActionMessage.unwrap()} onAccept={AllowQRCodeProcess} onReject={RejectRequest}/>
                    }

                    { actionRequestState == RequestTreatmentState.SIGNIN_REQUEST_APPROVAL &&
                        <SignInRequestApproval onAccept={handleSignInRequest} onReject={RejectRequest}></SignInRequestApproval>
                    }

                    { actionRequestState == RequestTreatmentState.EVENT_APPROVAL &&
                        <EventRequestApproval
                            data={eventApprovalData}
                            onAccept={handleRequestEventApproval}
                            onReject={RejectRequest}></EventRequestApproval>
                    }

                    { actionRequestState == RequestTreatmentState.AUTHENTICATION_REQUEST &&
                        <AuthenticationRequest
                            email={activeAccount.getEmail()}
                            onAccept={handleRequestAuthentication}
                            onReject={RejectRequest}></AuthenticationRequest>
                    }



                    {actionRequestState == RequestTreatmentState.ERROR &&
                        <div className="flex flex-col min-h-full w-100 p-4">
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
                    <div className="w-100 h-100 flex items-center justify-center mt-6">
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
