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

import Avatar from 'boring-avatars';
import {Account} from "@/entrypoints/main/Account.tsx";
import {useEffect, useState} from "react";
import Skeleton from "react-loading-skeleton";
import {getUserKeyPair, Wallet} from "@/entrypoints/main/wallet.tsx";
import {useRecoilValue} from "recoil";
import {walletState} from "@/entrypoints/contexts/authentication.context.tsx";
import {Encoders} from "@/entrypoints/main/Encoders.tsx";

export default function AvatarUser(input: {user: Account, width?: number, height?: number, className?: string}) {
    const [publicKey, setPublicKey] = useState<string|undefined>(undefined);
    const wallet = useRecoilValue(walletState);

    useEffect(() => {
        getUserKeyPair(wallet as Wallet, input.user)
            .then(keyPair => setPublicKey(Encoders.ToHexa(keyPair.publicKey)))
    }, [input.user]);

    if (!publicKey) return <Skeleton width={input.width} height={input.height} className={input.className} circle={true}/>
    return <Avatar
        name={publicKey}
        variant={"beam"}
        width={input.width}
        height={input.height}
        className={input.className}
    />
}