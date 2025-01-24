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

import React from "react";
import {ActionMessage} from "@/entrypoints/main/ActionMessage.tsx";

export function QRCodeProcessRequestApproval(input: {
    message: ActionMessage,
    onAccept: (message : string) => void,
    onReject: () => void
})
{
    return <>
        <div className="min-h-full">
            <div className="w-100 p-4">
                <h2 className="w-100 flex-none mb-3">
                    Action Request
                </h2>
                <div className="h-1/4 mb-3">
                    <p>
                        An application wants to perform an action with your wallet.
                        We need your approval to do so.
                    </p>
                    <p className="font-bold">Origin</p>
                    <p className="w-100 p-2 bg-gray-100 rounded-md">
                        {input.message.origin}
                    </p>
                    <p className="font-bold">Action reception date</p>
                    <p className="w-100 p-2 bg-gray-100 rounded-md">
                        {new Date(input.message.receivedAt).toLocaleString()}
                    </p>
                    <p>
                        If you are not at the origin of this action request, reject the action.
                        Otherwise, click on Continue.
                    </p>
                </div>
                <div className="flex flex-row justify-evenly">
                    <button className="w-1/2 p-3 mr-1 btn-primary btn-highlight"
                            onClick={() => input.onAccept(input.message.data)}>
                        Continue
                    </button>
                    <button className="w-1/2 p-3 ml-1 btn-primary"
                            onClick={() => input.onReject()}>
                        Reject
                    </button>
                </div>

            </div>
        </div>
    </>
}