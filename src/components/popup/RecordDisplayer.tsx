import {Optional} from "@/src/Optional.tsx";
import {useRef, useState} from "react";



function DataTreeViewer(input : {data: object}){
    const data = input.data;
    const records = data.record;

    // this ref is used to remember the level in which
    let tree = useRef([records]);
    // this ref is used to have a well-formatted header when digging into the content
    let path = useRef<string[]>([]);
    let [currentDepth, setCurrentDepth] = useState(0)
    let node = tree.current[currentDepth];


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




    return <>
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
                                    <td className="event-approval-data-value">&#8594;</td>
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