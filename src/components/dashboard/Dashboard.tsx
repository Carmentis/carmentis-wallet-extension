import React, {ReactElement, useContext, useEffect, useRef, useState, useTransition} from "react";
import {Wallet} from "@/src/Wallet.tsx";
import '../../../entrypoints/main/global.css'

import {EmailValidation} from "@/src/components/dashboard/EmailValidation.tsx";
import {Route, Routes, useNavigate} from "react-router";
import Parameters from "@/src/components/dashboard/Parameters.tsx";
import {AuthenticationContext, WalletContext} from "@/src/components/commons/AuthenticationGuard.tsx";
import {DropdownAccountSelection} from "@/src/components/dashboard/DropdownAccountSelection.tsx";
import {FlowView} from "@/src/AccountHistoryReader.tsx";
import Skeleton from "react-loading-skeleton";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js"


import 'react-loading-skeleton/dist/skeleton.css'
import {MicroBlock} from "@/src/Account.tsx";
import {Encoders} from "@/src/Encoders.tsx";
import {Optional} from "@/src/Optional.tsx";
import {Formatter} from "@/src/Formatter.tsx";
import {Flow} from "@/src/components/popup/PopupDashboard.tsx"
import {b} from "formdata-node/lib/File-cfd9c54a";


/**
 * Dashboard of the full page application.
 *
 * @constructor
 */
export function Dashboard() : ReactElement {

    // load the authentication context
    const authentication = useContext(AuthenticationContext);
    const wallet = authentication.wallet.unwrap();
    const activeAccount = wallet.getActiveAccount().unwrap();

    // state to show the navigation
    const [showMenu, setShowMenu] = useState<boolean>(false);

    // create the navigation
    const navigate = useNavigate();



    function goToParameters() {
        setShowMenu(false)
        navigate("/parameters")
    }

    function logout() {
        setShowMenu(false)
        authentication.Disconnect()
    }

    function goToHelp() {
        setShowMenu(false);
        window.open("https://docs.carmentis.io", "_blank");
    }

    return (
        <>
            <nav className="bg-white  dark:bg-gray-900 border-b-2 border-gray-100">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <div
                         className="flex items-center rtl:space-x-reverse h-4 border-gray-100  py-4 px-1">
                        <DropdownAccountSelection></DropdownAccountSelection>
                    </div>




                    <div className="relative inline-block text-left">
                        <div>
                            <button onClick={() => setShowMenu(!showMenu)}
                                    className="inline-flex w-full justify-center rounded-full bg-white p-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                                        id="menu-button" aria-expanded="true" aria-haspopup="true">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5"
                                         stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"/>
                                    </svg>
                                </button>
                            </div>


                            <div hidden={!showMenu} onMouseLeave={() => setShowMenu(false)}
                                 className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                 role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                                <div className="py-1" role="none">
                                    <div
                                        className="block px-4 py-2 text-sm text-gray-700 hover:text-green-400 hover:cursor-pointer"
                                        id="menu-item-0" onClick={goToParameters}>Parameters
                                    </div>
                                    <div
                                        className="block px-4 py-2 text-sm text-gray-700 hover:text-green-400 hover:cursor-pointer"
                                        id="menu-item-1" onClick={logout}>Logout
                                    </div>
                                    <div
                                        className="block px-4 py-2 text-sm text-gray-700 hover:text-green-400 hover:cursor-pointer"
                                        id="menu-item-0" onClick={goToHelp}>
                                        Get help
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            <div className="h-full w-full p-4">
                <Routes>
                    <Route path="/" element={<DashboardMainContent key={wallet.data.activeAccountId} />}/>
                    <Route path="/parameters" element={
                        <Parameters  />
                    }/>
                </Routes>
            </div>


        </>
    )

}

