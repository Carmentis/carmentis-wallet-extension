import React from 'react';
import {motion} from "framer-motion";
import 'react-loading-skeleton/dist/skeleton.css';
import {Box, Card, CardContent, Typography} from '@mui/material';

//import TokenTransferPage from '@/entrypoints/main/transfer/page.tsx';


/**
 * Stats card component for displaying metrics
 */
export function StatsCard({ title, icon, value, subtitle, color = "blue" }) {
    return (
        <motion.div className="h-full">
            <Card elevation={0} className="border border-gray-200 h-full rounded-lg">
                <CardContent className="p-5">
                    <Typography variant="body2" className="text-gray-500 mb-3">
                        {title}
                    </Typography>

                    <Typography variant="h4" className="font-semibold text-gray-900 mb-1">
                        {value}
                    </Typography>

                    <Typography variant="caption" className="text-gray-400">
                        {subtitle}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
}

