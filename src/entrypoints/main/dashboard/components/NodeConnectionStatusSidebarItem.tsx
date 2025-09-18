import React, {useEffect, useState} from 'react';
import {motion} from "framer-motion";
import 'react-loading-skeleton/dist/skeleton.css';
import {Badge, Tooltip, Typography} from '@mui/material';
import {SpinningWheel} from '@/components/shared/SpinningWheel.tsx';
import axios from 'axios';
import {useRecoilValue} from 'recoil';
import {NetworkCheck} from "@mui/icons-material";
import {nodeEndpointState} from "@/states/globals.tsx";


/**
 * Node connection status indicator for the sidebar
 */
export function NodeConnectionStatusSidebarItem() {
    const [loaded, setLoaded] = useState(true);
    const [success, setSuccess] = useState(false);
    const node = useRecoilValue(nodeEndpointState);

    async function sendPing() {
        if (!node) return
        setLoaded(true);
        console.log(`Contacting ${node}`)
        axios.get(node)
            .then(() => setSuccess(true))
            .catch((error) => {
                console.log(error)
                setSuccess(false)
            })
            .finally(() => setLoaded(false))
    }

    useEffect(() => {
        sendPing()
    }, [node]);

    if (loaded) return (
        <Tooltip title={`Connecting to ${node}...`} placement="right">
            <div className="flex items-center px-4 py-3 mx-2 rounded-lg">
                <div className="w-5 mr-3">
                    <SpinningWheel />
                </div>
                <Typography variant="body2" className="text-gray-600 font-medium">
                    Connecting...
                </Typography>
            </div>
        </Tooltip>
    );

    const tooltipMessage = success ?
        `Connected to node ${node}` :
        `Connection failure at ${node}`;

    const statusColor = success ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";
    const statusText = success ? "Connected" : "Connection Error";
    const statusBorder = success ? "border-green-100" : "border-red-100";

    return (
        <Tooltip title={tooltipMessage} placement="right">
            <motion.div
                className={`flex items-center px-4 py-3 mx-2 rounded-lg cursor-pointer border ${statusBorder} ${statusColor}`}
                onClick={sendPing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Badge
                    color={success ? "success" : "error"}
                    variant="dot"
                    invisible={false}
                    className="mr-3"
                >
                    <NetworkCheck className="text-lg" />
                </Badge>
                <Typography variant="body2" className="font-medium">
                    {statusText}
                </Typography>
            </motion.div>
        </Tooltip>
    );
}
