import React from "react";
import {ActionMessage} from "@/src/ActionMessage.tsx";
import {Optional} from "@/src/Optional.tsx";
import {RecordDisplayer} from "@/src/components/popup/RecordDisplayer.tsx";

export function EventRequestApproval(input: {
    data : Optional<object>
    onAccept: () => void,
    onReject: () => void
}) {
    return <div className="min-h-full">
        <div className="w-100 p-4">
            <h2 className="w-100 flex-none mb-3">
                Event Approval Request
            </h2>
            <div className="h-1/4 mb-3">
                <p>
                    The data associated with this event are displayed below:
                </p>
            </div>
            <RecordDisplayer record={input.data}/>
            <div className="flex flex-row justify-evenly">
                <button className="w-1/2 p-3 mr-1 btn-primary btn-highlight"
                        onClick={() => input.onAccept()}>
                    Continue
                </button>
                <button className="w-1/2 p-3 ml-1 btn-primary"
                        onClick={() => input.onReject()}>
                    Reject
                </button>
            </div>

        </div>
    </div>
}