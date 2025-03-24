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

import {useRecoilValue} from "recoil";
import {activeAccountState, walletState} from "@/entrypoints/contexts/authentication.context.tsx";
import React, {useEffect, useState} from "react";
import {AccountDataStorage} from "@/utils/db/account-data-storage.ts";
import {getUserKeyPair} from "@/entrypoints/main/wallet.tsx";
import * as sdk from "@cmts-dev/carmentis-sdk/client";
import {Box, Breadcrumbs, Card, CardContent, Link, Typography} from "@mui/material";
import Skeleton from "react-loading-skeleton";
import {BlockViewer} from "@/entrypoints/components/popup/popup-event-approval.tsx";
import {useNavigate} from "react-router";

export default function ActivityPage() {
    return <>
        <Breadcrumbs aria-label="breadcrumb">
            Activity
        </Breadcrumbs>
        <TableOfChains/>
    </>
}

function TableOfChains() {
    const offset = 0;
    const limit = 200;
    const wallet = useRecoilValue(walletState);
    const activeAccount = useRecoilValue(activeAccountState);
    const navigate = useNavigate();
    if (!activeAccount) return <></>;
    const [chains, setChains] = useState<string[]>([]);

    async function loadChains() {
        const db = await AccountDataStorage.connectDatabase(activeAccount!);
        const keyPair = await getUserKeyPair(wallet!, activeAccount!)
        const chains = await db.getAllApplicationVirtualBlockchainId(offset, limit);
        sdk.blockchain.blockchainCore.setUser(sdk.blockchain.ROLES.OPERATOR, sdk.utils.encoding.toHexa(keyPair.privateKey))
        setChains(chains.map(c => c.virtualBlockchainId))
    }

    useEffect(() => {
        loadChains()
    }, []);


    function navigateToVirtualBlockchainView(chainId: string) {
        navigate(`/activity/${chainId}`)
    }

    return <Box>
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Virtual Blockchains
                </Typography>
                <Box sx={{overflow: 'auto'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead>
                        <tr>
                            <th style={{textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc'}}>
                                Chain Hash
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {chains.map((chain, index) => (
                            <tr key={index} onClick={() => navigateToVirtualBlockchainView(chain)} className={"hover:cursor-pointer hover:bg-gray-50"}>
                                <td style={{textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc'}}>
                                    {chain}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Box>
            </CardContent>
        </Card>
    </Box>
}


function ChainVisualizer() {
    const offset = 0;
    const limit = 200;
    const wallet = useRecoilValue(walletState);
    const activeAccount = useRecoilValue(activeAccountState);
    if (!activeAccount) return <></>;
    const [chains, setChains] = useState<string[]>([]);

    async function loadChains() {
        const db = await AccountDataStorage.connectDatabase(activeAccount!);
        const keyPair = await getUserKeyPair(wallet!, activeAccount!)
        const chains = await db.getAllApplicationVirtualBlockchainId(offset, limit);
        sdk.blockchain.blockchainCore.setUser(sdk.blockchain.ROLES.OPERATOR, sdk.utils.encoding.toHexa(keyPair.privateKey))
        setChains(chains.map(c => c.virtualBlockchainId))
    }

    useEffect(() => {
        loadChains()
    }, []);



}

