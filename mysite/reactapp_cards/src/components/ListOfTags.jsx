import React from "react";


const ListOfTags = ({tags}) => {
    return <div className="flex gap-1 flex-wrap">
        {tags.map((tag,i)=>{
            return <div className={`bg-black text-xs text-lime-300 px-2 ${i==0?"rounded-s-full":""} ${i==tags.length-1?"rounded-e-full":""}`} key={tag}>
                {tag}
            </div>
        })}
    </div>
}

export default ListOfTags