export function DashboardMainContent() {

    // get the active account and its history
    const authentication = useContext(AuthenticationContext);
    const walletOption = useContext(WalletContext);
    const wallet : Wallet = walletOption.unwrap();
    const setWallet = authentication.setWallet.unwrap();
    const activeAccount = wallet.getActiveAccount().unwrap();
    const history = activeAccount.getHistoryReader();

    // states for the dashboard
    const [numberOfApplications, setNumberOfApplications] = useState<number|undefined>();
    const [numberOfFlows, setNumberOfFlows] = useState<number|undefined>();
    const [spentGaz, setSpentGaz] = useState<number|undefined>();
    const [flows, setFlows] = useState<FlowView[]>([]);

    // states for the chosen flow
    const [chosenFlowId, setChosenFlowId] = useState<{applicationId: string, flowId: string}|undefined>();

    const [isLoading, setTransition] = useTransition();

    function putDataInStates() {
        // count the number of applications
        setNumberOfApplications(history.getNumberOfApplications())
        setNumberOfFlows(history.getNumberOfFlows())
        setSpentGaz(history.getSpentGaz())
        setFlows(history.getAllFlows())
    }



    // update the page when the wallet is updated
    useEffect(() => {
        setFlows([])
        setTransition(putDataInStates)
    }, [wallet]);

    useEffect(() => {
        setTransition(() => {
            synchronizeWithBlockchain()
            putDataInStates()
        });
    }, []);



    function synchronizeWithBlockchain() {
        // get the history reader
        const historyReader = activeAccount.getHistoryReader();
        const historyWriter = activeAccount.getHistoryWriter();

        for (const flow of  historyReader.getAllFlows() ) {
            const flowId = flow.flowId;
            const applicationId = flow.applicationId;

            Carmentis.getMicroChain(Encoders.FromHexa(flowId))
                .then(async response => {

                    // browse each block anchored in the micro chain.
                    let isModified = false;
                    for (const block of response.microBlock) {
                        const importMicroBlock : MicroBlock = {
                            data: undefined,
                            gas: block.gas,
                            gasPrice: 0,
                            isInitiator: false,
                            masterBlock: block.masterBlock,
                            microBlockId: Encoders.ToHexa(block.hash),
                            nonce: block.nonce,
                            ts: block.ts,
                            version: block.version
                        }

                        const modificationInThisBlock = historyWriter.addMicroBlock(applicationId, flowId, importMicroBlock);
                        isModified = isModified || modificationInThisBlock;
                    }

                    // update the wallet if a modification occurs
                    if (isModified) {
                        console.log("[dashboard] the wallet includes more modification: ", wallet)
                        setWallet(Optional.From(wallet))
                    }

                })
                .catch(error => console.error(error));
        }

        //const flowId = "17F56E3276F5FAE3F452206F69B4EEC0494DC744AC4D6F9E1F2AA1DB13091952"
    }





    function capStringSize(text : string, maxSize : number) {
        if ( text.length <= maxSize ) return text;
        return text.slice(0, maxSize) + "..."
    }



    return <>
        <div className="container mx-auto px-4">

            <div className="dashboard-section mb-20">
                <h3>Overview</h3>

                <div id="overview" className=" flex justify-evenly">
                    <div className="overview-section">
                        <h3>Applications</h3>
                        <SpanWithLoader text={numberOfApplications} isLoading={isLoading}></SpanWithLoader>
                    </div>
                    <div className="overview-section">
                        <h3>Flows</h3>
                        <SpanWithLoader text={numberOfFlows} isLoading={isLoading}></SpanWithLoader>
                    </div>
                    <div className="overview-section">
                        <h3>Spent Gaz</h3>
                        <SpanWithLoader text={spentGaz} isLoading={isLoading}></SpanWithLoader>
                    </div>
                </div>
            </div>


            <div className="dashboard-section mb-4">
                <h3>Flows</h3>
                { isLoading &&
                    <Skeleton count={5} /> // Five-line loading skeleton
                }
                { !isLoading &&
                    <div className="rounded-gray">
                        <table className="table table-auto w-full text-sm text-left rtl:text-right ">
                            <thead className="text-xs uppercase bg-gray-50 d">
                            <tr>
                                <th>Flow Id</th>
                                <th>Last update</th>
                                <th>Application</th>
                                <th>Length</th>
                                <th>Domain</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {flows.map(flow =>
                                <tr
                                    key={flow.flowId}
                                    className={
                                        "hover:bg-gray-100 hover:cursor-pointer " + (
                                            chosenFlowId !== undefined && chosenFlowId.flowId === flow.flowId ?
                                                "bg-blue-100" : ""
                                        )
                                    }
                                    onClick={() => {
                                        setChosenFlowId({ applicationId: flow.applicationId, flowId: flow.flowId })
                                    }}>
                                    <td>{capStringSize(flow.flowId, 20)}</td>
                                    <td>{Formatter.formatDate(flow.lastUpdate)}</td>
                                    <td>{flow.applicationName} <span className="text-gray-400">({capStringSize(flow.applicationId, 30)})</span></td>
                                    <td>{flow.flowLength}</td>
                                    <td onClick={() => window.open("https://" + flow.applicationDomain, "_blank")} className="hover:cursor-pointer">{flow.applicationDomain}</td>
                                    <td onClick={() => window.open(wallet.getDataEndpoint() + "/explorer/microchain/0x" + flow.flowId)}>
                                        <button className="btn-primary">View on explorer</button>
                                    </td>
                                </tr>)
                            }
                            </tbody>
                        </table>
                    </div>

                }
            </div>

            {chosenFlowId !== undefined &&
                <div className="dashboard-section">
                    <FlowDetailComponent key={chosenFlowId.flowId} chosenFlow={chosenFlowId}/>
                </div>
            }
        </div>
    </>
}


