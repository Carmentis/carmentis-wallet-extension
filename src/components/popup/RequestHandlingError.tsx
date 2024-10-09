import React from "react";

export function requestHandlingError(error : string) {

    return   <>
        <p className="bg-red-100 text-red-800 rounded-md p-3">
            An error occurred. Please reload the QRCode
            and
            retry.<br/>
            <b>Reason: {error}</b>
        </p>
    </>;

}