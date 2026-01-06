import {Box, Typography} from '@mui/material';
import {motion} from "framer-motion";
import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    return (
        <motion.div variants={itemVariants} className="mb-8">
            <Box>
                <Typography variant="h5" className="font-semibold text-gray-900 mb-1">
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" className="text-gray-500">
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </motion.div>
    );
}
