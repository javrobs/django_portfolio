
import React from "react";
import Button from "./Button.jsx";

const Footer = () => {

    return <footer className="mt-auto bg-primaryTransparent backdrop-contrast-200 py-4 h-24">
        <a className="flex flex-col items-center gap-2 underline hover:text-secondary transition-all" href="/">
            Javier Robles - 2025 {String.fromCodePoint(0x000A9)}
            <img className="h-8 w-8" src="/static/home/images/roxieicon.svg"/>
        </a>     
    </footer>
}

export default Footer;