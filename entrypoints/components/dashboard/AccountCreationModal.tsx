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
import {Box, Button, Modal, Typography} from "@mui/material";

export function AccountCreationModal(input : {
    onClose: () => void,
    onCreate: (pseudo: string) => void,
}) {

    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [newAccountPseudo, setnewAccountPseudo] = useState("");

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
        setHasSubmitted(true);
        if ( newAccountPseudo !== "" ) {
            input.onCreate(newAccountPseudo)
        }

    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        boxShadow: 24,
        p: 4,
    };

    return <div className={"absolute w-screen h-screen left-0 top-0"}>
        <Modal
            open={true}
            onClose={input.onClose}
            className={"border-0"}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} className={"bg-white border-0"}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Create user account
                </Typography>
                <form className="space-y-4" onSubmit={createAccount}>
                    <div>
                        <label htmlFor="pseudo"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pseudo</label>
                        <input
                            value={newAccountPseudo}
                            onChange={(e) => setnewAccountPseudo(e.target.value)}
                            type="pseudo"
                            name="pseudo"
                            id="pseudo"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-300 focus:border-green-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Pseudo" required/>
                    </div>
                    {hasSubmitted && newAccountPseudo.length === 0 &&
                        <p className="mt-2 text-pink-600">
                            The provided pseudo is empty.
                        </p>
                    }

                    <Button className="w-full btn-primary btn-highlight px-5 py-2.5" type={"submit"}>
                        Create Account
                    </Button>
                </form>
            </Box>
        </Modal>
    </div>
}