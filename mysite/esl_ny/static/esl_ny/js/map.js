// Creating the map object


let geojson;
let myMap = null;



function updateMap(data){
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
      layer.bindPopup(`<h3 class="tight">${feature.properties.name}<br> (${feature.properties.borough})</h3> 
                        <br>
                        <h4 class="tight">LEP Population: ${feature.properties.population.toLocaleString("en-US")}</h4>`);
    }
  }).addTo(myMap);
  // Set up the legend.
  let legend = L.control({ position: "bottomright" });
      // Add minimum and maximum.
      legend.onAdd = function() {
        let somediv=document.querySelector("div.info.legend")
        if(somediv)somediv.remove()
        let div = L.DomUtil.create("div", "info legend");
        let limits = geojson.options.limits;
        let colors = geojson.options.colors;
        let labels = [];
    
        // Add the minimum and maximum.
        let legendInfo = "<h3>Population in<br> Community District</h3>" +
          "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0].toLocaleString("en-US") + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1].toLocaleString("en-US") + "</div>" +
          "</div>";
    
        div.innerHTML = legendInfo;
    
        colors.forEach(function(color) {
          labels.push("<li style=\"background-color: " + color + "\"></li>");
        });
    
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      };
    // Adding the legend to the map
    legend.addTo(myMap);
  }