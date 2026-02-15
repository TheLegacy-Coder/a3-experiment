import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let serverData = await fetch("../temperature_data_2020.csv")
    .then(response => response.text())
    .then(dataString => {return dataString});

let parsedData = d3.csvParse(serverData);

for (let i = 0; i < parsedData.length; i++) {
    parsedData[i].Value = parseFloat(parsedData[i].Value);
};

const defaultColor = "#9b16c0";

function renderSVG(color) {

    const singleSVGSelect = d3.select("#line_2020");
    singleSVGSelect.selectAll("svg").remove();

    // Main reference for creating the line chart: https://d3-graph-gallery.com/graph/line_basic.html
    // However, certain elements (such as axes creation logic) still come from the following: https://d3-graph-gallery.com/graph/barplot_basic.html
    const lineContainer2020SVG = d3.select("#line_2020")
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
    lineContainer2020SVG.append("g")
        .attr("transform", "translate(0, 500)")
        .call(d3.axisBottom(xAxis))
        .selectAll("text")
            .attr("transform", "translate(-5, 0) rotate(-30)")
            .style("text-anchor", "end");

    const yAxis = d3.scaleLinear()
        .domain([30, 75])
        .range([500, 0]);
    lineContainer2020SVG.append("g")
        .call(d3.axisLeft(yAxis));

    lineContainer2020SVG.append("path")
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
        .attr("stroke", color)
        .attr("stroke-width", 5);

    // Referred to https://d3-graph-gallery.com/graph/custom_axis.html#axistitles for creating both the x-axis and y-axis labels (technically also the title of the chart)
    lineContainer2020SVG.append("text")
        .attr("x", 225)
        .attr("y", 575)
        .text("Month");
    lineContainer2020SVG.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -400)
        .attr("y", -50)
        .text("Average Temperature in Deg. Fahrenheit");
    lineContainer2020SVG.append("text")
        .attr("x", 175)
        .attr("y", -20)
        .text("Average Monthly Temperature");

};

window.onload = renderSVG(defaultColor);
document.getElementById("line_2020_color").onchange = function () {
    renderSVG(document.getElementById("line_2020_color").value);
};