
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

export function DataTreeViewer(input : {data: object}) {

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



    // we remember the current path in the current displayed node to remember our location.
    // An empty array means "show the root of the current tree"
    const [relativeFieldPath, setRelativeFieldPath] = useState<string[]>([]);

    // prepare the rendering by accessing the node in the specified tree
    const tree = input.data;
    let node = tree;
    for (const child of relativeFieldPath) {
        node = node[child];
    }

    return <>
        <div className="tree-viewer data-tree-viewer" id="block-data-tree-viewer">
            <table className={'w-full mb-2 border-1 border-gray-100'}>
                <tbody>

                {relativeFieldPath.length !== 0 &&
                    <tr onClick={backToParent}>
                        <td colSpan={2}>&#8592; {formatBack()}</td>
                    </tr>
                }


                {
                    Object.keys(node).map((key, index) => (
                        <tr key={index} onClick={() => {
                            if (typeof node[key] === "object") {
                                goToChild(key)
                            }
                        }}>
                            <td className="event-approval-data-key">{key}</td>
                            {typeof node[key] === "object" &&
                                <td className="event-approval-data-child">&#8594;</td>
                            }
                            {typeof node[key] !== "object" &&
                                <td className="event-approval-data-value">{node[key]}</td>
                            }



                        </tr>
                    ))
                }
                </tbody>
            </table>

        </div>
    </>;
}