import React from "react";

const ListOfCols = ({title,children}) => {
    return <div className="flex flex-col bg-black p-2 gap-2 rounded-md shadow-md">
        {title&&<p className="text-lg">{title}</p>}
        {children}
    </div>
}

export default ListOfCols;