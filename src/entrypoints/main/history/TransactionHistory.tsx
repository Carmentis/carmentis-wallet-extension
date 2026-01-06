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

import React, {useState} from "react";
import Skeleton from "react-loading-skeleton";
import {TransactionRow} from "@/entrypoints/main/history/TransactionRow.tsx";
import {useAccountHistory} from "@/hooks/useAccountHistory.tsx";

const INITIAL_MAX_ENTRIES = 50;

export function TransactionHistory() {
    const [maxEntries, setMaxEntries] = useState(INITIAL_MAX_ENTRIES);
    const { accountHistory, isLoadingAccountHistory, accountHistoryLoadingError } = useAccountHistory(0, maxEntries);

    if (isLoadingAccountHistory) {
        return (
            <div className="mb-8">
                <Skeleton height={400}/>
            </div>
        );
    }

    if (accountHistoryLoadingError || !accountHistory) {
        return (
            <div className="mb-8 p-6 bg-red-50 rounded-lg border border-red-200">
                <div className="text-base font-semibold text-red-700 mb-2">
                    Error Loading Transactions
                </div>
                <div className="text-sm text-red-600">
                    There was an error loading your transaction history. Please try again later.
                    Reason: {accountHistoryLoadingError?.message || 'unknown'}
                </div>
            </div>
        );
    }

    if (!accountHistory.containsTransactions()) {
        return (
            <div className="mb-8 p-8 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <div className="text-base font-semibold text-gray-700 mb-2">
                    No Transactions Yet
                </div>
                <div className="text-sm text-gray-600">
                    You haven't made any transactions yet. When you do, they'll appear here.
                </div>
            </div>
        );
    }

    const transactions = accountHistory.getTransactions();

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Linked Account
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction, index) => (
                            <TransactionRow
                                key={`${transaction.getTimestamp()}-${index}`}
                                transaction={transaction}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Show more button */}
            {transactions.length >= maxEntries && (
                <div className="px-6 py-4 border-t border-gray-200 text-center">
                    <button
                        type="button"
                        onClick={() => setMaxEntries(maxEntries + 50)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Load More Transactions
                    </button>
                </div>
            )}
        </div>
    );
}

