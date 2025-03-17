import React from "react";
import { fadeUpContainer } from "./animations";
import { motion } from "motion/react"

const Page = ({children,id,ref,className}) => {
    return <motion.div 
        ref={ref}
        {...fadeUpContainer}
        id={id} 
        className={`flex flex-col gap-4 py-3 items-center justify-center min-w-full w-full shrink-0 min-h-[calc(100dvh-5rem)] ${className}`}
        >
            {children}
    </motion.div>
}

export default Page;