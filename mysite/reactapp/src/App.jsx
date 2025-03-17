import React, { useRef } from "react"
import Header from "./Header.jsx"
import AboutMe from "./AboutMe.jsx"
import Projects from "./Projects.jsx"
import Footer from "./Footer.jsx"
import Resume from "./Resume.jsx"

export default function App() {
    const aboutRef = useRef(null);
    const projectsRef = useRef(null);
    const resumeRef = useRef(null);

    return <>
    <Header refs={{about:aboutRef,projects:projectsRef,resume:resumeRef}}/>
    <main className="max-h-[calc(100dvh-6rem)] mx-auto overflow-y-auto">
        <AboutMe ref={aboutRef}/>
        <Projects ref={projectsRef}/>
        <Resume ref={resumeRef}/>
        <Footer/>
    </main>
    </>
}
