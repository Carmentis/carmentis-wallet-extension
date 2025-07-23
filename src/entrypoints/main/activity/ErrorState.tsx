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
import {Avatar, Button, Paper, Typography} from "@mui/material";
import {Error as ErrorIcon, Refresh} from "@mui/icons-material";
import React from "react";

/**
 * Error state component for the activity page
 */
export function ErrorState({message, onRetry}: { message: string, onRetry: () => void }) {
    return (
        <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            className="flex flex-col items-center justify-center py-12"
        >
            <Paper elevation={0} className="border border-red-100 rounded-lg p-8 max-w-md mx-auto text-center">
                <Avatar className="mx-auto mb-4 bg-red-50 text-red-500 w-20 h-20">
                    <ErrorIcon fontSize="large"/>
                </Avatar>

                <Typography variant="h5" className="font-bold text-gray-800 mb-2">
                    Something Went Wrong
                </Typography>

                <Typography variant="body1" className="text-gray-600 mb-6">
                    {message}
                </Typography>

                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Refresh/>}
                    onClick={onRetry}
                >
                    Try Again
                </Button>
            </Paper>
        </motion.div>
    );
}