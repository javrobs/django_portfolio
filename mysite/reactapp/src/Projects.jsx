import React, {useState} from "react";
import Page from "./Page.jsx";
import { fadeUpChild, fadeUpContainer} from "./animations.js";
import { motion } from "motion/react";
import Tile from "./Tile.jsx";
import H1Title from "./H1Title.jsx";
import Button from "./Button.jsx";

const Projects = ({ref}) => {

    const projectData = [
        {title: "Lavandería Coco", linkToProject: "https://www.lavanderiacoco.com", logo: "lavacoco.svg",
        projectDescription: "Web App for a local laundry service where admin and customers can keep track of orders and handle notifications with WhatsApp API.",
        projectPhoto:["lavacoco.png","lavacoco1.png","lavacoco2.png","lavacoco3.png","lavacoco4.png"], tags: [
            'Full-Stack Web App', 'React', 'React Router',
            'Django API, Login and ORM', 'Webpack', 'SQLite',
            'Tailwind CSS', 'Google Font Icons','Plotly Graphs',"JSON Web Tokens"]},
        {title:"Etiqueta Sana", linkToProject:"https://www.etiquetasana.com", logo:"etiquetasana.svg",
        projectDescription:"Full-stack web application and content management system for a nutritionist, enabling collaboration on custom meal plans, client-specific recipes, a live food database, progress tracking, and blog management.",
        projectPhoto:["etiquetasana.png","etiquetasana1.png","etiquetasana2.png","etiquetasana3.png","etiquetasana4.png","etiquetasana5.png"], tags: [
            "Full-Stack Web App", "Flask","SQLAlchemy","Flask-Login",
            "AWS S3","Email","Pillow","Pure JavaScript","Plotly","Bootstrap"]},
        {title:"NYC ESL speakers",linkToProject:"/nyc_lep_speakers", logo:"nycspeakers.png",
        projectDescription:"Sunburst and map visualization of limited english proficiency (LEP) residents of New York City. The sunburst and map are dynamic and offer information on LEP demographics for each community district.",
        projectPhoto:["nyc.png","nyc2.png"], tags: ["Data Visualization", "SQLite",
            "Pandas ETL", "Django ORM", "API fetch", "Plotly Graphs","Leaflet Choropleth", "Bootstrap"]},
        {title:"Austin Housing",linkToProject:"https://javrobs.github.io/house_pricing_analysis/", logo:"austinhouses.png",
        projectDescription:"Map visualization of house sale prices in Austin from 2018 to 2021 with filtering capabilities, fed into a linear regression and neural network models for price estimation.",
        projectPhoto:["austin.png","austin2.png"], tags: ["Data Visualization",
            "Flask API","Leaflet Map","TensorFlow","Neural Network",
            "Linear Regression","Scikit-learn","Pandas ETL","Bootstrap"]},
    ].map(({linkToProject,logo,title,projectDescription,projectPhoto,tags},i)=>{
        const [image,setImage] = useState(0);

        const transitionInfo = {
            initial:"hidden",
            whileInView:"visible",
            variants:{
                hidden:{opacity:0,translateX:(i%2?"50%":"-50%")},
                visible:{opacity:1,translateX:0}
            },
            viewport:{once:true, margin:"100px 0px 100px 0px"},
            transition:{type:"tween", duration:"2"}
        }

        const decreaseImage = () => {
            setImage(oldValue=>oldValue==0?projectPhoto.length - 1:oldValue - 1)
        }
        
        const increaseImage = () => {
            setImage(oldValue=>oldValue==projectPhoto.length - 1?0:oldValue + 1)
        }

        return <motion.div {...transitionInfo} key={title} className="col-span-12 sm:p-4 md:col-span-6 flex flex-col gap-1">
            <div className="flex items-center gap-2 min-h-12 column-gap-2">
                <img className="h-10" src={"/static/home/images/logos/" + logo}/>
                <h2 className="text-3xl">{title}</h2>
                <Button className="h-8 w-8 ms-auto" onClick={decreaseImage} icon="arrow-left"/>
                <Button className="h-8 w-8" onClick={increaseImage} icon="arrow-right"/>
                <a href={linkToProject} target="_blank"><Button className="h-8 w-8" icon="link"/></a>
            </div>
            <div className="relative group rounded-lg shadow-md overflow-hidden">
                <motion.div animate={{translateX:`${-100*image}%`}} transition={{type:"tween", duration:".5"}} className="flex">
                    {projectPhoto.map(each=><img key={each} src={"/static/home/images/" + each}/>)}
                </motion.div>
            </div>
            <motion.div {...fadeUpContainer}>
            <ul className="flex gap-1 group rounded-xl overflow-hidden flex-wrap">
                {tags.map(each=><Tile key={each}>{each}</Tile>)}
            </ul>
            <motion.p {...fadeUpChild} className="p-2">{projectDescription}</motion.p>
            </motion.div>
        </motion.div>
    })



    return <Page ref={ref} id="projects">
                <H1Title>Projects</H1Title>
                <div className="grid grid-cols-12 items-stretch gap-2 p-5">
                    {projectData}
                </div>
            </Page>
}


export default Projects;