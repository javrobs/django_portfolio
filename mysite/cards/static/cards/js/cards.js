function initialize(){
    const cards = [...document.getElementsByClassName("card")];
    cards.forEach(each=>(each.addEventListener("click",
        () => cards.forEach(eachagain => 
            eachagain == each ? 
                eachagain.classList.toggle("show") : 
                eachagain.classList.remove("show")
        )
    )))
}

async function editNote(id){
    const modal = document.getElementById("modal");
    modal.classList.add("active");
    document.querySelector("body").style.overflow = "hidden";
}

function closeModal(e){
    const modal = document.getElementById("modal");
    document.querySelector("body").style.removeProperty("overflow");
    modal.classList.remove("active");
}

async function study(id){
    console.log("study ",id);
}

initialize();