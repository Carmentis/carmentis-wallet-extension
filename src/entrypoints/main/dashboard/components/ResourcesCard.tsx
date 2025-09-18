import {ArrowForward} from "@mui/icons-material";
import {motion} from "framer-motion";
import React from "react";
import {Box, Card, CardContent, Chip, Typography} from "@mui/material";


/**
 * Resource card component for external resources
 */
export function ResourceCard({ title, icon, description, onClick, color = "blue" }) {
    // Always use blue for consistency with onboarding style
    const iconClass = "bg-blue-50 text-blue-600";

    return (
        <motion.div
            className="h-full cursor-pointer"
            onClick={onClick}
        >
            <Card className="border border-gray-100 h-full overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200">
                <CardContent className="p-5 flex flex-col items-center text-center">
                    <Box className={`p-3 rounded-full mb-3 ${iconClass} border border-blue-100`}>
                        {icon}
                    </Box>

                    <Typography variant="h6" className="font-semibold text-gray-800 mb-2">
                        {title}
                    </Typography>

                    <Typography variant="body2" className="text-gray-500 mb-3">
                        {description}
                    </Typography>

                    <Chip
                        label="Open External Link"
                        size="small"
                        className="mt-auto bg-blue-50 border border-blue-200 text-blue-600"
                        clickable
                        icon={<ArrowForward fontSize="small" />}
                    />
                </CardContent>
            </Card>
        </motion.div>
    );
}