function FlowDetailComponent(input: { chosenFlow: { applicationId: string, flowId: string}}) {
    // load history
    const walletOption = useContext(WalletContext);
    const wallet = walletOption.unwrap();
    const history = wallet.getActiveAccount().unwrap().getHistoryReader();

    const [isLoading, setTransition] = useTransition();

    // load all the blocks associated with the flow
    const [blocks, setBlocks] = useState<MicroBlock[]|undefined>();

    // state to show the data of a chosen block
    const [chosenBlock, setChosenBlock] = useState<{
        applicationId: string;
        flowId: string;
        block: MicroBlock
    }|undefined>();



    useEffect(() => {
        setChosenBlock(undefined)
        setTransition(() => {
            console.log("[flow details]", input, wallet.getActiveAccount().unwrap());
            const allBlocks = history.getAllBlocksByFlowId(
                input.chosenFlow.applicationId,
                input.chosenFlow.flowId
            );
            setBlocks(allBlocks);
        })
    }, [input, wallet]);

    return <>
        <h3>Flow History</h3>
        { isLoading &&
            <Skeleton count={5} /> // Five-line loading skeleton
        }
        {!isLoading && blocks !== undefined &&
            <>
            <p><b>Flow Id:</b> {input.chosenFlow.flowId}</p>
            <div className="rounded-gray">
                <table className="table table-auto w-full text-sm text-left rtl:text-right ">
                    <thead className="text-xs uppercase bg-gray-50 d">
                    <tr>
                        <th>#</th>
                        <th>Master block</th>
                        <th>Micro block</th>
                        <th>Created at</th>
                        <th>Gas</th>

                        <th>By</th>
                    </tr>
                    </thead>
                    <tbody>
                    {blocks.map(block =>
                        <tr key={block.microBlockId} onClick={() => {setChosenBlock({
                            applicationId: input.chosenFlow.applicationId,
                            flowId: input.chosenFlow.flowId,
                            block: block
                        })}}>
                            <td>{block.nonce}</td>
                            <td className="underline"
                                onClick={() => {
                                if ( block.masterBlock ) {
                                    window.open(
                                        wallet.getDataEndpoint() + "/explorer/masterblock/" +
                                        block.masterBlock.toString().padStart(9, "0")
                                    )
                                }
                            }}>
                                {block.masterBlock}
                            </td>
                            <td className="underline"
                                onClick={() => window.open(wallet.getDataEndpoint() + "/explorer/microblock/0x" + block.microBlockId)}>
                                {block.microBlockId.slice(0, 20) + "..."}
                            </td>
                            <td>{Formatter.formatDate(block.ts)}</td>
                            <td>{block.gas}</td>
                            <td>{block.isInitiator ? "You" : "--"}</td>

                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            </>

        }


        { chosenBlock !== undefined &&
            <MicroBlockDataViewer
                key={chosenBlock.block.microBlockId}
                applicationId={chosenBlock.applicationId}
                flowId={chosenBlock.flowId}
                block={chosenBlock.block}
            />
        }
    </>
}

function MicroBlockDataViewer({applicationId, flowId, block}: {applicationId: string, flowId: string, block: MicroBlock}) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [dataTree, setDataTree] = useState<object>({});

    useEffect(() => {
        if ( block.isInitiator ) {
            setDataTree(block.data.record)
            setIsLoading(false)
        } else {
            console.log(block)
            Carmentis.loadPublicDataFromMicroBlock( applicationId, flowId, block.nonce )
                .then( data => {
                    setDataTree(data.record)
                    setIsLoading(false)
                } )

        }
    }, []);

    return <>
        <>
            <h3 className="mt-3">Block Data</h3>
            {isLoading &&
                <Skeleton count={5} /> // Five-line loading skeleton
            }

            { !isLoading &&
                <DataTreeViewer data={dataTree} />
            }

        </>


    </>
}


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
        <div className="tree-viewer" id="block-data-tree-viewer">
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


function SpanWithLoader(input: { text: string | undefined, isLoading : boolean }) {

    return (
        <div>
            {input.isLoading ? (
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-10"></div>
            ) : (
                <span>{input.text}</span>
            )}
        </div>
    );
};

export default Dashboard;
