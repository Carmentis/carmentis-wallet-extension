
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

import React, {useContext, useEffect, useState, useTransition} from "react";
import {WalletContext} from "@/src/components/commons/AuthenticationGuard.tsx";
import {MicroBlock} from "@/src/Account.tsx";
import Skeleton from "react-loading-skeleton";
import {Formatter} from "@/src/Formatter.tsx";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk";
import {DataTreeViewer} from "@/src/components/dashboard/DataTreeViewer.tsx";

export function FlowDetailComponent(input: { chosenFlow: { applicationId: string, flowId: string}}) {
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
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {blocks.map(block =>
                            <tr className={"hover:bg-gray-100 " + (chosenBlock !== undefined && chosenBlock.block.microBlockId === block.microBlockId ? "bg-gray-200" : "")}
                                key={block.microBlockId} onClick={() => {setChosenBlock({
                                applicationId: input.chosenFlow.applicationId,
                                flowId: input.chosenFlow.flowId,
                                block: block
                            })}}>
                                <td>{block.nonce}</td>
                                <td className="underline">
                                    {block.masterBlock}
                                </td>
                                <td className="underline"
                                    >
                                    {block.microBlockId.slice(0, 20) + "..."}
                                </td>
                                <td>{Formatter.formatDate(block.ts)}</td>
                                <td>{block.gas}</td>
                                <td>{block.isInitiator ? "You" : "--"}</td>
                                <td>
                                    <button className="btn-primary"
                                            onClick={() => {
                                                if (block.masterBlock) {
                                                    window.open(
                                                        wallet.getDataEndpoint() + "/explorer/masterblock/" +
                                                        block.masterBlock.toString().padStart(9, "0")
                                                    )
                                                }
                                            }}>
                                        Explore master block
                                    </button>
                                    <button className="btn-primary"
                                            onClick={() => window.open(wallet.getDataEndpoint() + "/explorer/microblock/0x" + block.microBlockId)}>
                                        Explore micro block
                                    </button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </>

        }


        {chosenBlock !== undefined &&
            <MicroBlockDataViewer
                key={chosenBlock.block.microBlockId}
                applicationId={chosenBlock.applicationId}
                flowId={chosenBlock.flowId}
                block={chosenBlock.block}
            />
        }
    </>
}

function MicroBlockDataViewer({applicationId, flowId, block}: {
    applicationId: string,
    flowId: string,
    block: MicroBlock
}) {
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




export function SpanWithLoader(input: { text: string | undefined, isLoading : boolean }) {

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