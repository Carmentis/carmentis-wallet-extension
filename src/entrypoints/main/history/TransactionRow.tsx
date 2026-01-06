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

import {ArrowDownward, ArrowUpward} from "@mui/icons-material";
import React from "react";
import {AccountTransaction} from '@cmts-dev/carmentis-sdk/client';

export function TransactionRow({transaction}: { transaction: AccountTransaction }) {
    const isPositive = transaction.isPositive()
    const date = transaction.transferredAt();
    const linkedAccount = transaction.getLinkedAccount()

    // Format date nicely
    const formattedDate = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Format time separately
    const formattedTime = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Truncate linked account
    const truncatedAccount = linkedAccount.encode().length > 20
        ? linkedAccount.encode().slice(0, 10) + '...' + linkedAccount.encode().slice(-8)
        : linkedAccount.encode();

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{formattedDate}</div>
                <div className="text-xs text-gray-500">{formattedTime}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                    {isPositive ? (
                        <ArrowUpward className="text-green-500" fontSize="inherit" />
                    ) : (
                        <ArrowDownward className="text-red-500" fontSize="inherit" />
                    )}
                    {transaction.getTransactionTypeLabel()}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm text-gray-900 font-mono" title={linkedAccount.encode()}>
                    {truncatedAccount}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.getAmount().toString()}
                </div>
            </td>
        </tr>
    );
}
