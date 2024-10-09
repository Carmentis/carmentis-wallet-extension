import React from "react";
import {ActionMessage} from "@/src/ActionMessage.tsx";

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