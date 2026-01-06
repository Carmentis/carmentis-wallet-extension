import {useAsync} from "react-use";
import useSWR from "swr";


export default function useAccountState() {
    const provider= useProvider();
    const {accountPublicKey, loading: isPublicKeyLoading} = useAccountPublicKey();

    return useSWR(
        ["accountState", accountPublicKey],
        async () => {
        if (accountPublicKey) {
            const accountHash = await provider.getAccountIdByPublicKey(accountPublicKey);
            const accountState = await provider.getAccountState(accountHash);
            return accountState
        } else {
            throw new Error("No account public key provided");
        }
    })

}