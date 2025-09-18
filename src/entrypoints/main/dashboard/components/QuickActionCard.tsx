import React from 'react';

import {useNavigate} from 'react-router';
import {motion} from "framer-motion";
import 'react-loading-skeleton/dist/skeleton.css';
import {Box, Button, Card, CardContent, Typography} from '@mui/material';
import {ArrowForward} from "@mui/icons-material";

/**
 * Quick action card component for navigation
 */
export function QuickActionCard({ title, icon, description, link, color = "blue" }) {
    const navigate = useNavigate();

    // Always use blue for consistency with onboarding style
    const iconClass = "bg-blue-50 text-blue-600";

    return (
        <motion.div
            onClick={() => navigate(link)}
            className="cursor-pointer h-full"
        >
            <Card className="border border-gray-100 h-full overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200">
                <CardContent className="p-6">
                    <Box className={`p-3 rounded-full w-fit mb-4 ${iconClass} border border-blue-100`}>
                        {icon}
                    </Box>

                    <Typography variant="h6" className="font-semibold text-gray-800 mb-2">
                        {title}
                    </Typography>

                    <Typography variant="body2" className="text-gray-500 mb-4">
                        {description}
                    </Typography>

                    <Button
                        variant="outlined"
                        size="small"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 normal-case"
                        endIcon={<ArrowForward fontSize="small" />}
                    >
                        Get Started
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}
