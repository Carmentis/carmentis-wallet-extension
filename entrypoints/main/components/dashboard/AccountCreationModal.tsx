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

import React, {useState} from "react";

export function AccountCreationModal(input : {
    inputValue : string,
    onChange: (value : string) => void,
    onClose: () => void,
    onCreate: () => void,
}) {

    const [emptyPseudo, setEmptyPseudo] = useState<boolean>(false);

    /**
     * This function is used to prevent a click event to be propagated and handled by the HTMLElement dealing with
     * the outside of the modal. Indeed, the modal can be closed by clicking outside the modal, an unwanted behaviour
     * when the user click inside the model.
     *
     * @param event
     */
    function onClickInsideModal(event: { stopPropagation: () => void; }) {
        event.stopPropagation()
    }

    /**
     * This event is fired when the form is trying to submit. At this point, we prevent the default behaviour of
     * the form and handle the form submission ourselves with the inputted function.
     *
     * The account creation event is not propagated if the provided pseudo is empty.
     *
     * @param event
     */
    function createAccount(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if ( input.inputValue === "" ) {
            setEmptyPseudo(true)
        } else {
            input.onCreate()
        }

    }
    return <>

        <div id="authentication-modal"   className="overflow-y-auto overflow-x-hidden fixed top-50 right-50 left-0 z-50 justify-center items-center w-full md:inset-0  max-h-full bg-gray-800 bg-opacity-50 flex" onClick={input.onClose}>
            <div className="relative p-4 w-full max-w-md max-h-full">

                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700" onClick={onClickInsideModal}>
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Account Creation
                        </h3>
                        <button onClick={input.onClose}
                                type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5">
                        <form className="space-y-4" onSubmit={createAccount}>
                            <div>
                                <label htmlFor="pseudo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pseudo</label>
                                <input
                                    value={input.inputValue}
                                    onChange={(e) => input.onChange(e.target.value)}
                                    type="pseudo"
                                    name="pseudo"
                                    id="pseudo"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-300 focus:border-green-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Pseudo" required />
                            </div>
                            { emptyPseudo &&
                                <p className="mt-2 text-pink-600">
                                    The provided pseudo is empty.
                                </p>
                            }

                            <button className="w-full btn-primary btn-highlight px-5 py-2.5 text-center">
                                Create Account
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>
}