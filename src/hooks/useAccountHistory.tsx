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

import {
    AccountHistoryView,
    AccountTransactions,
    ProviderFactory,
    PublicSignatureKey
} from '@cmts-dev/carmentis-sdk/client';
import {useAsync} from "react-use";
import useAccountState from "@/hooks/useAccountState.ts";

/**
 * Fetches the account history for a given account public key by querying
 * the blockchain explorer. This function retrieves a specific number
 * of historical records starting from a given offset.
 *
 * @param {string} accountPublicKey - The public key of the account for which the history is to be fetched.
 * @param {number} [offset=0] - The starting offset for the history records. Defaults to 0.
 * @param {number} [maxRecords=50] - The maximum number of records to retrieve. Defaults to 50.
 * @return {Promise<AccountHistoryView>} A promise that resolves to the account history object.
 * @throws {Error} Throws an error if unable to fetch the account history.
 */
export function useAccountHistory(
    offset = 0,
    maxRecords = 50,
) {
    const provider = useProvider();
    const {accountPublicKey} = useAccountPublicKey();
    const accountStateResponse = useAccountState();
    const {value: accountHistory, loading: isLoadingAccountHistory, error: accountHistoryLoadingError} = useAsync(async () => {
       if (accountStateResponse.data && accountPublicKey) {
           const accountState = accountStateResponse.data;
           const accountHash = await provider.getAccountIdByPublicKey(accountPublicKey);
           const accountHistory = await provider.getAccountHistory(accountHash, accountState.lastHistoryHash, maxRecords);
           return AccountTransactions.createFromAbciResponse(accountHistory);
       } else {
           return undefined;
       }
    }, [accountStateResponse.data]);
    return { accountHistory, isLoadingAccountHistory, accountHistoryLoadingError };
}