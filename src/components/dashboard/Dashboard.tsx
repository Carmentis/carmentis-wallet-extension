import React, {useContext, useState} from "react";
import {AuthenticationContext} from "@/entrypoints/main/FullPageApp.tsx";
import {Wallet} from "@/src/Wallet.tsx";
import '../../../entrypoints/main/global.css'
import {Account, EmailValidationProofData} from "@/src/Account.tsx";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js"
import {Encoders} from "@/src/Encoders.tsx";

let otpToken : string = ""

export function  Dashboard() {

    const authentication = useContext(AuthenticationContext);
    const wallet : Wallet = authentication.wallet.unwrap();
    const activeAccountIndex : number = authentication.activeAccountIndex.unwrap();
    const activeAccount : Account = wallet.getAccount(activeAccountIndex);

    // states to handle the email verification procedure
    const [verificationCode, setVerificationCode] = useState<string>("");
    const [emailValidationInProgress, setEmailValidationInProgress] = useState<boolean>(false);
    const [isEmailVerificationSucceeded, setIsEmailVerificationSucceeded] = useState<boolean>(false);
    const [emailVerifiactionError, setEmailVerifiactionError] = useState<string>("");


    const [emailProvided, setEmailProvided] = useState(!activeAccount.getEmail().isEmpty());
    const [emailValidated, setEmailValidated] = useState(activeAccount.hasVerifiedEmail());
    const [email, setEmail] = useState(
        activeAccount.getEmail().unwrapOr("")
    );

    /**
     * This function is called when the user has entered an email that should be linked to the current account
     * and save locally.
     */
    function saveEmail() {
        // update the active account
        wallet.updateAccountEmail( activeAccountIndex, email );

        // store the update both in long term and in session storages
        const updateWalletInSession = authentication.updateWallet.unwrap();
        console.log("[main] proceed to the update of the wallet:", wallet)
        updateWalletInSession(wallet).then(() => {
            console.log("[main] Update the storage done")
            setEmailProvided(true);
        }).catch(e => {
            console.error("[main] An error occurred during wallet update:", e)
        });
    }

    function verifyEmail() {
        setEmailValidationInProgress(true);
        const seed = wallet.getSeed();
        // TODO SECURITY: Why a constant nonce ?
        Carmentis.derivePepperFromSeed(seed, 1).then(pepper => {
            Carmentis.deriveAuthenticationPrivateKey(pepper).then(privateKey => {
                Carmentis.getPublicKey(privateKey).then(publicKey => {
                    Carmentis.dataServerQuery(
                        "email-validator/initialize",
                        {
                            email    : email,
                            publicKey: Encoders.ToHexa(publicKey),
                        }
                    ).then(answer => {
                        console.log("[main] obtained anwser:", answer)
                        if ( answer.success ) {
                            otpToken = answer.data.token;
                        } else {
                            setEmailValidationInProgress(false);
                            setEmailVerifiactionError("An error occurred.")
                        }
                    }).catch(error => {
                        setEmailVerifiactionError(`An error occurred: ${error}`)
                        setEmailValidationInProgress(false)
                    });
                })
            })
        });
    }

    function verifyVerificationCode( ) {
        Carmentis.dataServerQuery(
            "email-validator/answer",
            {
                token: otpToken,
                value: verificationCode
            }
        ).then(answer => {
            const emailValidationProof : EmailValidationProofData = answer.data;
            wallet.updateValidationProof(activeAccountIndex, emailValidationProof);
            authentication.updateWallet.unwrap()(wallet).then(_ => {
                setIsEmailVerificationSucceeded(true)
                setEmailValidated(true);
            });

        }).catch(error => {
            setEmailVerifiactionError(`An error occurred: ${error}`)
        }).finally(() => {
            setEmailValidationInProgress(false)
        })
    }

    return (
        <>
                <nav className="bg-white  dark:bg-gray-900 border-b-2 border-gray-100">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse h-4">
                            <img
                                src="https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
                                className="h-6"
                            />
                            <span
                                className="self-center text-xl font-semibold whitespace-nowrap text-black">
                                {activeAccount.getPseudo()}
                            </span>
                        </a>
                        <button className="btn-primary btn-highlight ring-green-400"
                                onClick={authentication.clearAuthentication}>Logout
                        </button>
                    </div>
                </nav>
                <div className="h-full w-full p-4">

                    { !emailProvided &&
                        <div className="bg-green-100 p-2 rounded-md shadow-sm">
                            <h2>Enter your email</h2>
                            <p>Your email has not been provided yet. Enter your email to access more applications.</p>
                            <div className="mb-5">
                                <label htmlFor="email"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Email
                                </label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            </div>
                            <button className="btn-primary btn-highlight" onClick={saveEmail}>Save</button>
                        </div>
                    }

                    { emailProvided && !emailValidated &&
                        <div className="bg-green-100 p-2 rounded-md shadow-sm">
                            <h2>Validate your email</h2>
                            <p>To validate your email (<b>{email}</b>), we will send a code that should be pasted.</p>
                            {emailValidationInProgress &&
                                <div className="mb-5">
                                    <label htmlFor="verificationCode"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Email
                                    </label>
                                    <input type="text" id="verificationCode" value={verificationCode}
                                           onChange={(e) => setVerificationCode(e.target.value)}
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                    <button className="btn-primary btn-highlight"
                                            onClick={verifyVerificationCode}>Verify the code</button>
                                </div>

                            }
                            {emailVerifiactionError &&
                                <p className="mt-2 text-pink-600">
                                    An error occurred: ${emailVerifiactionError}
                                </p>
                            }
                            {!emailValidationInProgress &&
                                <button className="btn-primary btn-highlight" onClick={verifyEmail}>Send a code</button>
                            }


                        </div>
                    }
                </div>


        </>
    )

}

export default Dashboard;
