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
import useSWR from "swr";
import {useAccountHistory} from "@/hooks/useAccountHistory.tsx";
import {activeAccountPublicKeyState, nodeEndpointState} from "@/states/globals.tsx";

export function useAccountTransactionHistoryHook(
    offset = 0,
    maxRecords = 50,
) {
    const network = useRecoilValue(nodeEndpointState)
    const accountPublicKey = useRecoilValue(activeAccountPublicKeyState);
    return useSWR(
        accountPublicKey ? ['accountTransactionHistory', network, accountPublicKey, offset, maxRecords] : null,
        ([, node, pk, o, m]) => useAccountHistory(node, pk, o, m)
    );
}