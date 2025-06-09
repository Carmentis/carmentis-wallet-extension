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

import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js"
import * as sdk from '@cmts-dev/carmentis-sdk/client';

import {Account, DefaultAccountWithIdentity} from '@/entrypoints/main/Account.tsx';

import {Encoders} from '@/entrypoints/main/Encoders.tsx';

/**
 * The default endpoint URL for the node server used in the application.
 * This endpoint is typically utilized as the base URL for connecting
 * to the server's API for performing operations or retrieving data.
 *
 * @constant {string}
 */
const DEFAULT_NODE_ENDPOINT = "https://dev-node.beta.carmentis.io"
const DEFAULT_EMAIL_ORACLE_ENDPOINT = "https://data.testapps.carmentis.io"
const DEFAULT_EXPLORER_ENDPOINT = "https://explorer.beta.carmentis.io"


export interface Wallet {
    explorerEndpoint: string;
    seed: string;
    password?: string,
    counter : number;
    accounts : Account[];
    activeAccountId?: string;
    nodeEndpoint: string;
    emailOracleEndpoint: string;
}


export function CreateFromIdentityAndSeed(firstname : string, lastname: string, seed : string, password: string) : Wallet {

    if ( !seed || typeof seed !== 'string') {
        throw new Error( "Cannot instantiate a wallet from undefined seed" );
    }
    const createdAccount = DefaultAccountWithIdentity(firstname, lastname);
    return {
        seed: seed,
        password: password,
        accounts: [createdAccount],
        counter: 1,
        activeAccountId : createdAccount.id,
        nodeEndpoint : DEFAULT_NODE_ENDPOINT,
        emailOracleEndpoint: DEFAULT_EMAIL_ORACLE_ENDPOINT,
        explorerEndpoint: DEFAULT_EXPLORER_ENDPOINT,
    }

}

export type SignatureKeyPair = {
    privateKey: object;
    publicKey: object;
}

export function getUserKeyPair(wallet : Wallet, account : Account) : Promise<SignatureKeyPair>  {

    return new Promise((resolve, reject) => {

        let seed = sdk.utils.encoding.fromHexa(wallet.seed);
        Carmentis.derivePepperFromSeed(seed, account.nonce).then((pepper: Uint8Array) => {
            return Carmentis.deriveAccountPrivateKey(pepper).then((privateKey : Uint8Array) => {
                return Carmentis.getPublicKey(privateKey).then((publicKey : Uint8Array) => {
                    resolve({
                        privateKey: privateKey,
                        publicKey: publicKey
                    })
                })
            });

        }).catch((error : Error) => {
            reject(error);
        })
    })

}
