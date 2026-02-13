import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let serverData = await fetch("../temperature_data_2020.csv")
    .then(response => response.text())
    .then(dataString => {return dataString});

let parsedData = d3.csvParse(serverData);

for (let i = 0; i < parsedData.length; i++) {
    parsedData[i].Value = parseFloat(parsedData[i].Value);
};

//console.log(parsedData);

const defaultColor = "#9b16c0";

function renderSVG(color) {

    const singleSVGSelect = d3.select("#radial_2020");
    singleSVGSelect.selectAll("svg").remove();

    // Radial chart reference: https://d3-graph-gallery.com/graph/circular_barplot_label.html

    const margin = {top: 100, right: 0, bottom: 0, left: 0},
        width = 800 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom,
        innerRadius = 100,
        outerRadius = Math.min(width, height) / 2;

    const x = d3.scaleBand()
        .range([0, 2 * Math.PI])   
        .align(0)                  
        .domain(parsedData.map(function(d) { return d.Month; }));

    const y =  d3.scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([30, 75]);

    const radialContainer2020 = d3.select("#radial_2020")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

    radialContainer2020.append("g")
        .attr("transform", "translate(385, 350)")
        .selectAll("path")
        .data(parsedData)
        .enter()
        .append("path")
            .attr("fill", color)
            .attr("d", d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(function(d) { return y(d.Value); })
                .startAngle(function(d) { return x(d.Month); })
                .endAngle(function(d) { return x(d.Month) + x.bandwidth(); })
                .padAngle(0.01)
                .padRadius(innerRadius))

    radialContainer2020.append("g")
        .attr("transform", "translate(385,350)")
        .selectAll("g")
        .data(parsedData)
        .enter()
            .append("g")
                .attr("text-anchor", function(d) { return (x(d.Month) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
                .attr("transform", function(d) { return "rotate(" + ((x(d.Month) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d.Value)+10) + ",0)"; })
            .append("text")
                .text(function(d){return(d.Month)})
                .attr("transform", function(d) { return (x(d.Month) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
                .style("font-size", "15px")
                .attr("alignment-baseline", "middle")

    const yAxis = d3.axisLeft(y);

    radialContainer2020.append("g")
        .attr("transform", "translate(385,350)")
        .selectAll("circle")
        .data(d3.range(30, 75, 5))
        .enter()
            .append("circle")
                .attr("fill", "none")
                .attr("stroke", "#ddd")
                .attr("stroke-width", 1)
                .attr("r", function(d) { return y(d); })

    // Docs used for getBBox: https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement/getBBox
    radialContainer2020.append("g")
        .attr("transform", "translate(385,350)")
        .call(yAxis)
        .selectAll("text")
            .style("font-size", "12px")
            .each(function() {
                const bbox = this.getBBox();
                d3.select(this.parentNode).insert("rect", ":first-child")
                    .attr("x", bbox.x - 5)
                    .attr("y", bbox.y - 3)
                    .attr("rx", 10)
                    .attr("ry", 10)
                    .attr("width", bbox.width + 10)
                    .attr("height", bbox.height + 6)
                    .style("fill", "white")
                    .style("stroke", "black");
            })

    radialContainer2020.append("g")
        .attr("transform", "translate(400,525) rotate(90)")
        .append("text")
        .text("Degrees (F)")
        .each(function() {
            const bbox = this.getBBox();
            d3.select(this.parentNode).insert("rect", ":first-child")
                .attr("x", bbox.x - 5)
                .attr("y", bbox.y - 3)
                .attr("rx", 10)
                .attr("ry", 10)
                .attr("width", bbox.width + 10)
                .attr("height", bbox.height + 6)
                .style("fill", "white")
                .style("stroke", "black");
        })

    radialContainer2020.append("text")
        .text("Average Monthly Temperature")
        .attr("x", 250)
        .attr("y", 15)

};

window.onload = renderSVG(defaultColor);
document.getElementById("radial_2020_color").onchange = function () {
    renderSVG(document.getElementById("radial_2020_color").value);
};