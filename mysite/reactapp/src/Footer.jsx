
import React from "react";
import Button from "./Button.jsx";

const Footer = () => {

    return <footer className="flex flex-col relative gap-2 bg-primary py-4 h-24 text-center">
        <img className="h-12 w-12 absolute bottom-6 left-6" src="/static/home/images/roxieicon.svg"/>
        <p>Thanks for stopping by</p>
        
        <div className="flex justify-center gap-2">
            <p>Let's keep in touch:</p>
            <a href="https://www.linkedin.com/in/javier-robles-samar/"  target="_blank"><Button className="h-7 w-7" icon="linkedin"/></a>
            <a href="mailto:javieroblesamar@gmail.com"><Button className="h-7 w-7" icon="envelope"/></a>
            <a href="https://github.com/javrobs" target="_blank"><Button className="h-7 w-7" icon="github"/></a>
        </div>
    </footer>
}

export default Footer;