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

import {useAccountBalance} from "@/hooks/useAccountBalance.tsx";
import {activeAccountPublicKeyState} from "@/states/states.tsx";
import {useWallet} from "@/hooks/useWallet.tsx";

/**
 * Custom hook to fetch and manage the account balance for the active account.
 * It leverages the Recoil state for the active account's public key and uses `useSWR`
 * for data fetching and caching.
 *
 * @return {object} An SWR response object containing the account balance data, loading state, and error state.
 */
export function useOptimizedAccountBalance() {
    const accountPublicKey = useRecoilValue(activeAccountPublicKeyState);
    const wallet = useWallet();
    return useSWR(
        accountPublicKey ? ['balanceAccount', accountPublicKey, wallet] : null,
        ([, pk, wallet]) => useAccountBalance(pk, wallet.nodeEndpoint)
    );
}