import React, {useContext, useState} from "react";
import {AuthenticationContext} from "@/entrypoints/main/FullPageApp.tsx";
import {Wallet} from "@/src/Wallet.tsx";
import '../../../entrypoints/main/global.css'
import {Account, EmailValidationProofData} from "@/src/Account.tsx";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js"
import {Encoders} from "@/src/Encoders.tsx";

let otpToken : string = ""

export function EmailValidation() {

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
        console.log("[main] proceed to the update of the wallet")
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
            console.log("[email validation] answer after verification code:", answer)
            // abort if the answer is undefined
            if ( answer === undefined || answer.data === undefined || answer.data.proof === undefined ) {
                console.error("[email validation] malformed response: ", answer)
                throw new Error(`The answer obtained after the verification of the code is malformed: ${answer}`)
            }

            // populate the account with the provided proof
            const emailValidationProof : EmailValidationProofData = answer.data.proof;
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

    return <>
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
    </>;

}