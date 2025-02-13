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

import {useState} from "react";
import {useLocation, useNavigate} from "react-router";


export function PseudoPasswordCreation() {
    // the state of the component
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [password, setPassword] = useState('aaa');
    const [confirmPassword, setConfirmPassword] = useState('aaa');
    const [consent, setConsent] = useState(0);

    // errors
    const [activeForm, setActiveForm] = useState<boolean>(false);
    const [pseudoIsEmpty, setPseudoIsEmpty] = useState<boolean>(false);
    const [isWeakPassword, setIsWeakPassword] = useState<boolean>(false);

    // create the list of conditions that the input should satisfy
    let conditions =  [
        // the pseudo should not be empty
        {
            evaluate: () => {
                return firstname !== "";
            },
            onFailure: () => {
                setPseudoIsEmpty(true)
            }
        },
        // passwords should match
        {
            evaluate: () => {
                return password == confirmPassword;
            },
            onFailure: () => {}
        },
        // the password should not be weak
        {
            evaluate: () => {
                return password.length >= 1;
            },
            onFailure: () => {
                setIsWeakPassword(true)
            }
        },
        // the user should accept the consent
        {
            evaluate: () => {
                return consent;
            },
            onFailure: () => {}
        }
    ]

    // checks the conditions defined above.
    function onSubmitCreation() {
        // checks conditions
        setActiveForm(true)
        let containsError = false;
        for (var condition of conditions) {
            if (!condition.evaluate()) {
                containsError = true;
                condition.onFailure();
            }
        }

        if (!containsError) {
            onCorrectPseudoPasswordForm()
        }
    }

    // handle the case where the password is correct
    const navigate = useNavigate();
    const location = useLocation();
    const nextStep = location.state.nextStep;
    const target = nextStep ? nextStep : "/recovery-phrase";
    function onCorrectPseudoPasswordForm() {
        navigate(target, {
            state: {
                firstname: firstname,
                lastname: lastname,
                password: password,
            }
        });
    }



    return (
        <>
            <h1 className="title justify-center align-content-center align-items-center flex">Create a password</h1>
            <p className="text-justify">This password allows to unlock your wallet only on this device. Carmentis cannot help to
                recover this password.</p>

            <div className="flex items-center justify-between align-items-center justify-content-center flex-col">
                <div className="mb-4">
                    <label htmlFor="firstname"
                           className="block text-sm font-medium leading-6 text-gray-900">Firstname</label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <input type="text" name="firstname" id="firstname"
                               placeholder="Firstname"
                               value={firstname}
                               onChange={(e) => setFirstname(e.target.value)}
                               className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"/>
                        {activeForm && pseudoIsEmpty &&
                            <p className="mt-2 text-pink-600">
                                The pseudo is required.
                            </p>
                        }
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="lastname"
                           className="block text-sm font-medium leading-6 text-gray-900">Lastname</label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <input type="text" name="lastname" id="lastname"
                               placeholder="Lastname"
                               value={lastname}
                               onChange={(e) => setLastname(e.target.value)}
                               className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"/>
                        {activeForm && lastname == "" &&
                            <p className="mt-2 text-pink-600">
                                The lastname is required.
                            </p>
                        }
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="password"
                           className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <input type="text" name="password" id="password"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"/>
                        {activeForm && isWeakPassword &&
                            <p className="mt-2 text-pink-600">
                                The password is weak.
                            </p>
                        }
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="confirm-password"
                           className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <input type="text" name="confirm-password" id="confirm-password"
                               value={confirmPassword}
                               onChange={(e) => setConfirmPassword(e.target.value)}
                               className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"/>
                        {activeForm && password !== confirmPassword &&
                            <p className="mt-2 text-pink-600">
                                The passwords does not match.
                            </p>
                        }
                    </div>
                </div>

                <div className="flex items-center mb-4">
                    <input id="default-checkbox" type="checkbox"
                           value={consent}
                           onChange={(e) => setConsent(e.target.checked ? 1 : 0)}
                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    <label htmlFor="default-checkbox"
                           className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        I understand that Carmentis cannot help me to recover the password.
                    </label>

                </div>
                {activeForm && !consent &&
                    <p className="mt-2 text-pink-600">
                        Accept that Carmentis cannot help yout to recover your password.
                    </p>
                }
            </div>


            <button className="btn-primary btn-highlight w-full" onClick={onSubmitCreation}>
                Next
            </button>
        </>
    );
}