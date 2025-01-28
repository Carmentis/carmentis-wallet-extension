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

import React from "react";
import {Optional} from "@/entrypoints/main/optional.ts";

export function AuthenticationRequest(input: {
    email: string | undefined;
    onAccept: () => void,
    onReject: () => void
}) {
    return <div className="min-h-full">
        <div className="w-100 p-4">
            <h2 className="w-100 flex-none mb-3">
                Authentication Request
            </h2>
            <div className="h-1/4 mb-3">
                {!input.email &&
                    <p>
                        Do you agree to authenticate?
                    </p>
                }
                {input.email &&
                    <p>
                        Do you agree to authenticate as {input.email}?
                    </p>
                }

            </div>
            <div className="flex flex-row justify-evenly">
                <button className="w-1/2 p-3 mr-1 btn-primary btn-highlight"
                        onClick={() => input.onAccept()}>
                    Continue
                </button>
                <button className="w-1/2 p-3 ml-1 btn-primary"
                        onClick={() => input.onReject()}>
                    Reject
                </button>
            </div>

        </div>
    </div>
}