import {useRecoilValue} from "recoil";
import {activeAccountPublicKeyState} from "@/states/globals.tsx";
import {useWallet} from "@/hooks/useWallet.tsx";
import useSWR from "swr";
import {useAccountBalance} from "@/hooks/useAccountBalance.tsx";
import useProvider from "@/hooks/useProvider.ts";
import {BalanceAvailability, CMTSToken, PublicSignatureKey} from "@cmts-dev/carmentis-sdk/client";
import useAccountState from "@/hooks/useAccountState.ts";
import {useAsync} from "react-use";

export function useAccountBalanceBreakdown() {
    const accountStateResponse = useAccountState();
    const { loading: isLoadingBalance, value: breakdown, error } = useAsync(async () => {
        if (accountStateResponse.data) {
            return BalanceAvailability.createFromAccountStateAbciResponse(accountStateResponse.data);
        } else {
            return undefined;
        }

    }, [accountStateResponse.data])

    return { breakdown, isLoadingBreakdown: isLoadingBalance, breakdownLoadingError: error }
}