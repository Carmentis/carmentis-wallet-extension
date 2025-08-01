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

import {EncoderFactory, SignatureAlgorithmId, Wallet as CarmentisWallet} from "@cmts-dev/carmentis-sdk/client";
import {SignatureKeyPair} from "@/types/SignatureKeyPair.tsx";
import {Account} from "@/types/Account.tsx";
import {Wallet} from "@/types/Wallet.ts";

export function useAccountKeyPairLoader() {
    return { loadAccountKeyPair }
}

async function loadAccountKeyPair(wallet : Wallet, account : Account) : Promise<SignatureKeyPair>  {
    return new Promise((resolve, reject) => {
        const hexEncoder = EncoderFactory.bytesToHexEncoder();
        let seed = hexEncoder.decode(wallet.seed);
        const carmentisWallet = CarmentisWallet.fromSeed(seed);
        const privateKey = carmentisWallet.getAccountPrivateSignatureKey(SignatureAlgorithmId.SECP256K1, account.nonce);
        const publicKey = privateKey.getPublicKey();
        resolve({
            privateKey: privateKey,
            publicKey: publicKey
        })
    })
}