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

import {Optional} from "@/src/Optional.tsx";
import React, {Dispatch, ReactElement, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js"
import Skeleton from "react-loading-skeleton";
import {Encoders} from "@/src/Encoders.tsx";



interface TextualMessagePart {
    isField: boolean
    name: string,
    value : string
}

interface ObjectMessagePart {
    isField: boolean,
    def: { name: string, flag: number, id: number, maskId: number },
    field: string,
    value: object
}



/**
 * This component is used to print the content of the current block but also previous block.
 * @param input
 * @constructor
 */
export function RecordDisplayer(input: {
    applicationName: string,
    applicationId: string,
    flowId: string | undefined,
    nonce: number,
    record: object,
}) {



    function setBlock( nonce : number, fieldPath : string[] ) {
        setIsLoading(true);
        currentNonce.current = nonce;

        // if the current (not anchored yet) block is required, in this case no network connection is done
        if ( nonce === input.nonce ) {
            setDisplayedData(initialBlockData)
            setRelativeFieldPath( fieldPath )
            setIsLoading(false);
        } else {
            let applicationId =  Encoders.FromHexa(input.applicationId),
                flowId = Encoders.FromHexa(input.flowId);

            console.log("[popup] request done with:", applicationId, flowId, nonce)
            Carmentis.loadPublicDataFromMicroBlock(
                input.applicationId,
                input.flowId,
                nonce
            ).then(data => {
                    setDisplayedData(data.record)
                    setRelativeFieldPath( fieldPath )
                    setIsLoading(false);
                });
        }

    }


    /**
     * Event function fired when the user clicks on a field in the formatted message to go to the associated node.
     *
     * @param fieldPath {string} - The path to access the field in the specified block (see `nonce`).
     * @param nonce {number} - The index of the block in which this field is contained. This value is useful to access
     * the value of precise field in a given block without exploring all the chain.
     *
     * Note: In case where a previous field is referred, but the current block is the first block of the chain,
     * then a warning is raised. Since this issue will be fairly common, it is a better solution to prevent this issue
     * smoothly, rather to raise an error blocking the event validation process.
     */
    function goToNode( fieldPath : string, nonce : number ) {

        // delete the prefix of the field path
        const relativeFieldPath : string[] = fieldPath
            .replace("last.", "")
            .replace("this.", "")
            .replace("prev.", "")
            .split(".");

        setBlock(nonce, relativeFieldPath)
        return
    }

    /**
     *
     */
    function formatMessage( msgParts : (TextualMessagePart | ObjectMessagePart)[] ) : ReactElement[] {

        let result = [];

        for (let i = 0; i < msgParts.length; i++) {
            const part = msgParts[i];
            switch (part.isField) {
                case true:
                    const fieldName : string = part.def.name;
                    const fieldValue = part.value;
                    if ( typeof fieldValue === "string" ) {
                        result.push(<span className="field">{fieldValue}</span>)
                    } else {
                        result.push(<span className="underline" onClick={() => {
                            goToNode(part.field, part.nonce);
                        }}>
                            {fieldName}
                        </span>)
                    }


                    break

                case false:
                    result.push(part.value);
                    break;


            }
        }

        return result
    }

    const record = input.record;
    const initialBlockData = record.record;
    const isFirstBlock = input.flowId === undefined;

    // format the message (defined in the workspace)
    const msgParts = record.msgParts;
    const formattedMessage = formatMessage(msgParts);


    // we remember the current path in the current displayed node to remember our location.
    // An empty array means "show the root of the current tree"
    const currentNonce = useRef(input.nonce);
    const [displayedData, setDisplayedData] = useState<object>(initialBlockData);
    const [relativeFieldPath, setRelativeFieldPath] = useState<string[]>([]);

    // we use a state to display a loading element
    const [isLoading, setIsLoading] = useState(false);

    // functions to go in the previous and next block
    function goToPreviousBlock() {
        if (1 < currentNonce.current) {
            setBlock( currentNonce.current - 1, [] )
        }
    }

    // functions to go in the previous and next block
    function goToNextBlock() {
        if (currentNonce.current < input.nonce) {
            setBlock( currentNonce.current + 1, [] )
        }
    }

    // create a dedicated class to separate the current to the previous blocks to a more enhanced UI
    //const blockClass = displayedTree === "this" ? "current-block" : "anchored-block";

    return <>
        <div id="event-approval-message">
            <p id="event-approval-message-origin">Message from <b>{input.applicationName}</b></p>
            <p id="event-approval-message-content">
                {formattedMessage}
            </p>
        </div>

        Ensure that the received data is correct:
        { isLoading &&
            <div className="w-full mb-2">
                <Skeleton count={3}></Skeleton>
                <div className="flex flex-row mt-1">
                    <div className="w-1/2 pr-1">
                        <Skeleton count={1} height={30}></Skeleton>
                    </div>
                    <div className="w-1/2 pl-1">
                        <Skeleton count={1} height={30}></Skeleton>
                    </div>
                </div>
            </div>
        }
        {!isLoading &&
            <>
                <DataTreeViewer
                    key={currentNonce.current}
                    className={ currentNonce.current === input.nonce ? "running-block" : "anchored-block" }
                    tree={displayedData}
                    relativePath={relativeFieldPath}
                    setRelativePath={setRelativeFieldPath}
                />
                { !isFirstBlock &&
                    <div className="button-group w-full mb-2">
                        <button type="button" disabled={currentNonce.current == 1} className={"w-1/2"} onClick={goToPreviousBlock}>
                            Previous block
                        </button>
                        <button type="button"  disabled={currentNonce.current == input.nonce} className={"w-1/2"} onClick={goToNextBlock}>
                            Next block
                        </button>
                    </div>
                }
                { currentNonce.current != input.nonce &&
                    <div className="w-full bg-gray-100" id="on-chain-progression">
                        <p id="block-progression">Block {currentNonce.current}/{input.nonce}</p>
                        <button
                            onClick={() => setBlock(input.nonce, [])}
                            type="button" id="back-to-current-block">
                            Back to current block
                        </button>
                    </div>
                }
            </>
        }
    </>;
}


export function DataTreeViewer(input: {
    tree: object,
    relativePath: string[],
    setRelativePath: Dispatch<SetStateAction<string[]>>,
    className : string
}) {

    // compute the initial tree based on the provided relativePath
    const tree = input.tree;
    const relativePath = input.relativePath;
    let currentNode = tree;
    for (const child of relativePath) {
        currentNode = currentNode[child]
    }

    // initialise the state displaying the node
    const [node, setNode] = useState<object>(currentNode);

    // update the displayed tree if the relative path is changed
    useEffect(() => {
        const tree = input.tree;
        const relativePath = input.relativePath;
        let currentNode = tree;
        for (const child of relativePath) {
            currentNode = currentNode[child]
        }
        setNode(currentNode);
    }, [input.relativePath]);


    /**
     * Event function called when the user click on an object in the displayed tree to expand the content.
     *
     * @param childName The name of the child to expand in the tree.
     */
    function goToChild(childName: string) {
        input.setRelativePath(currentPath => currentPath.concat([childName]));
    }

    /**
     * Event function called when the user goes up in the tree to display the parent of the current node.
     */
    function backToParent() {
        if (input.relativePath.length === 0) {
            throw new Error("Cannot back to the parent node in the tree display: already at root");
        }
        input.setRelativePath(currentPath => currentPath.slice(0, -1));
    }


    /**
     * This helper function is used to format the "back" section when the user navigates in the tree.
     *
     * Note: This function assumes that the current path is not empty!
     * This assumption is ensured by the conditional rendering.
     */
    function formatBack(): string {
        const relativeFieldPath = input.relativePath;
        let content = relativeFieldPath[0];
        for (let i = 1; i < relativeFieldPath.length; i++) {
            content = content + " > " + relativeFieldPath[i]
        }
        return content;
    }


    return <div className="tree-viewer mb-2">
        <table className={ `w-full mb-2 data-tree-viewer ${input.className}` } id="record-data-tree-viewer">
            <tbody id="event-approval-data">


            {input.relativePath.length !== 0 &&
                <tr onClick={backToParent}>
                    <td colSpan={2}>&#8592; {formatBack()}</td>
                </tr>
            }


            {
                Object.keys(node).map((key, index) => (
                    <tr key={key}
                        onClick={() => {
                            if (typeof node[key] === "object") {
                                goToChild(key)
                            }
                        }}>
                        <td
                            className="event-approval-data-key">
                            {key}
                        </td>
                        {typeof node[key] !== "object" &&
                            <td className="event-approval-data-value">{node[key]}</td>
                        }
                        {typeof node[key] === "object" &&
                            <td className="event-approval-data-child">&#8594;</td>
                        }
                    </tr>
                ))
            }
            </tbody>
        </table>

    </div>


}