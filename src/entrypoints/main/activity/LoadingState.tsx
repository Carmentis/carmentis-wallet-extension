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

import {motion} from "framer-motion";
import {CircularProgress, Typography} from "@mui/material";
import React from "react";

/**
 * Loading state component for the activity page
 */
export function LoadingState() {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="flex flex-col items-center justify-center py-16"
        >
            <CircularProgress size={60} thickness={4} className="mb-4"/>
            <Typography variant="h6" className="font-medium text-gray-800 mb-2">
                Loading Blockchain Data
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Please wait while we fetch your blockchain activity...
            </Typography>
        </motion.div>
    );
}