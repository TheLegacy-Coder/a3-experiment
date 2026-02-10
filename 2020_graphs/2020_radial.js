import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let serverData = await fetch("../temperature_data_1900_and_2020.csv")
    .then(response => response.text())
    .then(dataString => {return dataString});

let parsedData = d3.csvParse(serverData);

for (let i = 0; i < parsedData.length; i++) {
    parsedData[i].Value = parseFloat(parsedData[i].Value);
};

//console.log(parsedData);

// Radial chart reference: https://observablehq.com/@d3/radial-stacked-bar-chart/2

  // An angular x-scale
const x = d3.scaleBand()
    .domain(data.map(d => d.Date))
    .range([0, 2 * Math.PI])
    .align(0);

document.onload = () => {
    const radialContainer2020 = d3.select("#2020_radial");
}