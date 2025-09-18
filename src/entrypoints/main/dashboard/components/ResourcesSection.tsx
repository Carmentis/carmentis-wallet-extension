import {AddCard, CheckCircle, MenuBook, Search} from "@mui/icons-material";
import {motion} from "framer-motion";
import React from "react";
import {Grid} from "@mui/material";
import {ResourceCard} from "@/entrypoints/main/dashboard/components/ResourcesCard.tsx";

/**
 * Resources section with external links
 */
export function ResourcesSection() {
    const wallet = useWallet();
    const explorerUrl = wallet.explorerEndpoint;
    const open = (link: string) => window.open(link, "_blank");

    const isBeta = typeof explorerUrl === 'string' && explorerUrl.includes("beta");
    const exchangeLink = isBeta ? "https://exchange.beta.carmentis.io" : "https://exchange.alpha.carmentis.io";

    const resources = [
        {
            title: 'Documentation',
            icon: <MenuBook />,
            description: "Read the official Carmentis documentation",
            link: 'https://docs.carmentis.io'
        },
        {
            title: 'Blockchain Explorer',
            icon: <Search />,
            description: "Explore the Carmentis blockchain",
            link: explorerUrl
        },
        {
            title: 'Token Exchange',
            icon: <AddCard />,
            description: "Purchase Carmentis tokens",
            link: exchangeLink
        },
        {
            title: 'Proof Checker',
            icon: <CheckCircle />,
            description: "Verify blockchain proofs",
            link: `${explorerUrl}/proofChecker`
        }
    ];

    return (
        <Grid container spacing={3}>
            {resources.map((resource, index) => (
                <Grid size={4} key={resource.title}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <ResourceCard
                            title={resource.title}
                            icon={resource.icon}
                            description={resource.description}
                            onClick={() => open(resource.link)}
                        />
                    </motion.div>
                </Grid>
            ))}
        </Grid>
    );
}