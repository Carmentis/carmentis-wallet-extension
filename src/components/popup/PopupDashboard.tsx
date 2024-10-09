import "@/entrypoints/style.css"
import React, {useContext, useEffect, useState} from "react";
import {AuthenticationContext, AuthenticationContainer, LoggerContext} from "@/entrypoints/main/FullPageApp.tsx";
import {ActionMessage} from "@/src/ActionMessage.tsx";
import {ActionMessageContainer, ActionMessageContext} from "@/entrypoints/popup/PopupApp.tsx";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js"
import {Wallet} from "@/src/Wallet.tsx";
import {Encoders} from "@/src/Encoders.tsx";
import {Account, EmailValidationProofData} from "@/src/Account.tsx";


export function PopupDashboard() {


    let authentication : AuthenticationContainer = useContext(AuthenticationContext);
    const wallet : Wallet = authentication.wallet.unwrap();
    const activeAccountIndex : number = authentication.activeAccountIndex.unwrap();
    let activeAccount : Account = wallet.getAccount(activeAccountIndex);
    let actionMessages : ActionMessageContainer = useContext(ActionMessageContext);
    let authenticationContext : AuthenticationContainer = useContext(AuthenticationContext);
    let logger = useContext(LoggerContext);

    // states for the dashboard
    let [requestInProgress, setRequestInProgress] = useState<boolean>(false);
    let [error, setError] = useState<string>("");
    let [success, setSuccess] = useState<boolean>(false);
    let [showMenu, setShowMenu] = useState<boolean>(false);


    /**
     * This function is called when the user wants to see the extension in the main view.
     */
    function goToMainView() {
        browser.runtime.sendMessage({
            action: "open",
            location: "main"
        })
    }

    /**
     * This function is the client callback function called by the Carmentis SDK when a request is received and
     * must be handled.
     *
     * @param request The received request to handle.
     */
    function handleClientRequest( request ) {
        logger.info("[popup] receive client request from operator", request);
        switch(request.type) {
            case "signIn": {
                handleSignInRequest(request);
                break;
            }
            case "authentication": {
                handleRequestAuthentication(request);
                break;
            }
            case "eventApproval": {
                handleRequestEventApproval(request);
                break;
            }
            default:
                console.error("Unknown request type: " + request.type);
                setTimeout(() => {
                    window.close();
                }, 2000);
                break;
        }
    }


    /**
     * This functions is called when the wallet receives a request to sign-in.
     *
     * @param request
     */
    function handleSignInRequest( request ) {
        // generate the private signature key and derive the public signature key from it
        const wallet : Wallet = authenticationContext.wallet.unwrap();
        const seed : Uint8Array = wallet.getSeed();

        // TODO SECURITY: Why a constant nonce ?
        Carmentis.derivePepperFromSeed(seed, 1).then(pepper => {
            Carmentis.deriveAuthenticationPrivateKey(pepper).then(privateKey => {
                Carmentis.getPublicKey(privateKey).then(publicKey => {
                    Carmentis.sign(privateKey, Encoders.FromHexa(request.data.sessionPublicKey)).then(signature => {
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
    }

    /**
     * This functions is called when the wallet receives an event approval request.
     *
     * An event approval request is called mainly when the approval of a user is required.
     */
    function handleRequestEventApproval(request) {
        const [ applicationId, recordId ] = request.data.id.split("-");

        const seed = wallet.getSeed();

        // TODO SECURITY: Why a constant nonce ?
        Carmentis.derivePepperFromSeed(seed, 1).then(pepper => {
            return Carmentis.deriveUserPrivateKey(pepper, Encoders.FromHexa(applicationId)).then(privateKey => {
                return Carmentis.getPublicKey(privateKey).then(publicKey => {
                    return request.answer({
                        message  : "walletHandshake",
                        recordId : recordId,
                        publicKey: Encoders.ToHexa(publicKey)
                    })
                })
            })
        }).then( answer => {
            console.log("[popup] The anwser has respond with an answer: ", answer)
            CloseOnSuccess()
        }).catch(error => {
            console.error("[popup] The event approval process has failed: ", error);
            setError(error)
        }).finally(() => {
            setRequestInProgress(false);
        });

    }

    /**
     * Handle authentication request.
     *
     * @param request
     */
    function handleRequestAuthentication(request) {
        // TODO handle the case where the user's email is not verified
        // load the email proof
        let emailProof : EmailValidationProofData = activeAccount.getEmailValidationProofData();
        request.answer({
            success: true,
            proof  : emailProof
        });
    }

    /**
     * Function called on the success.
     *
     * @constructor
     */
    function CloseOnSuccess() {
        setError("")
        setSuccess(true)
        setRequestInProgress(false);
        actionMessages.clearMessages();

        setTimeout(
            function() {
                setSuccess(false)
                //window.close()
            }, 1700);
    }

    /**
     * Event function called when a request is received from the server
     *
     * @param request
     */
    function handleServerRequest( request ) {
        console.log("[popup] receive server request:", request);
        switch(request.type) {
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


    function requestBlockData( request ) {
        Carmentis.prepareApproval(
            request.data.applicationId,
            request.data.flowId,
            new Uint8Array(request.data.blockData)
        ).then(flow => {
            return request.answer({
                message : "confirmRecord",
                recordId: request.data.recordId
            })
        }).then(_ => {
            return request.clientAnswer({
                success : true,
                recordId: request.data.recordId
            });
        }).catch(error => {
            console.log("An error occurred while handling requestBlockData:", error)
        });
    }

    function handleConfirmRecord(request) {
        console.log("[popup] confirm record:", request);
    }

    useEffect(() => {
        Carmentis.wallet.setRequestCallback(handleClientRequest, handleServerRequest)
    }, []);


    function CallForApprove( QRCodeData : string ) {
        logger.info(`[popup] Start QRCode request with ${QRCodeData}`)
        setRequestInProgress(true);
        Carmentis.wallet.getRequestByQRCode(QRCodeData)
            .then( request => {
                setRequestInProgress(false);
                logger.info("[popup] QRCode request: response: ", request)
                if (request) {
                    request.accept().then( response => {
                        console.log("[popup] request accepted with response from the server:", response);
                    }).catch( error => {
                        setError(`${error}`)
                    })
                } else {
                    setError("Returned response is empty.")
                }
            } )
    }


    function RejectApprovalRequest(message: ActionMessage) {
        logger.info(`[popup] Reject approval`)
        actionMessages.clearMessages()
        setError("")

    }

    return <>
        <nav className="bg-white border-gray-200 dark:bg-gray-900 border-b-2 border-gray-100">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse h-2">
                    <img src="https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
                         className="h-6"
                    />
                    <span
                        className="self-center text-xl font-semibold whitespace-nowrap text-black">
                        {activeAccount.getPseudo()}

                    </span>
                </a>

                <div className="relative inline-block text-left">
                    <div >
                        <button onClick={() => setShowMenu(!showMenu)}
                                className="inline-flex w-full justify-center rounded-full bg-white p-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                                id="menu-button" aria-expanded="true" aria-haspopup="true">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"/>
                            </svg>
                        </button>
                    </div>


                    <div hidden={!showMenu}
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu" aria-orientation="vertical" aria-labelledby="menu-button" >
                    <div className="py-1" role="none">
                            <div className="block px-4 py-2 text-sm text-gray-700 hover:text-green-400 hover:cursor-pointer"
                               id="menu-item-0" onClick={goToMainView}>Large View</div>
                            <div className="block px-4 py-2 text-sm text-gray-700 hover:text-green-400 hover:cursor-pointer"
                               id="menu-item-1" onClick={authenticationContext.Disconnect}>Logout</div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <div className="flex flex-col min-h-full">
            {!success &&
                <>
                    {actionMessages.actionMessages.map(message =>
                        <div key={message.id}>
                            <div className="w-100 h-full flex flex-col position-relative p-5">
                                <h1 className="w-100 text-center text-md-center flex-none mb-3">
                                    Approval Request
                                </h1>
                                <div className="h-1/4 mb-3">
                                    <p>You have received an approval request
                                        from <b>{message.origin}</b> at {message.receivedAt}</p>
                                </div>


                                <div className="w-100 flex justify-evenly flex-col">
                                    {error &&
                                        <>
                                            <p className="bg-red-100 text-red-800 rounded-md p-3">
                                                An error occurred during the approval process. Please reload the QRCode
                                                and
                                                retry.<br/>
                                                <b>Reason: {error}</b>
                                            </p>
                                        </>
                                    }
                                    {requestInProgress &&
                                        <div
                                            className="flex items-center justify-center content-center w-100 ">
                                            <svg aria-hidden="true"
                                                 className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"/>
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"/>
                                        </svg>
                                    </div>
                                }
                                {!requestInProgress &&
                                    <div className="flex flex-row">
                                        { !error &&
                                            <>
                                                <button className="w-1/2 p-3 mr-1 btn-primary btn-highlight"
                                                        onClick={() => CallForApprove(message.data)}>
                                                    Approve
                                                </button>
                                                <button className="w-1/2 p-3 ml-1 btn-primary"
                                                        onClick={() => RejectApprovalRequest(message)}>Reject
                                                </button>
                                            </>
                                        }
                                        {error &&
                                            <button className="w-11/12 p-3 ml-1 btn-primary"
                                            onClick={() => RejectApprovalRequest(message)}>Reject
                                            </button>
                                        }

                                    </div>
                                }
                            </div>
                        </div>
                    </div>)
                }
                {requestInProgress &&
                    <>

                    </>
                }
                </>
            }
            { success &&
                <div className="flex min-h-full justify-center content-center w-100 items-center">
                    <img src="/assets/img/approve.png" className="h-20 w-20" alt=""/>
                </div>
            }
        </div>

    </>
}