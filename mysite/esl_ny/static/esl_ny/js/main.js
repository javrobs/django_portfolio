const contentContainer=document.getElementById('content-container');
const selectLanguage=document.getElementById('select-language');
const languageSpeakers=document.getElementById('lang-speakers');
const speakersPercentage=document.getElementById('speakers-percentage');
let activePlots=[]
let savedData={}

initialize();
function initialize(){
    languageChanged();
}

function fetchJsonThen(urlString,thenDoThis){
    const url=(selectLanguage.value)?`/${urlString}/${selectLanguage.value}`:`/${urlString}_all`;
    let timeThen=performance.now()
    console.log('calling '+urlString)
    fetch(url).then(data=>data.json()).then(data=>{
        savedData[urlString]=data;
        console.log('received',{timeElapsed:(performance.now()-timeThen)/1000,data:data})
        thenDoThis();
    });
}

function languageChanged(){
    fetchJsonThen('demographic',demoBox);
    fetchJsonThen('populations',updateSunburst);
    fetchJsonThen('communities',updateMap);
}

function optionChanged(item) {
    let children=contentContainer.children;
    let element=item.id.split('-')[0]
    let container=document.getElementById(`${element}-container`);
    for(child of children){
        if (child == container) {
            child.classList.add('forward');
            item.classList='selected';
        } else {
            child.classList.remove('forward');
            document.getElementById(`${child.id.split('-')[0]}-input`).classList.remove('selected');
        }
    }
}

function demoBox() {
    const data=savedData.demographic;
    languageSpeakers.innerText=data.totalLEPpopulation.toLocaleString("en-US");
    speakersPercentage.innerHTML=(data.lepPercentage==undefined)?'':`% of all LEP Speakers:<span class='demo-info'>${data.lepPercentage}%</span>`;
    barGraph();
}
  
function barGraph(){
    if(activePlots.includes('bar')){
        Plotly.purge('bar');
    } else {
        activePlots.push('bar');
    }
    const graphData=savedData.demographic.largestLEPs;
    const population = graphData.map(row => row.lep_population);
    const text = population.map(each => each.toLocaleString('en-US'));
    const communities = graphData.map(row => `${row.community_district}<br><b>${row.borough_name}</b>`);
    const title=(savedData.demographic.lepPercentage==undefined)?'Largest LEP Populations':`Largest ${savedData.demographic.selectedLanguage} Populations`;
    const barData =[
        {
            y: communities.reverse(),
            x: population.reverse(),
            text: text.reverse(),
            type: "bar",
            textposition: 'auto',
            marker:{color:"#176F6A"},
            orientation: "h",
        },
    ];
    const div=document.getElementById('bar');
    const dims={height:div.offsetHeight-1,
                width:div.offsetWidth-1};
    const barLayout = {
        title: title,
        margin: {t: 50, l: 150 ,b:20,r:10},
        height: dims.height,
        width: dims.width,
        paper_bgcolor: "rgba(255, 255, 255, 0)",
        plot_bgcolor:"rgba(255, 255, 255, 0)",
        bargap :0.05
    };
    Plotly.newPlot("bar" , barData , barLayout,{staticPlot: true});
}


function updateSunburst() {
    const data=savedData.populations;
    if(activePlots.includes('sunburst-container')){
        Plotly.purge('sunburst-container');
    } else {
        activePlots.push('sunburst-container');
    }
    const trace = {
        type: "sunburst",
        maxdepth: 3,
        hoverinfo:"label+text+value+percent parent+percent root",
        branchvalues: "total",
        ids: data.list.map(line=>line.id),
        labels: data.list.map(line=>{return line.label}),
        parents: data.list.map(line=>line.parent),
        marker:{line:{color:"white",width:0.3}},
        values: data.list.map(line=>line.value),
        insidetextorientation: 'radial',
        textfont:{size:14,color:"black"}
    };
    const div=document.getElementById('sunburst-container');
    const dims={height:div.offsetHeight-1,
                width:div.offsetWidth-1};
    const layout = {
      margin: {l:30,r:30,t:30,b:30},
      paper_bgcolor: "0000",
      height: dims.height,
      width: dims.width,
      sunburstcolorway:["d67616","62aa9f","1c8782","c7531a","a63a24"]
    };
    Plotly.newPlot('sunburst-container', [trace], layout, {displayModeBar: false});
}

window.addEventListener("resize", ()=>{
    let doit;
    clearTimeout(doit);
    doit = setTimeout(refreshPlots, 200);
});

function refreshPlots(){
    if(activePlots.includes('sunburst-container')){
        updateSunburst();
    }
    if(activePlots.includes('bar')){
        barGraph();
    }
}