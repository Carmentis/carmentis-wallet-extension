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
import {Wallet} from "@/src/Wallet.tsx";
import '../../../entrypoints/main/global.css'
import {Account, EmailValidationProofData} from "@/src/Account.tsx";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js"
import {Encoders} from "@/src/Encoders.tsx";
import {Optional} from "@/src/Optional.tsx";
import {AuthenticationContext} from "@/src/components/commons/AuthenticationGuard.tsx";

let otpToken : string = ""

export function EmailValidation() {

    const authentication = useContext(AuthenticationContext);
    const wallet : Wallet = authentication.wallet.unwrap();
    const setWallet = authentication.setWallet.unwrap();
    const activeAccount : Account = wallet.getActiveAccount().unwrap();



    // states to handle the email verification procedure
    const [verificationCode, setVerificationCode] = useState<string>("");
    const [emailValidationInProgress, setEmailValidationInProgress] = useState<boolean>(false);
    const [_, setIsEmailVerificationSucceeded] = useState<boolean>(false);
    const [emailVerifiactionError, setEmailVerifiactionError] = useState<string>("");
    const [emailValidated, setEmailValidated] = useState(activeAccount.hasVerifiedEmail());
    const [email, setEmail] = useState(activeAccount.getEmail().unwrapOr(""))


    /**
     * This function is called when the user has entered an email that should be linked to the current account
     * and save locally.
     */
    function saveEmail() {
        // update the active account
        console.log("[main] proceed to the update of the wallet")
        const setWallet = authentication.setWallet.unwrap();
        const activeAccountIndex = wallet.getActiveAccountIndex().unwrap();
        setEmail("") // clearing the email is done after the end of the function
        setWallet(walletOption => {
            const wallet = walletOption.unwrap();
            const updatedWallet = wallet.updateAccountEmail( activeAccountIndex, email );
            return Optional.From(updatedWallet)
        })
    }

    function verifyEmail() {
        setEmailValidationInProgress(true);
        const activeAccount = wallet.getActiveAccount().unwrap();
        wallet.getAccountAuthenticationKeyPair(activeAccount)
            .then(keyPair => {
                Carmentis.dataServerQuery(
                    "email-validator/initialize",
                    {
                        email    : activeAccount.getEmail().unwrap(),
                        publicKey: Encoders.ToHexa(keyPair.publicKey),
                    }
                ).then(answer => {
                    console.log("[main] obtained anwser:", answer)
                    setEmail("")
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
            const activeAccountIndex = wallet.getActiveAccountIndex().unwrap();

            setWallet(walletOption => {
                const wallet = walletOption.unwrap();
                const updatedWallet = wallet.updateValidationProof(activeAccountIndex, emailValidationProof)
                return Optional.From(updatedWallet)
            });
            setIsEmailVerificationSucceeded(true)
            setEmailValidated(true);

        }).catch(error => {
            setEmailVerifiactionError(`An error occurred: ${error}`)
        }).finally(() => {
            setEmailValidationInProgress(false)
        })
    }

    return <>
        { activeAccount.getEmail().isEmpty() &&
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

        { activeAccount.getEmail().isSome() && !emailValidated &&
            <div className="bg-green-100 p-2 rounded-md shadow-sm">
                <h2>Validate your email with oracle</h2>
                <p>To validate your email (<b>{activeAccount.getEmail().unwrap()}</b>), we will send a code that should be pasted.</p>
                {emailValidationInProgress &&
                    <div className="mb-5">
                        <label htmlFor="verificationCode"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Received code
                        </label>
                        <input type="text" id="verificationCode" value={verificationCode}
                               onChange={(e) => setVerificationCode(e.target.value)}
                               className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
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