import React from "react";
import H1big from "./H1big.jsx";


const BubbleDiv = ({children,title,maxititle,centerTitle,className,titleButtons}) => {
    return <div className={`bg-white bg-opacity-50 max-sm:p-3 z-0 sm:rounded-xl max-w-screen-sm mt-3 w-full mx-auto grow p-4 items-stretch justify-center shadow-md flex flex-col gap-2 ${className}`}>
        {Boolean(maxititle)&&<H1big className={`text-6xl font-semibold ${centerTitle?"self-center":""}`}>{maxititle}</H1big>}
        {Boolean(title)&&(centerTitle?
        <H1big className="self-center">{title}</H1big>:
        <div className="flex justify-between gap-1 flex-wrap items-center">
            <H1big>{title}</H1big>
            <div>{titleButtons}</div>
        </div>)
        }
        {children}
    </div>
}

export default BubbleDiv;