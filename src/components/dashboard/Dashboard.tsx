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

import React, {ReactElement, useContext, useEffect, useRef, useState, useTransition} from "react";
import {Wallet} from "@/src/Wallet.tsx";
import '../../../entrypoints/main/global.css'

import {Route, Routes, useNavigate} from "react-router";
import Parameters from "@/src/components/dashboard/Parameters.tsx";
import {AuthenticationContext, WalletContext} from "@/src/components/commons/AuthenticationGuard.tsx";
import {DropdownAccountSelection} from "@/src/components/dashboard/DropdownAccountSelection.tsx";
import Skeleton from "react-loading-skeleton";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js"


import 'react-loading-skeleton/dist/skeleton.css'
import {Formatter} from "@/src/Formatter.tsx";
import {FlowDetailComponent, SpanWithLoader} from "@/src/components/dashboard/FlowDetailComponent.tsx";
import {IndexedStorage} from "@/src/IndexedStorage.tsx";
import {Encoders} from "@/src/Encoders.tsx";
import {MicroBlock} from "@/src/Account.tsx";
import {FlowView} from "@/src/FlowView.tsx";


/**
 * Dashboard of the full page application.
 *
 * @constructor
 */
export function Dashboard() : ReactElement {

    // load the authentication context
    const authentication = useContext(AuthenticationContext);
    const wallet = authentication.wallet.unwrap();

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

                        <DropdownAccountSelection allowAccountCreation={true} large={true}></DropdownAccountSelection>
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
    const walletOption = useContext(WalletContext);
    const wallet : Wallet = walletOption.unwrap();
    const activeAccount = wallet.getActiveAccount().unwrap();

    // states for the dashboard
    const [numberOfApplications, setNumberOfApplications] = useState<number|undefined>();
    const [numberOfFlows, setNumberOfFlows] = useState<number|undefined>();
    const [spentGaz, setSpentGaz] = useState<number|undefined>();
    const [flows, setFlows] = useState<FlowView[]>([]);

    // states for the chosen flow
    const [chosenFlowId, setChosenFlowId] = useState<{applicationId: string, flowId: string}|undefined>();
    const [isLoading, setTransition] = useTransition();

    // navigator
    const navigate = useNavigate();


    function putDataInStates() {
        IndexedStorage.CreateDatabase(activeAccount).then(async (db : IndexedStorage ) => {
            db.getNumberOfApplications().then(setNumberOfApplications);
            db.getFlowsNumberOfAccount().then(setNumberOfFlows);
            db.getSpentGaz().then(setSpentGaz)
            db.getAllFlowsOfAccount().then(setFlows)
        });
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

        IndexedStorage.CreateDatabase(activeAccount).then(async (db : IndexedStorage ) => {
            try {

                const flows = await db.getAllFlowsOfAccount();
                for (const flow of flows) {

                    const flowId = flow.flowId;
                    const microChain = await Carmentis.getMicroChain(Encoders.FromHexa(flowId));
                    const blocksOnChain = microChain.microBlock;
                    for (const block of blocksOnChain) {

                        const microBlockId: string = Encoders.ToHexa(block.hash);
                        const foundInDatabase = await db.checkMicroBlockExists(
                            flow.flowId,
                            block.nonce
                        );
                        if ( foundInDatabase ) {
                            if ( typeof block.masterBlock === "number" ) {
                                console.log("[dashbord] update of existing block:", block)

                                await db.updateMasterMicroBlock(
                                    microBlockId,
                                    block.masterBlock
                                )
                            }
                        } else {

                            const importMicroBlock : MicroBlock = {
                                accountId: activeAccount.getId(),
                                applicationId: flow.applicationId,
                                flowId: flowId,
                                data: undefined,
                                gas: block.gas,
                                gasPrice: block.gasPrice,
                                isInitiator: false,
                                masterBlock: block.masterBlock,
                                microBlockId: Encoders.ToHexa(block.hash),
                                nonce: block.nonce,
                                ts: block.ts,
                                version: block.version
                            }
                            console.log("[dashboard] add in database:", importMicroBlock)
                            await db.addMicroBlock( importMicroBlock );

                        }
                    }

                }

            } catch (e : any) {
                throw new Error(e);
            }
        })

    }





    function capStringSize(text : string, maxSize : number) {
        if ( text.length <= maxSize ) return text;
        return text.slice(0, maxSize) + "..."
    }



    return <>
        <div className="container mx-auto px-4">

            <div className="dashboard-section mb-5">
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
                        <h3>Spent Gas</h3>
                        <SpanWithLoader text={spentGaz} isLoading={isLoading}></SpanWithLoader>
                    </div>
                </div>
            </div>

            { activeAccount.getEmail().isEmpty() &&

                <button type="button" className="brand-bar bg-green-100 p-4 rounded-md w-full text-left hover:underline mb-4" onClick={() => {
                    navigate("/parameters")
                }}>
                    Configure your email with your email
                </button>
            }


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
                                                "bg-gray-200" : ""
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
                                        <button className="btn-primary">Explore flow</button>
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



export default Dashboard;
