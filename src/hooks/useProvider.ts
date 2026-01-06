import {ProviderFactory} from "@cmts-dev/carmentis-sdk/client";
import {useWallet} from "@/hooks/useWallet.tsx";

export default function useProvider() {
    const wallet = useWallet();
    return ProviderFactory.createInMemoryProviderWithExternalProvider(wallet.nodeEndpoint);
}