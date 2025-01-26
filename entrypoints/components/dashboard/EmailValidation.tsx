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

import React, {ReactElement, useState} from 'react';
import {getUserKeyPair} from '@/entrypoints/main/wallet.tsx';
import '../../main/global.css'
import {EmailValidationProofData} from "@/entrypoints/main/Account.tsx";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js"
import {Encoders} from "@/entrypoints/main/Encoders.tsx";
import {
    activeAccountState,
    useAuthenticationContext,
    walletState,
} from '@/entrypoints/contexts/authentication.context.tsx';
import {Card, CardContent} from '@mui/material';
import {useRecoilState, useRecoilValue} from 'recoil';

let otpToken : string = ""

export function EmailValidation() {

    const authentication = useAuthenticationContext();
    const [wallet, setWallet] = useRecoilState(walletState);
    const activeAccount = useRecoilValue(activeAccountState);



    // states to handle the email verification procedure
    const [verificationCode, setVerificationCode] = useState<string>("");
    const [emailValidationInProgress, setEmailValidationInProgress] = useState<boolean>(false);
    const [_, setIsEmailVerificationSucceeded] = useState<boolean>(false);
    const [emailVerifiactionError, setEmailVerifiactionError] = useState<string>("");
    const [emailValidated, setEmailValidated] = useState(activeAccount && activeAccount.emailValidationProof !== undefined);
    const [email, setEmail] = useState(activeAccount?.email || "");


    /**
     * This function is called when the user has entered an email that should be linked to the current account
     * and save locally.
     */
    function saveEmail() {
        // update the active account
        console.log("[main] proceed to the update of the wallet")
        setEmail("") // clearing the email is done after the end of the function
        setWallet(wallet => {
            if (!wallet) return undefined;
            return {
                ...wallet,
                accounts: wallet.accounts.map(a => {
                    if (a.id != wallet.activeAccountId) return a;
                    return {
                        ...a,
                        email
                    }
                })
            }
        })
    }

    function verifyEmail() {
        setEmailValidationInProgress(true);
        const wallet = useRecoilValue(walletState);
        const activeAccount = useRecoilValue(activeAccountState);
        if (!wallet || !activeAccount) return;
        getUserKeyPair(wallet, activeAccount)
            .then(keyPair => {
                Carmentis.dataServerQuery(
                    "email-validator/initialize",
                    {
                        email    : activeAccount.email,
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

            setWallet(wallet => {
                if (!wallet) return undefined;
                return {
                    ...wallet,
                    accounts: wallet.accounts.map(a => {
                        if (a.id != wallet.activeAccountId) return a;
                        return {
                            ...a,
                            emailValidationProof
                        }
                    })
                }
            });
            setIsEmailVerificationSucceeded(true)
            setEmailValidated(true);

        }).catch(error => {
            setEmailVerifiactionError(`An error occurred: ${error}`)
        }).finally(() => {
            setEmailValidationInProgress(false)
        })
    }


    const wrapper = (content: ReactElement) =>  <Card >
        <CardContent className={"bg-green-100"}>
            {content}
        </CardContent>
    </Card>

    if (!activeAccount?.email) {
        return wrapper(<div>
            <h2>Enter your email</h2>
            <p>Your email has not been provided yet. Enter your email to access more applications.</p>
            <div className="mb-5">
                <label htmlFor="email"
                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Email
                </label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
            <button className="btn-primary btn-highlight" onClick={saveEmail}>Save</button>
        </div>);
    }

    if (activeAccount.email && !activeAccount.emailValidationProof) {
        return wrapper(<div>
            <h2>Validate your email with oracle</h2>
            <p>To validate your email (<b>{activeAccount.email}</b>), we will send a code that should
                be pasted.</p>
            {emailValidationInProgress &&
                <div className="mb-5">
                    <label htmlFor="verificationCode"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Received code
                    </label>
                    <input type="text" id="verificationCode" value={verificationCode}
                           onChange={(e) => setVerificationCode(e.target.value)}
                           className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <button className="btn-primary btn-highlight"
                            onClick={verifyVerificationCode}>Verify the code
                    </button>
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

        </div>)
    }


}