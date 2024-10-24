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

import {Optional} from "@/src/Optional.tsx";
import {randomHex} from "@/src/Random.tsx";
const DEFAULT_ACCOUNT_NAME = "Account"
const DEFAULT_NONCE = 0;

/**
 * Represents the data structure consisting of the email validation proof.
 */
export interface EmailValidationProofData {
    ts: number,
    email: string,
    publicKey: string,
    signature: string,
}

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

/**
 * The AccountData interface is used to include a
 */
export interface AccountData {
    id : string,
    nonce : number,
    pseudo: string;
    email: string | undefined;
    emailValidationProof: EmailValidationProofData | undefined
}



export class Account {

    data : AccountData

    constructor(data : AccountData) {
        this.data = data;
    }

    getPseudo() : string {
        return this.data.pseudo;
    }

    getEmail() : Optional<string> {
        if (this.data.email == undefined) {
            return Optional.Empty();
        }
        return Optional.From(this.data.email);
    }

    hasVerifiedEmail(): boolean {
        return this.data.emailValidationProof !== undefined;
    }


    /**
     * This function creates a default account.
     *
     * @constructor
     *
     * @return Account The created account.
     */
    static Default() : Account {
        return new Account({
            id: this.GenerateAccountId(),
            pseudo: DEFAULT_ACCOUNT_NAME,
            email: undefined,
            emailValidationProof: undefined,
            nonce: DEFAULT_NONCE,
        })
    }

    static CreateFromDict(account : AccountData) : Account {
        return new Account(account);
    }

    /**
     * Returns the email verification proof.
     *
     * @throws Error If the email is not verified.
     */
    getEmailValidationProofData() : EmailValidationProofData {
        if ( this.data.emailValidationProof === undefined ) {
            throw new Error( "The active account do not have verified its email" );
        }
        return this.data.emailValidationProof
    }

    /**
     * Returns the identifier of the account.
     */
    getId() : string {
        return this.data.id;
    }


    /**
     * Creates an account from a given pseudo.
     *
     * The created account contains the strictly minimal information to create a valid account.
     *
     * @param accountPseudo The pseudo of the created account.
     * @param nonce The nonce associated with the account
     *
     * @constructor
     */
    static CreateFromPseudoAndNonce(accountPseudo: string, nonce : number) : Account {
        return new Account({
            email: undefined,
            emailValidationProof: undefined,
            id: this.GenerateAccountId(),
            nonce: nonce,
            pseudo: accountPseudo,
        });
    }

    /**
     * Returns a freshly generated identifier.
     *
     * @return string The generated identifier.
     */
    private static GenerateAccountId() : string {
        return randomHex(32)
    }

    /**
     * Returns the nonce associated with the account.
     */
    getNonce() {
        return this.data.nonce
    }


}