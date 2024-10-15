import "@/entrypoints/style.css"
import React, {useContext, useEffect, useRef, useState} from "react";
import {AuthenticationContext, AuthenticationContainer, LoggerContext} from "@/entrypoints/main/FullPageApp.tsx";
import {ActionMessage} from "@/src/ActionMessage.tsx";
import {ActionMessageContainer, ActionMessageContext} from "@/src/components/commons/ActionMessage.tsx";
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
import {SessionStorage} from "@/src/SessionStorage.tsx";

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

export function PopupDashboard() {


    // load the different contexts
    let authentication: AuthenticationContainer = useContext(AuthenticationContext);
    let authenticationContext: AuthenticationContainer = useContext(AuthenticationContext);
    const { actionMessages, setActionMessages } = useContext(ActionMessageContext);
    let logger = useContext(LoggerContext);

    // load the authentication data
    const wallet: Wallet = authentication.wallet.unwrap();
    const activeAccountIndex: number = authentication.activeAccountIndex.unwrap();
    let activeAccount: Account = wallet.getAccount(activeAccountIndex);

    // create a reference on the action messages
    const [localActionMessageOption, setLocalActionMessageOption] = useState<Optional<ActionMessage>>(
        Optional.Empty()
    );

    // initialize the Carmentis wallet callback (should be set at every rendering)
    Carmentis.wallet.setRequestCallback(handleClientRequest, handleServerRequest)


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
        const seed: Uint8Array = wallet.getSeed();

        const currentActionMessageOption = localActionMessageOption;
        if ( currentActionMessageOption.isEmpty()  ) {
            throw new Error("container Empty container")
        }

        const currentActionMessage = currentActionMessageOption.unwrap();
        const request = currentActionMessage.clientRequest;




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
            Carmentis.derivePepperFromSeed(seed).then(pepper => {
                return Carmentis.deriveUserPrivateKey(pepper, Encoders.FromHexa(applicationId)).then(privateKey => {
                    return Carmentis.getPublicKey(privateKey).then(publicKey => {
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
     * This function is called when the wallet receives an event approval request.
     *
     * An event approval request is called mainly when the approval of a user is required.
     */
    function handleRequestEventApproval() {
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
            CloseOnSuccess();
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
    function handleServerRequest(serverRequest) {

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
                requestBlockData(serverRequest);
                break;
            }
            case "confirmRecord": {
                handleConfirmRecord(serverRequest);
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
    function requestBlockData(serverRequest) {
        let data = String.fromCharCode.apply(String, serverRequest.data.blockData);
        console.log("[popup] requestBlockData:", data);

        executeBackgroundTask(new Promise<void>((resolve, reject) => {
            Carmentis.prepareApproval(
                serverRequest.data.applicationId,
                serverRequest.data.flowId,
                new Uint8Array(serverRequest.data.blockData)
            ).then(flow => {
                const nbBlocks = flow.flowObject.chain.microBlock.length;
                const nonce =  flow.flowObject.chain.microBlock[nbBlocks - 1].nonce;
                console.log("[popup] received flow: ", flow)
                Carmentis.processRecord(flow, nonce).then(res => {
                    if (res === undefined) {
                        reject("Failure when processing record: empty records.")
                    }
                    console.log("[popup] processRecord output: ", res)

                    // store the processRecord in the session
                    setActionMessages(messages => {
                        messages[0].eventApprovalData = res;
                        return messages
                    })

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



    return <>
        <Navbar activeAccount={activeAccount}/>
        <div className="min-h-full">
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
                                    data={Optional.From(localActionMessageOption.unwrap().eventApprovalData)}
                                    onAccept={handleRequestEventApproval}
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
