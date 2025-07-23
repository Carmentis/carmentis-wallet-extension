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

import {useRecoilValue} from "recoil";
import {useAuthenticatedAccount} from "@/hooks/useAuthenticatedAccount.tsx";
import React, {useState} from "react";
import {motion} from "framer-motion";
import {Avatar, Box, Chip, IconButton, Paper, Tooltip, Typography} from "@mui/material";
import {ArrowForward, CheckCircle, ContentCopy, Key} from "@mui/icons-material";
import {tokenTransferState} from "@/states/states.tsx";

export function TransferGraphic() {
    const tokenTransfer = useRecoilValue(tokenTransferState);
    const activeAccount = useAuthenticatedAccount();
    const [copied, setCopied] = useState(false);

    const handleCopyPublicKey = () => {
        if (tokenTransfer.publicKey) {
            navigator.clipboard.writeText(tokenTransfer.publicKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Animation variants
    const cardVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                delay: 0.1
            }
        }
    };

    const arrowVariants = {
        hidden: {opacity: 0, scale: 0.8},
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delay: 0.2,
                duration: 0.3
            }
        }
    };

    function cropPublicKey(publicKey: string) {
        if (publicKey.length < 10) return publicKey
        return publicKey.slice(0, 5) + '...' + publicKey.slice(publicKey.length - 4, publicKey.length);
    }

    return (
        <motion.div variants={cardVariants}>
            <Paper elevation={0} className="border border-gray-100 rounded-lg p-6">
                <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                    Transfer Preview
                </Typography>

                <Box className="flex flex-col items-center space-y-6">
                    {/* Sender */}
                    <Box className="w-full flex flex-col items-center">
                        <Avatar
                            className="bg-green-100 text-green-600 w-16 h-16 mb-2 text-2xl font-bold"
                            sx={{width: 64, height: 64}}
                        >
                            {activeAccount?.pseudo?.charAt(0) || ''}
                        </Avatar>
                        <Typography variant="body1" className="font-medium text-gray-800">
                            {activeAccount?.pseudo}
                        </Typography>
                        <Typography variant="body2" className="text-gray-500">
                            Sender
                        </Typography>
                    </Box>

                    {/* Arrow */}
                    <motion.div
                        variants={arrowVariants}
                        className="flex items-center justify-center w-full"
                    >
                        <Box className="flex flex-col items-center">
                            <ArrowForward className="text-blue-500 text-4xl mb-1"/>
                            {tokenTransfer.tokenAmount > 0 && (
                                <Chip
                                    label={`${tokenTransfer.tokenAmount} CMTS`}
                                    className="bg-blue-100 text-blue-700"
                                />
                            )}
                        </Box>
                    </motion.div>

                    {/* Recipient */}
                    <Box className="w-full flex flex-col items-center">
                        <Avatar
                            className="bg-blue-100 text-blue-600 w-16 h-16 mb-2"
                            sx={{width: 64, height: 64}}
                        >
                            <Key/>
                        </Avatar>

                        {tokenTransfer.publicKey ? (
                            <Box className="flex flex-col items-center">
                                <Box className="flex items-center mb-1">
                                    <Typography variant="body1" className="font-medium text-gray-800 mr-1">
                                        {cropPublicKey(tokenTransfer.publicKey)}
                                    </Typography>
                                    <Tooltip title={copied ? "Copied!" : "Copy public key"}>
                                        <IconButton
                                            size="small"
                                            onClick={handleCopyPublicKey}
                                            className="text-gray-500"
                                        >
                                            {copied ? <CheckCircle fontSize="small" className="text-green-500"/> :
                                                <ContentCopy fontSize="small"/>}
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Typography variant="body2" className="text-gray-500">
                                    Recipient
                                </Typography>
                            </Box>
                        ) : (
                            <Typography variant="body1" className="text-gray-400 font-medium">
                                Enter recipient public key
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Paper>
        </motion.div>
    );
}