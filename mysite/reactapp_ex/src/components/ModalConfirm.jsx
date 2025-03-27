import React from "react";

const ModalConfirm = ({show,children,noPadding, clickOutside}) => {
    return show && <div className="absolute top-0 left-0 flex justify-center items-center w-full h-dvh">
        <div className={`${noPadding?"":"py-5 px-8"} z-20 max-sm:max-w-full max-w-screen-sm rounded-md shadow-md gap-3 bg-zinc-800 flex flex-col`}>
            {children}
        </div>
        <div onClick={clickOutside||(()=>{})} className="absolute top-0 left-0 w-full h-dvh z-10 bg-black bg-opacity-80"/>
    </div>
}


export default ModalConfirm