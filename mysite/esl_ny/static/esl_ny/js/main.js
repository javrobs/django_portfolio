const sunburstInput=document.getElementById('sunburst-input');
const mapInput=document.getElementById('map-input');
const mapContainer=document.getElementById('map-container');
const sunburstContainer=document.getElementById('sunburst-container');
const selectLanguage=document.getElementById('select-language');
const panel=document.getElementById('sample-metadata');


initialize();
function initialize(){
    languageChanged();
}

function fetchJsonThen(urlString,thenDoThis){
    const url=(selectLanguage.value)?`/${urlString}/${selectLanguage.value}`:`/${urlString}_all`;
    fetch(url).then(data=>data.json()).then(data=>{
        console.log(data);thenDoThis(data)});
}

function languageChanged(){
    fetchJsonThen('demographic',horizontalBar);
    fetchJsonThen('demographic',demoBox);
    fetchJsonThen('communities',updateMap);
    fetchJsonThen('populations',updateSunburst);
}

function optionChanged() {
    if (mapInput.checked){
        mapContainer.classList.add('forward');
        sunburstContainer.classList.remove('forward');
    } else if (sunburstInput.checked){
        mapContainer.classList.remove('forward');
        sunburstContainer.classList.add('forward');
    }
}

function demoBox(data) {
    panel.innerHTML=`<h5 class='demo_header'>Language:</h5>
                    <h5 class='demo_info'>${data.language}</h5>
                    <h5 class='demo_header'>LEP Speakers:</h5>
                    <h5 class='demo_info'>${data.totalLEPpopulation.toLocaleString("en-US")}</h5>`;
    if(Object.keys(data).includes("lepPercentage")){
        panel.innerHTML+=`<h5 class='demo_header'>Language:</h5>
                        <h5 class='demo_info'>${data.lepPercentage}</h5>`;
    }
}