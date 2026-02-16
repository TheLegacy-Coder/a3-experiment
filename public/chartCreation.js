import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


let year1Color = "#42903c";
let year2Color = "#9b16c0";


// Render the bar chart
const renderBarChart = (color, year, data) => {
    
    const singleSVGSelect = d3.select(`#bar_${year}`);
    singleSVGSelect.selectAll("svg").remove();

    // Main reference for creating the bar chart: https://d3-graph-gallery.com/graph/barplot_basic.html
    const barContainer = d3.select(`#bar_${year}`)
        .append("svg")
            .attr("width", 800)
            .attr("height", 800)
        .append("g")
            .attr("transform", "translate(100, 100)");

    const xAxis = d3.scaleBand()
        .domain(data.map(function(singleDataObject) {
            return singleDataObject.Month;
        }))
        .range([0, 500]);
    barContainer.append("g")
        .attr("transform", "translate(0, 500)")
        .call(d3.axisBottom(xAxis))
        .selectAll("text")
            .attr("transform", "translate(-5, 0) rotate(-30)")
            .style("text-anchor", "end");

    const yAxis = d3.scaleLinear()
        .domain([20, 85])
        .range([500, 0]);
    barContainer.append("g")
        .call(d3.axisLeft(yAxis));

    barContainer.selectAll("rect")
        .data(data)
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
            .attr("fill", color)
            .attr("stroke", "black");

    // Referred to https://d3-graph-gallery.com/graph/custom_axis.html#axistitles for creating both the x-axis and y-axis labels (technically also the title of the chart)
    barContainer.append("text")
        .attr("x", 225)
        .attr("y", 575)
        .text("Month");
    barContainer.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -400)
        .attr("y", -50)
        .text("Average Temperature in Deg. Fahrenheit");
    barContainer.append("text")
        .attr("x", 175)
        .attr("y", -20)
        .text("Average Monthly Temperature");
};

// Render the line chart
const renderLineChart = (color, year, data) => {
    const singleSVGSelect = d3.select(`#line_${year}`);
    singleSVGSelect.selectAll("svg").remove();

    // Main reference for creating the line chart: https://d3-graph-gallery.com/graph/line_basic.html
    // However, certain elements (such as axes creation logic) still come from the following: https://d3-graph-gallery.com/graph/barplot_basic.html
    const lineContainerSVG = d3.select(`#line_${year}`)
        .append("svg")
            .attr("width", 800)
            .attr("height", 800)
        .append("g")
            .attr("transform", "translate(100, 100)");

    const xAxis = d3.scaleBand()
        .domain(data.map(function(singleDataObject) {
            return singleDataObject.Month;
        }))
        .range([0, 500]);
    lineContainerSVG.append("g")
        .attr("transform", "translate(0, 500)")
        .call(d3.axisBottom(xAxis))
        .selectAll("text")
            .attr("transform", "translate(-5, 0) rotate(-30)")
            .style("text-anchor", "end");

    const yAxis = d3.scaleLinear()
        .domain([20, 85])
        .range([500, 0]);
    lineContainerSVG.append("g")
        .call(d3.axisLeft(yAxis));

    lineContainerSVG.append("path")
        .datum(data)
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
    lineContainerSVG.append("text")
        .attr("x", 225)
        .attr("y", 575)
        .text("Month");
    lineContainerSVG.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -400)
        .attr("y", -50)
        .text("Average Temperature in Deg. Fahrenheit");
    lineContainerSVG.append("text")
        .attr("x", 175)
        .attr("y", -20)
        .text("Average Monthly Temperature");
}


const renderRadialChart = (color, year, data) => {
    const singleSVGSelect = d3.select(`#radial_${year}`);
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
        .domain(data.map(function(d) { return d.Month; }));

    const y =  d3.scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([20, 80]);

    const radialContainer = d3.select(`#radial_${year}`)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

    radialContainer.append("g")
        .attr("transform", "translate(385, 350)")
        .selectAll("path")
        .data(data)
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

    radialContainer.append("g")
        .attr("transform", "translate(385,350)")
        .selectAll("g")
        .data(data)
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

    radialContainer.append("g")
        .attr("transform", "translate(385,350)")
        .selectAll("circle")
        .data(d3.range(20, 80, 5))
        .enter()
            .append("circle")
                .attr("fill", "none")
                .attr("stroke", "#ddd")
                .attr("stroke-width", 1)
                .attr("r", function(d) { return y(d); })

    // Docs used for getBBox: https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement/getBBox
    radialContainer.append("g")
        .attr("transform", "translate(385,350)")
        .call(yAxis.ticks(6))
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

    radialContainer.append("g")
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

    radialContainer.append("text")
        .text("Average Monthly Temperature")
        .attr("x", 250)
        .attr("y", 15)
}



const createCharts = async (year1, year2) => {
    let year1Data = await fetch(`csvFiles/temperature_data_${year1}.csv`)
        .then(response => response.text())
        .then(dataString => d3.csvParse(dataString));

    let year2Data = await fetch(`csvFiles/temperature_data_${year2}.csv`)
        .then(response => response.text())
        .then(dataString => d3.csvParse(dataString));

    for (let i = 0; i < year1Data.length; i++) {
        year1Data[i].Value = parseFloat(year1Data[i].Value);
    };

    for (let i = 0; i < year2Data.length; i++) {
        year2Data[i].Value = parseFloat(year2Data[i].Value);
    };

    renderBarChart(year1Color, year1, year1Data);
    renderBarChart(year2Color, year2, year2Data);
    renderLineChart(year1Color, year1, year1Data);
    renderLineChart(year2Color, year2, year2Data);
    renderRadialChart(year1Color, year1, year1Data);
    renderRadialChart(year2Color, year2, year2Data);
}


window.onload = () => {
    let year1 = document.getElementById("year1").value;
    let year2 = document.getElementById("year2").value;

    createCharts(year1, year2)
}