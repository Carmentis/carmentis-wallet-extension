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

import {AppLedgerVBProps} from "@/components/popup/ApprovalMessageViewer.tsx";
import {useRecoilState, useRecoilValue} from "recoil";
import {heightState, pathState} from "@/components/popup/states.ts";
import {useAsync} from "react-use";
import {
    KeyboardArrowLeft,
    KeyboardArrowRight,
    KeyboardDoubleArrowLeft,
    KeyboardDoubleArrowRight
} from "@mui/icons-material";
import Skeleton from "react-loading-skeleton";
import {Box, IconButton, Tooltip, Typography} from "@mui/material";
import {PopupJsonViewer} from "@/components/popup/PopupJsonViewer.tsx";
import React from "react";
import {activeAccountCryptoState} from "@/states/globals.tsx";
import {SignatureSchemeId, CryptoEncoderFactory} from '@cmts-dev/carmentis-sdk/client';

/**
 * Compares two numbers and returns the larger of the two.
 *
 * @param {number} a - The first number to compare.
 * @param {number} b - The second number to compare.
 * @return {number} The larger of the two numbers.
 */
function max(a: number, b: number) {
    return a < b ? b : a
}

function min(a: number, b: number) {
    return a < b ? a : b
}

/**
 * Renders a viewer component for displaying and navigating through record data.
 *
 * @param {AppLedgerVBProps} props - The component's properties.
 * @param {object} props.vb - The virtualized block providing access to record data and navigation methods.
 * @return {JSX.Element} A React JSX Element that renders the data viewer UI, including navigation controls and a data table.
 */
export function RecordDataViewer({applicationLedger}: AppLedgerVBProps) {
    const [height, setHeight] = useRecoilState(heightState);
    const [path, setPath] = useRecoilState(pathState);
    const maxH = applicationLedger.getHeight();
    const h = height ?? applicationLedger.getHeight();
    const accountCrypto = useRecoilValue(activeAccountCryptoState)
    const {loading, error, value: record} = useAsync(async () => {
        const genesisSeed = await applicationLedger.getGenesisSeed();
        const actorCrypto = accountCrypto?.deriveActorFromVbSeed(genesisSeed.toBytes());
        console.log(actorCrypto);
        const pk = await actorCrypto?.getPublicSignatureKey(SignatureSchemeId.SECP256K1);
        const encodedGenesisSeed = genesisSeed.encode();
        const sigEncoder = CryptoEncoderFactory.defaultStringSignatureEncoder();
        console.log(`Generated signature public key for genesisSeed ${encodedGenesisSeed}: ${await sigEncoder.encodePublicKey(pk)}`)
        console.log(applicationLedger)
        console.log(await applicationLedger.getActorIdByPublicSignatureKey(pk))
        return await applicationLedger.getRecord(h, actorCrypto);
    }, [h])

    console.log("Record data viewer state:", record, loading, error)
    console.log(record, typeof record)


    function goToStart() {
        setHeight(1)
    }

    function goToPrev() {
        setHeight(height => max(height ? height - 1 : h - 1, 1));
    }

    function goToNext() {
        setHeight(height => min(height ? height + 1 : h + 1, maxH));
    }

    function goToEnd() {
        setHeight(maxH)
    }

    // Icons for navigation buttons
    const navButtons = [
        {icon: <KeyboardDoubleArrowLeft fontSize="small"/>, tooltip: "Begin", onClick: goToStart, disabled: h === 1},
        {icon: <KeyboardArrowLeft fontSize="small"/>, tooltip: "Previous", onClick: goToPrev, disabled: h === 1},
        {icon: <KeyboardArrowRight fontSize="small"/>, tooltip: "Next", onClick: goToNext, disabled: h == maxH},
        {icon: <KeyboardDoubleArrowRight fontSize="small"/>, tooltip: "End", onClick: goToEnd, disabled: h == maxH},
    ]


    if (loading) return <Skeleton/>
    const data = path.reduce((r, item) => r[item], record)
    return <div className={"flex flex-col space-y-2 h-full"}>
        <Box className="flex justify-between items-center">
            <Typography variant="body2" className="font-medium text-gray-700">
                Block {h}/{maxH}
            </Typography>
            <Box className="flex space-x-1">
                {navButtons.map((b, i) => (
                    <Tooltip key={i} title={b.tooltip}>
                        <span>
                            <IconButton
                                size="small"
                                disabled={b.disabled}
                                onClick={b.onClick}
                                className="p-1"
                            >
                                {b.icon}
                            </IconButton>
                        </span>
                    </Tooltip>
                ))}
            </Box>
        </Box>
        <PopupJsonViewer data={data} initialPath={path} key={h}/>
    </div>
}