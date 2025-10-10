import React from "react";

const Icon = ({icon,className,...props}) => <span className={`material-symbols-outlined ${className}`}>{icon}</span> 

export default Icon;