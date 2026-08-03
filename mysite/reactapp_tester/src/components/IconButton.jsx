import React from "react";

const IconButton = ({onClick,icon,className,...props}) => {
    return <button 
            className={`flex rounded-full hover:bg-white hover:bg-opacity-50 ${className}`} 
            onClick={onClick}
            {...props}>
                <span className="material-symbols-outlined skiptranslate notranslate">{icon}</span>
        </button>
}

export default IconButton