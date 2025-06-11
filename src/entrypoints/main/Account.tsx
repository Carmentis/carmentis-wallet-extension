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

import {randomHex} from "@/entrypoints/main/Random.tsx";
import {deprecate} from "node:util";

const DEFAULT_ACCOUNT_NAME = "Account"
const DEFAULT_NONCE = 0;


/**
 * Structure representing the application.
 */
export interface Application {
    accountId: string,
    applicationName: string,
    rootDomain: string,
    applicationId: string,
    //microBlocksByFlowId: { [key: string]: MicroBlock[] };
}

export interface Flow {
    flowId : string,
    accountId: string,
    applicationId: string,
}

export interface ApplicationVirtualBlockchain {
    virtualBlockchainId : string,
}

/**
 * Represent a block in a micro-chain.
 *
 */
export interface MicroBlock {
    applicationId: string,
    flowId: string,
    accountId: string,
    microBlockId: string,
    nonce: number,
    ts: number,
    gas: number,
    gasPrice: number,
    data: object | undefined,
    version: number

    /**
     * The master block defines the master block containing the micro block.
     *
     * When the master block is missing, it means that either the master block containing this micro block is
     * not anchored yet, or is anchored by the synchronisation has not been done.
     */
    masterBlock: number | undefined,

    /**
     * This field is set at true when the user is the initiator of this block.
     */
    isInitiator: boolean,
}


export interface Account {
    id : string;
    nonce : number;
    pseudo: string;
    accountVirtualBlockchainId?:  string;
}


/**
 * Creates an account from a given pseudo.
 *
 * The created account contains the strictly minimal information to create a valid account.
 *
 * @param pseudo The pseudo identifying the account
 * @param nonce The nonce associated with the account
 *
 * @constructor
 */
export function CreateFromPseudoAndNonce(pseudo: string, nonce : number) : Account {
    return {
        id: generateAccountId(),
        nonce,
        pseudo
    }
}


export function  DefaultAccountWithIdentity(pseudo: string) : Account {
    return {
        id: generateAccountId(),
        pseudo,
        nonce: DEFAULT_NONCE,
    }
}



function generateAccountId() : string {
    return randomHex(32)
}
