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

import * as v from 'valibot';
import type { EncoderInterface } from '@cmts-dev/carmentis-sdk/client';
import { Wallet, WalletSchema } from '@/types/Wallet.ts';

/**
 * Encoder/Decoder for Extension Wallet objects to/from plain objects.
 *
 * This class implements the EncoderInterface to encode a Wallet object
 * into a plain object representation and decode it back with validation
 * using Valibot schema.
 */
export class ExtensionWalletEncoder implements EncoderInterface<Wallet, object> {
    private static instance: ExtensionWalletEncoder;

    /**
     * Gets the singleton instance of ExtensionWalletEncoder.
     *
     * @return {ExtensionWalletEncoder} The singleton instance.
     */
    static getInstance(): ExtensionWalletEncoder {
        if (!ExtensionWalletEncoder.instance) {
            ExtensionWalletEncoder.instance = new ExtensionWalletEncoder();
        }
        return ExtensionWalletEncoder.instance;
    }

    /**
     * Static method to encode a Wallet object into a plain object representation.
     *
     * @param {Wallet} data - The Wallet object to encode.
     * @return {object} The plain object representation of the wallet.
     */
    static encode(data: Wallet): object {
        return ExtensionWalletEncoder.getInstance().encode(data);
    }

    /**
     * Static method to decode a plain object into a validated Wallet object.
     *
     * @param {object} data - The plain object to decode.
     * @return {Wallet} The validated Wallet object.
     * @throws {v.ValiError} If the data doesn't match the Wallet schema.
     */
    static decode(data: object): Wallet {
        return ExtensionWalletEncoder.getInstance().decode(data);
    }

    /**
     * Encodes a Wallet object into a plain object representation.
     *
     * @param {Wallet} data - The Wallet object to encode.
     * @return {object} The plain object representation of the wallet.
     */
    encode(data: Wallet): object {
        return {
            explorerEndpoint: data.explorerEndpoint,
            seed: data.seed,
            password: data.password,
            counter: data.counter,
            accounts: data.accounts,
            activeAccountId: data.activeAccountId,
            nodeEndpoint: data.nodeEndpoint,
        };
    }

    /**
     * Decodes a plain object into a validated Wallet object.
     *
     * @param {object} data - The plain object to decode.
     * @return {Wallet} The validated Wallet object.
     * @throws {v.ValiError} If the data doesn't match the Wallet schema.
     */
    decode(data: object): Wallet {
        return v.parse(WalletSchema, data);
    }
}

/**
 * Encoder/Decoder for Extension Wallet objects to/from binary (Uint8Array).
 *
 * This class implements the EncoderInterface to encode a Wallet object
 * into a binary representation using JSON serialization and UTF-8 encoding,
 * and decode it back with validation using Valibot schema.
 */
export class ExtensionWalletBinaryEncoder  {
    private static textEncoder: TextEncoder = new TextEncoder();
    private static textDecoder: TextDecoder = new TextDecoder();


    /**
     * Encodes a Wallet object into a binary representation (Uint8Array).
     *
     * @param {Wallet} data - The Wallet object to encode.
     * @return {Uint8Array} The binary representation of the wallet.
     */
    static encode(data: Wallet): Uint8Array {
        const json = JSON.stringify(v.parse(WalletSchema, data));
        return this.textEncoder.encode(json);
    }

    /**
     * Decodes a binary representation (Uint8Array) into a validated Wallet object.
     *
     * @param {Uint8Array} data - The binary data to decode.
     * @return {Wallet} The validated Wallet object.
     * @throws {v.ValiError} If the data doesn't match the Wallet schema.
     * @throws {Error} If the binary data is not valid JSON.
     */
    static decode(data: Uint8Array): Wallet {
        const json = this.textDecoder.decode(data);
        const obj = JSON.parse(json);
        return v.parse(WalletSchema, obj);
    }
}
