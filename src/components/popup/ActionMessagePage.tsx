import {Optional} from "@/src/Optional.tsx";
import {ActionMessageContainer, ActionMessageContext} from "@/entrypoints/popup/PopupApp.tsx";
import {useContext} from "react";
import {ActionMessage} from "@/src/ActionMessage.tsx";


function ActionMessagePage() {
    let actionMessageContainer : ActionMessage[] = useContext(ActionMessageContext);



    return <>
        <div className="w-full h-full p-5">
            <h1>Request Approval</h1>
            <p>Do you approve?</p>
            <button className="btn-primary btn-highlight">
                I approve
            </button>
        </div>
    </>;
}

export default ActionMessagePage;