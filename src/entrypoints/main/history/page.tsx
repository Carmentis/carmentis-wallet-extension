import React from 'react';
import NoTokenAccount from '@/components/shared/NoTokenAccount.tsx';
import {Splashscreen} from "@/components/shared/Splashscreen.tsx";
import {TransactionHistory} from "@/entrypoints/main/history/TransactionHistory.tsx";
import {BalanceAvailability, CMTSToken} from "@cmts-dev/carmentis-sdk/client";
import {useAccountBalanceBreakdown} from "@/hooks/useAccountBalanceBreakdown.tsx";

export default function HistoryPage() {
    const balanceResponse = useAccountBalanceBreakdown()

    if (balanceResponse.isLoadingBreakdown) return <Splashscreen />
    if (balanceResponse.breakdownLoadingError) {
        return <NoTokenAccount />
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    Transaction History
                </h1>
                <p className="text-sm text-gray-500">
                    View your account balance and transaction history
                </p>
            </div>

            {/* Token Cards */}
            <div className="grid grid-cols-3 gap-4">
                <TokenCards breakdown={balanceResponse.breakdown} />
            </div>

            {/* Transaction History */}
            <TransactionHistory />
        </div>
    );
}

function TokenCards(input: { breakdown: BalanceAvailability }) {
    if (input.breakdown === undefined) return <></>
    const breakdown = input.breakdown.getBreakdown();

    const tokens = [
        { label: 'Spendable', amount: breakdown.spendable },
        { label: 'Staked', amount: breakdown.staked },
        { label: 'Vested', amount: breakdown.vested },
    ];

    return (
        <>
            {tokens.map(({ label, amount }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="text-xs font-medium text-gray-500 mb-3">
                        {label}
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 tracking-tight">
                        {CMTSToken.createAtomic(amount).toString()}
                    </div>
                </div>
            ))}
        </>
    );
}

