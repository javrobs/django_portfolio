import React from "react"

export default function Icon({icon,className}){
    return <span className={["material-symbols-outlined skiptranslate notranslate",className].join(" ")}>{icon}</span>
}