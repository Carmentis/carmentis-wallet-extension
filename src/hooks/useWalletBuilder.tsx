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

import {useDefaultNetworkConfig} from "@/hooks/useDefaultNetworkConfig.tsx";
import {useAccountBuilder} from "@/hooks/useAccountBuilder.tsx";
import {Wallet} from "@/types/Wallet.ts";

export function useWalletBuilder() {
    const {nodeEndpoint: defaultNodeEndpoint, explorerEndpoint: defaultExplorerEndpoint} = useDefaultNetworkConfig();
    const {buildAccountFromPseudo} = useAccountBuilder();

    function buildWallet(accountName : string, seed : string, password: string) : Wallet {

        if ( !seed || typeof seed !== 'string') {
            throw new Error( "Cannot instantiate a wallet from undefined seed" );
        }
        // Create a default account
        const defaultPseudo = accountName;
        const createdAccount = buildAccountFromPseudo(defaultPseudo);
        return {
            seed: seed,
            password: password,
            accounts: [createdAccount],
            counter: 1,
            activeAccountId : createdAccount.id,
            nodeEndpoint : defaultNodeEndpoint,
            explorerEndpoint: defaultExplorerEndpoint,
        }

    }



    return { buildWallet }
}
