import React from "react";
import Page from "./Page.jsx";
import { fadeUpChild, fadeUpContainer } from "./animations.js";
import { motion } from "motion/react";
import IconBootstrap from "./IconBootstrap.jsx";
import Tile from "./Tile.jsx"
import Button from "./Button.jsx";
import H1Title from "./H1Title.jsx"

const Resume = ({ref}) => {

    

    const apps = [["Python","Django","Flask","Pandas","JSON Web Tokens","Jupyter Notebooks","Matplotlib","Pillow","Boto3","SQLAlchemy","Pymongo","TensorFlow","Scikit-learn"],
    ["Javascript","React","React Router","Motion","Vite","Webpack","APIs","Plotly","Leaflet"],
    ["Databases","SQL","Mongo","Google Firebase"],
    ["CSS","Bootstrap","Tailwind CSS","Bootstrap Icons","Google Icons","Flexbox","Grid","Animation"],
    ["AWS","Storage (S3)","Email service (SES)","Cloudfront"],
    ["Data analysis","Tableau","Power BI","Excel"]].map(list=>{

        const items = list.map((each,i)=>{
            return <Tile key={each}>
                {each}
            </Tile>
        })

        return <motion.ul key={list[0]} {...fadeUpContainer}className="flex flex-col grow gap-1 group rounded-xl overflow-hidden flex-wrap">
            {items}
        </motion.ul>
    })

    return <Page ref={ref}>
        
        <H1Title>I have experience with...</H1Title>
        <motion.div  className="col-span-12 gap-1 flex flex-wrap sm:col-span-10 lg:col-span-8 sm:col-start-2 lg:col-start-3 justify-center px-3">
            {apps}
        </motion.div>
        <motion.div {...fadeUpChild} className="col-span-12 flex text-lg items-center justify-center gap-2 my-2">
            Download my resume:
            {["docx","pdf"].map(each=><a href={`/static/home/documents/Resume.${each}`} key={each} target="_blank"><Button className="h-8 w-8 text-xl"><IconBootstrap icon={`filetype-${each}`}/></Button></a>)}
        </motion.div>
    </Page>
}


export default Resume;