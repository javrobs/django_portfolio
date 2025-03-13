const allPages = () => {
    const pages = document.querySelectorAll(".page");
    const activePages = [];
    return{
        activatePage(pageId){
            window.scroll(0,0);
            pages.forEach(one => {
                if (one.id === pageId){
                    one.classList.add("active-page");
                    if(!activePages.includes(one)){
                    this.initTagContainers(one);
                    activePages.push(one);
                    }
                } else {
                    one.classList.remove("active-page");
                }
            });
        },
        activatePageMini(pageId){
            this.activatePage(pageId);
            minimenu.collapseMiniMenu();
        },
        initTagContainers(page){
            console.log('animation added')
            const tagContainers = [...page.getElementsByClassName("tag-container")].map(each=>each.children);
            let i=0;
            function goThroughTagContainers(){
                if (i<tagContainers.length){
                    const tagContainer = tagContainers[i];
                    let j=0;
                    function goThroughList(){
                        if(j<tagContainer.length){
                            tagContainer[j].classList.add("showup");
                            j++;
                        } else {
                            clearInterval(interval2);
                        }
                    }
                    const interval2 = setInterval(goThroughList,150)
                    i++
                } else {
                    clearInterval(interval)
                }
            }
            const interval = setInterval(goThroughTagContainers,300);
        },

    }
};

const minimenu = () => {
    const collapsed = document.querySelectorAll(".collapsible");
    const minimenuButton = document.getElementById("minimenu-button");
    const icon = document.getElementById("mini-menu-icon");
    return {
        expandMiniMenu(){ 
            collapsed.forEach(({classList})=>classList.add("expanded"));
            minimenuButton.onclick = minimenu.collapseMiniMenu;
            icon.className="bi bi-chevron-compact-up";
            console.log("expand",this,minimenuButton.onclick);
        },
        collapseMiniMenu(){
            collapsed.forEach(one=>one.classList.remove("expanded"));
            minimenuButton.onclick = minimenu.expandMiniMenu;
            icon.className="bi bi-chevron-compact-down";
            console.log("collapse",this,minimenuButton.onclick);
        }
    }
}

minimenu().collapseMiniMenu();


const divsToDrop = [['greeting',1.5],['p-1',3],['p-2',3],['p-3',3]];
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
        if(divsToDrop.length) setTimeout(startLetterDropper.bind(this,...divsToDrop[0]),1000);
    }
}
