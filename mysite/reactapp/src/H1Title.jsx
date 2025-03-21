import React from "react";
import { motion } from "motion/react";
import { fadeUpChild } from "./animations";

const H1Title = ({children, className}) => {
    return <motion.h1  {...fadeUpChild} className={`text-center px-2 text-secondary text-4xl font-raleway font-semibold ${className}`}>
        {children}
    </motion.h1>
}

export default H1Title;