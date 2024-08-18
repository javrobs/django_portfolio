// Creating the map object
let geojson;
let myMap = null;

function updateMap(){
  const data=savedData.communities;
  if (myMap==null){
    myMap = L.map("map-container", {center: [40.7128, -74.0059],zoom: 10});
    let tileLayer=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    tileLayer.addTo(myMap);
    console.log('initialized map?')
  } else {
  myMap.removeLayer(geojson);
  }
  geojson = L.choropleth(data,
    {valueProperty: "population",
    scale:["feeed7","f8b550","f17604","cc3600"],
    steps: 20,mode: "e",
    style: {
      color: "#ffff",
      weight: 1,
      fillOpacity: 0.6
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h3 class='rounded-top'>${feature.properties.name}</h3>
                      <p class='pt-2'>${feature.properties.borough}</p> 
                      <p class='py-2'>LEP Population: <span class='demo-info'>${feature.properties.population.toLocaleString("en-US")}</span></p>`);
    }
  }).addTo(myMap);
  // Set up the legend.
  let legend = L.control({ position: "bottomright" });
      // Add minimum and maximum.
      legend.onAdd = function() {
        let somediv=document.querySelector("div.info.legend");
        if(somediv)somediv.remove();
        let div = L.DomUtil.create("div", "info legend");
        let limits = geojson.options.limits;
        div.innerHTML = `<p class='fs-5'>Population in Community District</p>
                        <div class='d-flex justify-content-between'>
                          <div class='min'>
                            ${limits[0].toLocaleString("en-US")}
                          </div>
                          <div class='max'>
                            ${limits[limits.length - 1].toLocaleString("en-US")}
                          </div>
                        </div>
                        <div class='gradient-box'></div>`;
        return div;
      };
    // Adding the legend to the map
    legend.addTo(myMap);
  }