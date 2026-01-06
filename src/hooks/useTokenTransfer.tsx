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
    CMTSToken,
    CryptoEncoderFactory, FeesCalculationFormulaFactory, Hash,
    PrivateSignatureKey,
    Provider,
    ProviderFactory,
    PublicSignatureKey, SectionType, Utils
} from '@cmts-dev/carmentis-sdk/client';
import {useAsyncFn} from "react-use";

export function useTokenTransfer() {
    const provider = useProvider();
    return useAsyncFn(async (senderPrivateKey: PrivateSignatureKey, senderPublicKey: PublicSignatureKey, receiverPublicKey: string, tokenAmount: number) => {
        const signatureEncoder = CryptoEncoderFactory.defaultStringSignatureEncoder();
        const parsedReceiverPublicKey = await signatureEncoder.decodePublicKey(receiverPublicKey);

        // sender
        const senderAccountId = await provider.getAccountIdByPublicKey(senderPublicKey);
        const senderAccountVb = await provider.loadAccountVirtualBlockchain(Hash.from(senderAccountId));

        // receiver
        const receiverAccountId = await provider.getAccountIdByPublicKey(parsedReceiverPublicKey);

        // Construct microblock for transfer
        const mb = await senderAccountVb.createMicroblock();
        mb.addSection({
            type: SectionType.ACCOUNT_TRANSFER,
            account: receiverAccountId,
            amount: CMTSToken.createCMTS(tokenAmount).getAmountAsAtomic(),
            publicReference: 'Transfer',
            privateReference: '',
        })

        // compute the gas
        const protocolVariables = await provider.getProtocolVariables();
        const feesCalculationVersion = protocolVariables.getFeesCalculationVersion();
        const feesCalculationFormula = FeesCalculationFormulaFactory.getFeesCalculationFormulaByVersion(feesCalculationVersion);
        const gas = await feesCalculationFormula.computeFees(senderPrivateKey.getSignatureSchemeId(), mb);
        console.log(`Gas for transfer: ${gas.toString()}`)
        mb.setGas(gas);

        // sign
        await mb.seal(senderPrivateKey, {
            feesPayerAccount: senderAccountId
        });

        await provider.publishMicroblock(mb);
    })
}