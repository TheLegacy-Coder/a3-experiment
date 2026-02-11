import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let serverData = await fetch("../temperature_data_1900.csv")
    .then(response => response.text())
    .then(dataString => {return dataString});

let parsedData = d3.csvParse(serverData);

for (let i = 0; i < parsedData.length; i++) {
    parsedData[i].Value = parseFloat(parsedData[i].Value);
};

console.log(parsedData);

// Main reference for creating the line chart: https://d3-graph-gallery.com/graph/line_basic.html
// However, certain elements (such as axes creation logic) still come from the following: https://d3-graph-gallery.com/graph/barplot_basic.html
const lineContainer1900SVG = d3.select("#line_1900")
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
lineContainer1900SVG.append("g")
    .attr("transform", "translate(0, 500)")
    .call(d3.axisBottom(xAxis))
    .selectAll("text")
        .attr("transform", "translate(-5, 0) rotate(-30)")
        .style("text-anchor", "end");

const yAxis = d3.scaleLinear()
    .domain([30, 75])
    .range([500, 0]);
lineContainer1900SVG.append("g")
    .call(d3.axisLeft(yAxis));

lineContainer1900SVG.append("path")
    .datum(parsedData)
    .attr("d", d3.line()
        .x(function(singleDataObject) {
            return xAxis(singleDataObject.Month);
        })
        .y(function(singleDataObject) {
            return yAxis(singleDataObject.Value);
        })
    )
    .attr("fill", "none")
    .attr("stroke", "#42903c")
    .attr("stroke-width", 5);

// Referred to https://d3-graph-gallery.com/graph/custom_axis.html#axistitles for creating both the x-axis and y-axis labels (technically also the title of the chart)
lineContainer1900SVG.append("text")
    .attr("x", 225)
    .attr("y", 575)
    .text("Month");
lineContainer1900SVG.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -400)
    .attr("y", -50)
    .text("Average Temperature in Deg. Fahrenheit");
lineContainer1900SVG.append("text")
    .attr("x", 175)
    .attr("y", -20)
    .text("Average Monthly Temperature (1900)");