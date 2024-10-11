import {Optional} from "@/src/Optional.tsx";
import {ReactElement, useRef, useState} from "react";
import assert from "node:assert";


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



function DataTreeViewer(input : {data: object}) {

    const data = input.data;
    const records = data.record;

    // this ref is used to remember the level in which
    let tree = useRef([records]);
    let [currentDepth, setCurrentDepth] = useState(0)
    let node = tree.current[currentDepth];

    // this ref is used to have a well-formatted header when digging into the content
    let path = useRef<string[]>([]);


    /**
     * This function is called when the user wants to access a node in the structure of the block by clicking on the
     * field name in the message.
     *
     * Note: this function currently do *not* support the access to a previous block.
     *
     * @param fieldPath The path of the target node.
     */
    function goToNode(  fieldPath : string[] ) {


        if ( fieldPath.length === 0  ){
            throw new Error("Cannot access the provided node: The field path is invalid")
        }

        // prevent access to last elements
        if ( fieldPath.includes("last") ) {
            console.warn("[popup] The current version do not support access to the previous block.")
            return;
        }


        // the path is already known
        path.current = fieldPath.slice(1);

        const root = tree.current[0];
        const updatedTree = [root];
        let currentNode = root;
        let index = 1
        while (index < fieldPath.length) {
            const childName = fieldPath[index];
            console.log(currentNode, childName);
            const child = currentNode[childName];
            updatedTree.push(child);
            currentNode = child;
            index += 1;
        }

        // update the tree
        tree.current = updatedTree;
        setCurrentDepth(index - 1);


    }


    /**
    *
    */
    function formatMessage( msg : string, msgParts : (TextualMessagePart | ObjectMessagePart)[] ) {

        let result = [];

        for (let i = 0; i < msgParts.length; i++) {
            const part = msgParts[i];
            switch (part.isField) {
                case true:
                    const fieldName : string = part.def.name;
                    const fieldPath : string[] = part.field.split(".")
                    const fieldValue = part.value;
                    console.log(fieldName, typeof fieldName)
                    if ( typeof fieldValue === "string" ) {
                        result.push(<span className="field">{fieldValue}</span>)
                    } else {
                        result.push(<span className="underline" onClick={() => {
                                goToNode(fieldPath);
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



    function goToChild( childName : string ) {
        tree.current.push(node[childName]);
        path.current.push(childName);
        setCurrentDepth(currentDepth + 1)
    }

    function backToParent() {
        if ( currentDepth === 0 ) {
            throw new Error("Cannot back to the parent node in the tree display: already at root");
        }
        tree.current.pop();
        path.current.pop();
        setCurrentDepth(currentDepth - 1)
    }

    function formatBack() : string {
        let content = path.current[0];
        for (let i = 1; i < path.current.length; i++) {
            content = content + " > " + path.current[i]
        }
        return content;
    }


    // format the message (defined in the workspace)
    const msg = data.msg;
    const msgParts = data.msgParts;
    const formattedMessage = formatMessage(msg, msgParts);

    return <>
        <div id="event-approval-message" className="p-1 rounded-md bg-gray-100 mb-2">
            {formattedMessage}
        </div>

        Ensure that the received data is correct:
        <div className="tree-viewer">
            <table className="w-full mb-2" id="event-approval-table">
                <tbody id="event-approval-data">
                {currentDepth !== 0 &&
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