
export const fadeUpChild = {  
    variants:{
        visible: {opacity:1, y:0},
        hidden: {opacity:0, y:-20},
    },
    transition:{type:"tween", duration:".5"}
}

export const fadeUpContainer = {
    variants:{
        visible: {
            transition: { delayChildren:.6, staggerChildren: .3}
        }
    },
    viewport:{ once: true, margin:"100px 0px 100px 0px" },
    initial:"hidden",
    whileInView:"visible",
}
