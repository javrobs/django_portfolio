const allPages=document.querySelectorAll(".page");
const collapsed=document.querySelectorAll(".collapsible");
const minimenuButton=document.getElementById("minimenu-button");
const icon=minimenuButton.querySelector("i");



function activatePage(pageId){
    console.log(pageId);
    allPages.forEach(one=>{
        console.log(one);
        if (one.id===pageId){
            one.classList.add("active-page");
        } else {
            one.classList.remove("active-page");
        }
    });
}

function expandMiniMenu(){ 
    collapsed.forEach(one=>{
        one.classList.add("expanded");
    });
    minimenuButton.setAttribute("onclick","collapseMiniMenu();");
    icon.className="bi bi-chevron-compact-up";
}

function collapseMiniMenu(){
    collapsed.forEach(one=>{
        one.classList.remove("expanded");
    });
    minimenuButton.setAttribute("onclick","expandMiniMenu();");
    icon.className="bi bi-chevron-compact-down";
}

function activatePageMini(pageId){
    activatePage(pageId);
    collapseMiniMenu();
}

function roxiesWebsite(){
    document.getElementById('me-and-roxie-photo').classList.add('change-to-roxie');
}


let divsToDrop=[['greeting',1.5],['p-1',3],['p-2',3],['p-3',3]];
startLetterDropper(...divsToDrop[0])

function startLetterDropper(itemID,speed){
    let item=document.getElementById(itemID);
    let textToDrop=item.innerHTML;
    item.innerHTML='';
    item.classList.remove('d-none')
    dropALetter(textToDrop,item,arguments[1]);
}

function dropALetter(text,item,speed){
    if(text.length>0){
        let letterToDrop=text.substring(0,1);
        text=text.substring(1);
        item.innerHTML+=letterToDrop;
        switch(letterToDrop){
            case ',':
                setTimeout(dropALetter.bind(this,...arguments),200/speed);
                break;
            case '.':
                setTimeout(dropALetter.bind(this,...arguments),200/speed);
                break;
            case ' ':
                setTimeout(dropALetter.bind(this,...arguments),50/speed);
                break;
            default:
                setTimeout(dropALetter.bind(this,...arguments),30/speed);
        }
    } else {
        divsToDrop.shift()
        if(divsToDrop.length)setTimeout(startLetterDropper.bind(this,...divsToDrop[0]),1000);
    }
}

