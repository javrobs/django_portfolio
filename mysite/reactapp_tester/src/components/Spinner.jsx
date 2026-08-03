import React from "react";
import { motion } from "motion/react";
import Icon from "./Icon.jsx";

const Spinner = () => {
    return <motion.div className="inline-flex justify-center items-center h-8 w-8" animate={{rotate:[0,360],fontVariationSettings:["'wght' 400","'wght' 700","'wght' 400"]}} transition={{duration:1,ease:"linear",repeat:Infinity}}>
        <Icon icon="data_usage"/>
    </motion.div>
}   


export default Spinner;