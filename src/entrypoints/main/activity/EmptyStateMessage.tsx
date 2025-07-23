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
import {Alert, Avatar, Typography} from "@mui/material";
import {Info} from "@mui/icons-material";
import React from "react";

/**
 * Empty state message component for the activity page
 */
export function EmptyStateMessage({message}: { message: string }) {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="flex flex-col items-center justify-center py-16 text-center"
        >
            <Avatar className="mx-auto mb-4 bg-blue-50 text-blue-500 w-20 h-20">
                <Info fontSize="large"/>
            </Avatar>

            <Typography variant="h5" className="font-bold text-gray-800 mb-2">
                No Activity Found
            </Typography>

            <Typography variant="body1" className="text-gray-600 max-w-md">
                {message}
            </Typography>

            <Alert severity="info" className="mt-6 max-w-md">
                Activity will appear here once you interact with applications on the Carmentis network.
            </Alert>
        </motion.div>
    );
}