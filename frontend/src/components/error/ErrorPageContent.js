import { motion } from 'framer-motion';
import Typography from "@mui/material/Typography";
import React from "react";

const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
};

function ErrorPageContent({ title, message }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeInUpVariants}
            style={{ textAlign: "center", marginTop: "100px" }}
        >
            <Typography
                component="h2"
                variant="h2"
                align="center"
                color="text.primary"
                noWrap
            >
                {title}
            </Typography>

            <Typography
                component="h4"
                variant="h4"
                align="center"
                color="text.secondary"
                paragraph
                sx={{ mt: 2 }}
            >
                {message}
            </Typography>
        </motion.div>
    );
}

export default ErrorPageContent;
