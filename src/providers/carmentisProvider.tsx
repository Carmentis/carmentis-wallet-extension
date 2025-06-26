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

import {ProviderInterface} from "@/providers/providerInterface.tsx";
import {AES256GCMSymmetricEncryptionKey, CryptoSchemeFactory, EncoderFactory} from "@cmts-dev/carmentis-sdk/client";
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js";
import { SecretEncryptionKey } from '@/utils/secret-encryption-key.ts';
import {randomBytes} from "node:crypto";

export class CarmentisProvider implements ProviderInterface{
    generateWords(): string[] {
        return Carmentis.generateWordList(12);
    }

    async generateSeed(words: string[]): Promise<string> {
        const seed: Uint8Array = await Carmentis.getSeedFromWordList(words);
        const encoder = EncoderFactory.bytesToHexEncoder();
        return encoder.encode(seed);
    }

    encryptSeed(password: string, seed : Uint8Array) : Uint8Array {
        // TODO security fix
        const secretKey = Carmentis.deriveAesKeyFromPassword(password);
        return secretKey.encrypt(seed);
    }

    decryptSeed(password: string, seed : Uint8Array) : Uint8Array {
        // TODO security fix
        const secretKey = Carmentis.deriveAesKeyFromPassword(password);
        return secretKey.decrypt(seed);
    }

    async deriveSecretKeyFromPassword( password : string ) : Promise<SecretEncryptionKey> {
        return Carmentis.deriveAesKeyFromPassword(password);
    }
}