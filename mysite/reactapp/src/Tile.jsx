import React from "react";
import { motion } from "motion/react";
import { fadeUpChild } from "./animations";

const Tile = ({children}) => {
    return <motion.li  
            {...fadeUpChild}  
            className="px-3 text-shadow-none first:bg-primary first:text-primaryLight first:grow-0 bg-primaryLight text-primary text-center grow shadow-md">
        {children}
    </motion.li>
}


export default Tile;