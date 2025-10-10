
import React from "react";

const Footer = () => {

    return <footer className="mt-auto bg-indigo-900 shadow-lg py-4 h-24">
        <a className="flex text-indigo-200 flex-col items-center gap-2 underline hover:text-secondary transition-all" href="/">
            Javier Robles - 2025 {String.fromCodePoint(0x000A9)}
            <img className="h-8 w-8" src="/static/home/images/roxieicon.svg"/>
        </a>     
    </footer>
}

export default Footer;