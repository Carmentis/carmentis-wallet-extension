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

import {CryptoSchemeFactory, EncoderFactory, SymmetricEncryptionKey} from "@cmts-dev/carmentis-sdk/client";
import {ProviderInterface} from "@/types/ProviderInterface.ts";
import * as bip39 from "@scure/bip39";
import { wordlist } from '@scure/bip39/wordlists/english.js';

export class CarmentisProvider implements ProviderInterface{
    generateWords(): string[] {
        return bip39.generateMnemonic(wordlist).split(" ");
    }

    async generateSeed(words: string[]): Promise<string> {
        const seed: Uint8Array = bip39.mnemonicToSeedSync(words.join(' '));
        const encoder = EncoderFactory.bytesToHexEncoder();
        return encoder.encode(seed);
    }

    async deriveSecretKeyFromPassword( password : string ) : Promise<SymmetricEncryptionKey> {
        return CryptoSchemeFactory.deriveKeyFromPassword(password);
        //return Carmentis.deriveAesKeyFromPassword(password);
    }
}