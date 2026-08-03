import React from "react"


const MainContainer = ({children, size="lg", ignore, className}) => {
    
    let sizeClass = ""
    switch(size){
        case "lg":
            sizeClass = "max-lg:max-w-full max-w-screen-lg";
            break;
        case "md":
            sizeClass = "max-md:max-w-full max-w-screen-md";
            break;
        case "sm":
            sizeClass = "max-sm:max-w-full max-w-screen-sm";
            break;
        case 'mini':
            sizeClass = "w-full max-w-96";
            break;
    }

    return ignore?<>{children}</>:<main className={`py-4 z-0 flex flex-col gap-4 mx-auto container ${sizeClass} ${className}`}>
        {children}
    </main>
}

export default MainContainer;