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

import {Box, Breadcrumbs, Button, Card, CardContent, Chip, Divider, Link, Typography} from "@mui/material";
import React, {useEffect, useState, useTransition} from "react";
import * as sdk from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import {BlockViewer} from "@/entrypoints/components/popup/popup-event-approval.tsx";
import {useParams} from "react-router";
import {Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator} from "@mui/lab";
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import {getUserKeyPair} from "@/entrypoints/main/wallet.tsx";
import {useRecoilValue} from "recoil";
import {activeAccountState, useWallet, walletState} from "@/entrypoints/contexts/authentication.context.tsx";
import {useAsyncFn} from "react-use";

export default function VirtualBlockchainViewer() {
    const params = useParams<{hash: string}>();
    const hash = params.hash;
    const wallet = useWallet();
    const [state, startTransition] = useAsyncFn(async () => {
        const vb = new sdk.blockchain.appLedgerVb(hash);
        await vb.load();
        const builder = vb.getProofBuilder();
        builder.addAllMicroblocks();
        const proof = await builder.generate();
        console.debug("Generated proof:", proof)

        const json = JSON.stringify(proof, null, 2);
        const blob = new Blob([json], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `proof-${hash}.json`;
        link.click();
        URL.revokeObjectURL(url); // Clean up the URL after downloading
    });


    async function exportProof(chainId: string) {
        startTransition()
    }

    return <>
        <Breadcrumbs aria-label="breadcrumb">
            <Typography>Activity</Typography>
            <Typography>Virtual Blockchain</Typography>
            <Typography>{hash}</Typography>
        </Breadcrumbs>
        <Box sx={{my: 4, display: 'flex', flexDirection: 'row', gap: 2}}>
            <Button variant={"contained"} onClick={() => exportProof(hash)} disabled={state.loading}>
                {state.loading ? 'Exporting...' : 'Export proof'}
            </Button>
            <Link target={"_blank"} href={`${wallet.explorerEndpoint}/explorer/virtualBlockchain/${hash}`} >
                <Button variant={"contained"} >Explore on chain</Button>
            </Link>
        </Box>
        <SingleChain chainId={hash!}/>
    </>
}


function SingleChain( {chainId}: {chainId: string} ) {
    const vb = new sdk.blockchain.appLedgerVb(chainId);
    const [height, setHeight] = useState<number|undefined>(undefined);

    async function loadChain() {
        await vb.load();
        const height = vb.getHeight();
        setHeight(height-1)
    }



    useEffect(() => {
        loadChain()
    }, []);

    if (!height) return <Skeleton height={40}/>

    const content = []
    for (let i = 1; i <= height; i++) {
        content.push( <BlocViewer key={`${chainId}-${i}`} chainId={chainId} index={i} />)
    }
    return <Timeline
        sx={{
            [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
            },
        }}
    >
        {content.map((item,i) => {
            return  <TimelineItem key={i}>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    {item}
                </TimelineContent>
            </TimelineItem>
        })}
    </Timeline>
}

function BlocViewer( {chainId, index}: {chainId: string, index: number})  {
    const vb = new sdk.blockchain.appLedgerVb(chainId);
    const [record, setRecord] = useState<Record<string, any>|undefined>(undefined);
    const wallet = useRecoilValue(walletState);
    const activeAccount = useRecoilValue(activeAccountState);

    async function loadBlock() {
        const keyPair = await getUserKeyPair(wallet!, activeAccount!)
        sdk.blockchain.blockchainCore.setUser(sdk.blockchain.ROLES.OPERATOR, sdk.utils.encoding.toHexa(keyPair.privateKey))
        await vb.load();
        const record = vb.getRecord(index);
        setRecord(record);
    }

    useEffect(() => {
        loadBlock()
    }, []);



    if (record === undefined) return <Skeleton/>
    return (
        <Card style={{flex: '0 1 300px'}} key={index}>
            <CardContent>
                <Typography variant="h6">Bloc {index}</Typography>
                <BlockViewer initialPath={[]} data={record}/>
                <Divider className={"mt-2"} />
            </CardContent>
        </Card>
    );
}
