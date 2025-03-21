import React from "react";
import Page from "./Page.jsx"
import { motion } from "motion/react";
import {fadeUpChild} from "./animations.js";
import H1Title from "./H1Title.jsx";


const AboutMe = ({ref}) => {

    return <Page ref={ref}>
        <div className="grid grid-cols-12">
            <motion.div {...fadeUpChild} className="col-span-12 md:col-start-2 md:col-end-7 px-4 lg:col-end-6 flex justify-center items-center">
                <img className="max-h-[400px] rounded-md shadow-md" src="/static/home/images/meAndRoxie.jpg" id="me-and-roxie"/>
            </motion.div>
            <div className="col-span-12 px-4 md:col-start-7 lg:col-start-6 md:col-end-12 gap-3 m-md-0 flex flex-col self-center">
                <H1Title className='text-start text-5xl'>Hi, I'm Javi,<br/> Welcome to my portfolio.</H1Title>
                <motion.div {...fadeUpChild}>I'm a freelance full stack Python developer and data analyst. I graduated as a mechatronics engineer in 2019, then I worked as a manufacturing design engineer in Monterrey, Mexico. Now, I live in Washington DC with my partner. (That's my dog, Roxie, she's this website's icon.)</motion.div>
                <motion.div {...fadeUpChild}>I've been coding every day since 2022, in both Python and Javascript. I'm always expanding my skills through new projects. My favorite part of building a web application is creating tools that people find useful and intuitive.</motion.div>
                <motion.div {...fadeUpChild}>This page has some of my projects and contact information if you'd like to connect!</motion.div>
            </div>
        </div>
    </Page>
}


export default AboutMe;