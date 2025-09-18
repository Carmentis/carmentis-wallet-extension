import React from 'react';
import {motion} from "framer-motion";
import 'react-loading-skeleton/dist/skeleton.css';
import {Box, Card, CardContent, Typography} from '@mui/material';

//import TokenTransferPage from '@/entrypoints/main/transfer/page.tsx';


/**
 * Stats card component for displaying metrics
 */
export function StatsCard({ title, icon, value, subtitle, color = "blue" }) {
    // Always use blue for consistency with onboarding style
    const iconClass = "bg-blue-50 text-blue-600";

    return (
        <motion.div
            className="h-full"
        >
            <Card className="border border-gray-100 h-full overflow-hidden rounded-xl shadow-sm">
                <CardContent className="p-6">
                    <Box display="flex" alignItems="center" mb={3}>
                        <Box className={`p-2.5 rounded-full mr-3 ${iconClass} border border-blue-100`}>
                            {icon}
                        </Box>
                        <Typography variant="h6" className="font-medium text-gray-700">
                            {title}
                        </Typography>
                    </Box>

                    <Box className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-3">
                        <Typography variant="h4" className="font-bold text-gray-800">
                            {value}
                        </Typography>
                    </Box>

                    <Typography variant="body2" className="text-gray-500">
                        {subtitle}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
}

