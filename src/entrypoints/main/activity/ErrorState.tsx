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

import {Error as ErrorIcon, Refresh} from "@mui/icons-material";
import React from "react";

/**
 * Error state component for the activity page
 */
export function ErrorState({message, onRetry}: { message: string, onRetry: () => void }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ErrorIcon className="text-red-600" sx={{ fontSize: 32 }} />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Something Went Wrong
            </h3>

            <p className="text-sm text-gray-600 mb-6">
                {message}
            </p>

            <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-4 py-2 bg-white border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
                <Refresh fontSize="small" className="mr-2" />
                Try Again
            </button>
        </div>
    );
}