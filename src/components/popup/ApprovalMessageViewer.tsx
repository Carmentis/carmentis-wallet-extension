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

import {ApplicationLedger} from "@cmts-dev/carmentis-sdk/client";
import React, {ReactElement, useEffect, useState} from "react";
import Skeleton from "react-loading-skeleton";
import {useSetRecoilState} from "recoil";
import {dataViewEnabledState, heightState, pathState} from "@/components/popup/states.ts";
import {FieldTokenType} from "@/types/FieldTokenType.tsx";

export type AppLedgerVBProps = { applicationLedger: ApplicationLedger }

/**
 * A React component for viewing approval messages. This component displays a formatted message
 * based on tokens retrieved from the provided AppLedgerVBProps `vb` instance. It also allows
 * users to interact with message fields to navigate to specific properties in the data structure.
 *
 * @param {AppLedgerVBProps} props An object containing the `vb` property which provides the necessary
 *        methods for fetching and interacting with the approval message.
 *        - `vb.getApprovalMessage(height: number): FieldTokenType[]` - Retrieves the tokens of the approval message.
 *        - `vb.getHeight(): number` - Gets the current height to use with the approval message.
 * @return {ReactElement} Returns a React component displaying the approval message and enabling interactivity for fields.
 */
export function ApprovalMessageViewer({applicationLedger}: AppLedgerVBProps) {
    const [approvalMessageContent, setApprovalMessageContent] = useState<ReactElement>(<Skeleton/>);
    const setPath = useSetRecoilState(pathState);
    const setHeight = useSetRecoilState(heightState);
    const setDataViewEnabled = useSetRecoilState(dataViewEnabledState);


    function goToProperty(token: FieldTokenType) {
        const paths = token.def.name.split('.');
        const lastItem = paths.pop() as string;
        const isObjet = typeof token.value === 'object' && !Array.isArray(token.value);
        setPath(isObjet ? [...paths, lastItem] : paths)
        setHeight(token.height)
        setDataViewEnabled(true);
    }


    function renderFieldToken(token: FieldTokenType): string {
        const value = token.value;
        if (typeof value === 'string') return value;
        if (Array.isArray(value)) {
            if (value.length === 0) return ''
            if (typeof value[0] === 'string') return value.join(', ')
        }
        return `${token.field}`
    }

    function renderApprovalMessage() {
        const tokens = []; //vb.getApprovalMessage(vb.getHeight()); // TODO implement approval message
        const approvalMessage = tokens.map((token, i) => {
            if (token.isField) {
                const renderedToken = renderFieldToken(token);
                const onClick = () => goToProperty(token);
                return <span className={"underline hover:cursor-pointer"} onClick={onClick} key={i}>
                    {renderedToken}
                </span>
            } else {
                return <span key={i}>{token.value}</span>
            }
        })
        return <p className="p-2 bg-gray-100 rounded-md h-full overflow-auto">
            {approvalMessage}
        </p>
    }

    useEffect(() => {
        setApprovalMessageContent(renderApprovalMessage())
    }, []);


    // TODO: show a clear approval message
    /*
    return <div className={"flex flex-col h-full min-h-0"}>
        <p className="font-bold">Approval message</p>
        {approvalMessageContent}
    </div>
     */
    return <></>
}