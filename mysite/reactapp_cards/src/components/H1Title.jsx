import React from "react";
import { motion } from "motion/react";
import { fadeUpChild } from "./animations";

const H1Title = ({children, className}) => {
    return <motion.h1  {...fadeUpChild} className={`text-center font-racing px-2 text-blue-700 text-4xl font-semibold ${className}`}>
        {children}
    </motion.h1>
}

export default H1Title;