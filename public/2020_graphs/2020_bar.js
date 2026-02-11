import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let serverData = await fetch("../temperature_data_2020.csv")
    .then(response => response.text())
    .then(dataString => {return dataString});

let parsedData = d3.csvParse(serverData);

for (let i = 0; i < parsedData.length; i++) {
    parsedData[i].Value = parseFloat(parsedData[i].Value);
};

console.log(parsedData);

// Main reference for creating the bar chart: https://d3-graph-gallery.com/graph/barplot_basic.html
const barContainer2020SVG = d3.select("#bar_2020")
    .append("svg")
        .attr("width", 800)
        .attr("height", 800)
    .append("g")
        .attr("transform", "translate(100, 100)");

const xAxis = d3.scaleBand()
    .domain(parsedData.map(function(singleDataObject) {
        return singleDataObject.Month;
    }))
    .range([0, 500]);
barContainer2020SVG.append("g")
    .attr("transform", "translate(0, 500)")
    .call(d3.axisBottom(xAxis))
    .selectAll("text")
        .attr("transform", "translate(-5, 0) rotate(-30)")
        .style("text-anchor", "end");

const yAxis = d3.scaleLinear()
    .domain([30, 75])
    .range([500, 0]);
barContainer2020SVG.append("g")
    .call(d3.axisLeft(yAxis));

barContainer2020SVG.selectAll("rect")
    .data(parsedData)
    .enter()
    .append("rect")
        .attr("x", function(singleDataObject) {
            return xAxis(singleDataObject.Month);
        })
        .attr("y", function(singleDataObject) {
            return yAxis(singleDataObject.Value);
        })
        .attr("width", xAxis.bandwidth())
        .attr("height", function(singleDataObject) {
            return 500 - yAxis(singleDataObject.Value);
        })
        .attr("fill", "#9b16c0")
        .attr("stroke", "black");

// Referred to https://d3-graph-gallery.com/graph/custom_axis.html#axistitles for creating both the x-axis and y-axis labels (technically also the title of the chart)
barContainer2020SVG.append("text")
    .attr("x", 225)
    .attr("y", 575)
    .text("Month");
barContainer2020SVG.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -400)
    .attr("y", -50)
    .text("Average Temperature in Deg. Fahrenheit");
barContainer2020SVG.append("text")
    .attr("x", 175)
    .attr("y", -20)
    .text("Average Monthly Temperature (2020)");