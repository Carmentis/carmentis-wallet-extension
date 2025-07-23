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

import {BlockchainFacade, CMTSToken, PublicSignatureKey} from '@cmts-dev/carmentis-sdk/client';

/**
 * Fetches the account balance for the given account's public key from the specified node URL.
 *
 * @param {PublicSignatureKey} accountPublicKey - The public signature key of the account whose balance is to be retrieved.
 * @param {string} nodeUrl - The URL of the node to connect to for fetching the account data.
 * @return {Promise<number>} A promise that resolves to the account balance as a number.
 * @throws {Error} If there is an issue retrieving the account information or balance.
 */
export async function useAccountBalance(accountPublicKey: PublicSignatureKey, nodeUrl: string): Promise<CMTSToken> {
    try {
        /*
        // create the explorer
        const provider = ProviderFactory.createInMemoryProviderWithExternalProvider(nodeUrl);
        const explorer = Explorer.createFromProvider(provider);

        // load the hash of the account
        const accountHash = await explorer.getAccountByPublicKey(accountPublicKey);
        const accountState = await explorer.getAccountState(accountHash);
        return accountState.balance / TOKEN;

         */
        const blockchain = BlockchainFacade.createFromNodeUrl(nodeUrl);
        const accountHash = await blockchain.getAccountHashFromPublicKey(accountPublicKey);
        return blockchain.getAccountBalance(accountHash);
    } catch (e) {
        console.log("Cannot proceed to the account's balance data:", e)
        return CMTSToken.zero()
    }
}