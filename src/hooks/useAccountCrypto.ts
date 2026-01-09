import {EncoderFactory, WalletCrypto} from "../../../carmentis-core/dist/client";
import {activeAccountCryptoState} from "@/states/globals.tsx";
import {useRecoilValue} from "recoil";

export default function useAccountCrypto() {
    const account = useRecoilValue(activeAccountCryptoState);
    return { accountCrypto: account }
}