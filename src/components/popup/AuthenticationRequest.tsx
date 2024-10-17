import React from "react";
import {Optional} from "@/src/Optional.tsx";

export function AuthenticationRequest(input: {
    email: Optional<string>;
    onAccept: () => void,
    onReject: () => void
}) {
    return <div className="min-h-full">
        <div className="w-100 p-4">
            <h2 className="w-100 flex-none mb-3">
                Authentication Request
            </h2>
            <div className="h-1/4 mb-3">
                {input.email.isEmpty() &&
                    <p>
                        Do you agree to authenticate?
                    </p>
                }
                {!input.email.isEmpty() &&
                    <p>
                        Do you agree to authenticate as {input.email.unwrap()}?
                    </p>
                }

            </div>
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