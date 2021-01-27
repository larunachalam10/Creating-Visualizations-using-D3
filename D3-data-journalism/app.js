// @TODO: YOUR CODE HERE!
var svgWidth = 960;
// var svgHeight = 500;
var svgHeight = 620;
// Define the chart's margins as an object
var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //load data from csv file
d3.csv("data.csv").then(function (Data) {

    console.log(Data);


    Data.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare
        data.incomeMoe = +data.incomeMoe
        data.povertyMoe = +data.povertMoe;
    });
    // extent = min and max 
    // range b/w min and max = (max-  min)
    // scale percentage - 0.05 
    //(min extent - range ) * scale 
    // (max extent + range) * scale 
    // to bring the contect within the axis

    var extent1 = d3.extent(Data, d => d.poverty)
    var extent2 = d3.extent(Data, d => d.healthcare)

    var range1 = extent1[1] - extent1[0]
    var scale = 0.05
    var domain1 = [
        extent1[0] - range1 * scale,
        extent1[1] + range1 * scale
    ]

    var range2 = extent2[1] - extent2[0]
    var domain2 = [
        extent2[0] - range2 * scale,
        extent2[1] + range2 * scale
    ]


    var xScale = d3.scaleLinear()
        .domain(domain1)
        .range([0, chartWidth]);

    var yScale = d3.scaleLinear()
        .domain(domain2)
        .range([chartHeight, 0]);

    var bottomAxis = d3.axisBottom(xScale);

    var leftAxis = d3.axisLeft(yScale);


    var div= d3.select("body").append("div")
            .attr("class","tooltip")
            .style("opacity",0);


    var tooltip = d3.select("#scatter")
                .append("div")
                .classed("tooltip",true);
    

    chartGroup.append("g")
        .call(leftAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // var circlesGroup = chartGroup.selectAll("circle")
    chartGroup.selectAll("circle")
        .data(Data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "red")
        .style("opacity", 0.5)
        .attr("stroke", "white");

    // chart title


    var circlesGroup=chartGroup.selectAll(null)
        .data(Data)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare))
        .attr("dy", "0.4em")
        .text(d => d.abbr)
        .classed("stateText", true)
        .on("mouseover",function(d){
            div.transition()
                .duration(200)
                .style("opacity",9);
            div.html((d.abbr)+"<br/>"+"Poverty %-"+d.poverty)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
        })
        .on("mouseout",tooltip.hide);


    // X axis label
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 20})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "green")
        .attr("class", "axisText")
        .style("text-anchor", "middle")
        .text("In Poverty (%)");

    // Y axis label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - chartHeight / 2)
        .attr("y", 0 - margin.left + 50)
        .attr("class", "axisText")
        .attr("fill", 'green')
        .style("text-anchor", "middle")
        .text("Lacks- Healthcare(%");


})
