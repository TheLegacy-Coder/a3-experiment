import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let serverData = await fetch("../temperature_data_1900_and_2020.csv")
    .then(response => response.text())
    .then(dataString => {return dataString});

let parsedData = d3.csvParse(serverData);

for (let i = 0; i < parsedData.length; i++) {
    parsedData[i].Value = parseFloat(parsedData[i].Value);
};

//console.log(parsedData);

// Radial chart reference: https://d3-graph-gallery.com/graph/circular_barplot_label.html

document.onload = () => {
    const radialContainer2020 = d3.select("#2020_radial")

    const x = d3.scaleBand()
      .range([0, 2 * Math.PI])   
      .align(0)                  
      .domain(data.map(function(d) { return d.Month; }));
    

}