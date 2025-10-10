import React from "react"

import H1Title from "./H1Title.jsx";
    
const BubbleDiv = ({children,title,className,centerTitle}) => {
    return <div className={`bg-stone-200 bg-opacity-85 p-4 rounded-lg shadow-md flex flex-col gap-2 ${className}`}>
        {title&&<H1Title className={`${centerTitle?"":"!text-start"}`}>{title}</H1Title>}
        {children}
    </div>
}

export default BubbleDiv;