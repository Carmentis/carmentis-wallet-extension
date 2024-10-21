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
import {ReactElement, useCallback, useRef, useState} from "react";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js"


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


export function constructTree( records : object, msgParts : (TextualMessagePart | ObjectMessagePart)[]  ) {
    // the "this" tree corresponds to the current block being under approval.
    const trees = {
        "this": records,
    };

    // the other trees are defined in the message parts (the last's fields and previous fields associated in the message)
    for (const msgPart of msgParts) {
        if ( msgPart.isField && typeof msgPart.value !== "string" ) {
            trees[msgPart.field] = msgPart.value;
        }
    }

    return trees;
}

export function DataTreeViewer(input : {data: object}) {



    /**
     * This function is called when the user wants to access a node in the structure of the block by clicking on the
     * field name in the message.
     *
     * Note: this function currently do *not* support the access to a previous block.
     *
     * @param absoluteFieldPath The path of the target node in absolute form. The field path is a string value of the form "<tree>.<path>".
     * Example: "this.senderDocument.file" is an absolute reference to the "this" tree (associated with the current block) and shows the
     * "senderDocument.file" structure.
     */
    function goToNode( absoluteFieldPath : string ) {


        if ( absoluteFieldPath === ""  ){
            throw new Error("Cannot access the provided node: The field path is invalid")
        }

        console.log(trees.current, typeof trees.current)
        for (const [treeName, tree] of Object.entries(trees.current)) {

            // if absolute field path references the root of a tree
            if ( treeName === absoluteFieldPath ) {
                setDisplayedTree(treeName);
                setRelativeFieldPath([])
                break
            }


            // otherwise, the absolute field path contains a non-empty relative field path
            if ( absoluteFieldPath.includes(treeName) ) {
                // extract relative field path as a string and convert it as an array of string
                let relativeFieldPathString : string = absoluteFieldPath.replace(treeName + ".", "");
                const relativeFieldPath : string[] = relativeFieldPathString.split(".");
                setDisplayedTree(treeName);
                setRelativeFieldPath(relativeFieldPath)
                break
            }
        }

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
                                goToNode(part.field);
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


    /**
     * Event function called when the user click on an object in the displayed tree to expand the content.
     *
     * @param childName The name of the child to expand in the tree.
     */
    function goToChild( childName : string ) {
        setRelativeFieldPath(currentPath => currentPath.concat([childName]));
    }

    /**
     * Event function called when the user goes up in the tree to display the parent of the current node.
     */
    function backToParent() {
        if ( relativeFieldPath.length === 0 ) {
            throw new Error("Cannot back to the parent node in the tree display: already at root");
        }
        setRelativeFieldPath(currentPath => currentPath.slice(0, -1));
    }

    /**
     * Event function called when the user wants to display the "this" tree, associated with the current block.
     */
    function showThisTree() {
        setDisplayedTree("this");
        setRelativeFieldPath([]);
    }



    /**
     * This helper function is used to format the "back" section when the user navigates in the tree.
     *
     * Note: This function assumes that the current path is not empty!
     * This assumption is ensured by the conditional rendering.
     */
    function formatBack() : string {
        let content = relativeFieldPath[0];
        for (let i = 1; i < relativeFieldPath.length; i++) {
            content = content + " > " + relativeFieldPath[i]
        }
        return content;
    }


    const data = input.data;
    const records = data.record;

    // get the current nonce corresponding to the index of the current block
    console.log(data)
    const nonceOfThisTree = data.data.microBlock.nonce;
    const currentNonce = useRef<number>(nonceOfThisTree);

    // format the message (defined in the workspace)
    const msgParts = data.msgParts;
    const formattedMessage = formatMessage(msgParts);

    // construct the different trees from the record and the message parts.
    let trees = useRef(constructTree(records, msgParts));

    // by default, the displayed tree is the "this" tree.
    const [displayedTree, setDisplayedTree] = useState<string>("this");

    // we remember the current path in the current displayed node to remember our location.
    // An empty array means "show the root of the current tree"
    const [relativeFieldPath, setRelativeFieldPath] = useState<string[]>([]);

    // prepare the rendering by accessing the node in the specified tree
    const tree = trees.current[displayedTree];
    let node = tree;
    for (const child of relativeFieldPath) {
        node = node[child];
    }

    // we use a state to display a loading element
    const [isLoading, setIsLoading] = useState(false);

    // functions to go in the previous and next block
    function goPreviousBlock() {
        if (1 < currentNonce.current) {
            currentNonce.current--;
            setIsLoading(true);
            Carmentis.loadPublicDataFromMicroBlock(currentNonce.current)
                .then(data => {
                    console.log(data);
                    //trees[currentNonce.current] = data;
                    setIsLoading(false);
                });
        }
    }

    // create a dedicated class to separate the current to the previous blocks to a more enhanced UI
    const blockClass = displayedTree === "this" ? "current-block" : "anchored-block";

    return <>
        <div id="event-approval-message" className="p-1 rounded-md bg-gray-100 mb-2">
            {formattedMessage}
        </div>

        Ensure that the received data is correct:
        <div className="tree-viewer">
            <table className={'w-full mb-2 ' + blockClass} id="event-approval-table">
                <tbody id="event-approval-data" className={blockClass}>
                {displayedTree !== "this" &&
                    <tr onClick={showThisTree}>
                        <td colSpan={2}>&#8592; Back to current block</td>
                    </tr>
                }

                {relativeFieldPath.length !== 0 &&
                    <tr onClick={backToParent}>
                        <td colSpan={2}>&#8592; {formatBack()}</td>
                    </tr>
                }


                {
                    Object.keys(node).map((key, index) => (
                        <>

                            {typeof node[key] === "string" &&
                                <tr key={key}>
                                    <td className="event-approval-data-key">{key}</td>
                                    <td className="event-approval-data-value">{node[key]}</td>
                                </tr>
                            }
                            {typeof node[key] === "object" &&
                                <tr key={key} onClick={() => goToChild(key)}>
                                    <td className="event-approval-data-key">{key}</td>
                                    <td className="event-approval-data-child">&#8594;</td>
                                </tr>
                            }
                        </>
                    ))
                }
                </tbody>
            </table>

        </div>
    </>;
}
export function RecordDisplayer(input : {record: Optional<object>}) {
    return <>
        { input.record.isEmpty() &&
            <p>Loading...</p>
        }
        { !input.record.isEmpty() &&
            <DataTreeViewer data={input.record.unwrap()}/>
        }
    </>
}