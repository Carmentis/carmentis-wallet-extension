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

import React, {useEffect, useState, useTransition} from "react";
import {MicroBlock} from "@/entrypoints/main/Account.tsx";
import Skeleton from "react-loading-skeleton";
import {Formatter} from "@/entrypoints/main/Formatter.tsx";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk";
import {DataTreeViewer} from "@/entrypoints/components/dashboard/data-tree-viewer.component.tsx";
import {activeAccountState, useWallet} from '@/entrypoints/contexts/authentication.context.tsx';
import {useRecoilValue} from "recoil";
import {AccountDataStorage} from "@/entrypoints/main/account-data-storage.ts";

export function VirtualBlockchainDetailComponent(input: { chosenFlow: { applicationId: string, flowId: string}}) {
    // load history
    const wallet = useWallet();
    const activeAccount = useRecoilValue(activeAccountState);

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
        if (!activeAccount) return;
        console.log("[flow details]", input);
        AccountDataStorage.connectDatabase(activeAccount).then((db) => {
            db.getAllBlocksByFlowId(input.chosenFlow.flowId).then((blocks : MicroBlock[]) => {
                blocks.sort( (b1, b2) => b1.nonce < b2.nonce ? -1 : 1 )
                setBlocks(blocks);
            });
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
                                                        wallet.explorerEndpoint + "/explorer/masterblock/" +
                                                        block.masterBlock.toString().padStart(9, "0")
                                                    )
                                                }
                                            }}>
                                        Explore master block
                                    </button>
                                    <button className="btn-primary"
                                            onClick={() => window.open(wallet.explorerEndpoint + "/explorer/microblock/0x" + block.microBlockId)}>
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
        Carmentis.loadPublicDataFromMicroBlock( applicationId, flowId, block.nonce )
            .then( (data: any) => {
                setDataTree(data.record)
                setIsLoading(false)
            } )
    }, []);

    const content = isLoading  ?  <Skeleton count={5} /> :  <DataTreeViewer data={dataTree} />;
    return <>
        <h3 className="mt-3">Block Data</h3>
        {content}
    </>
}

// ajouter écrans sans appel sdk: form transfer token et affichage solde et dernières transactions



