
//plot
var margin = {t: 40, r: 5, b: 40, l: 5}; //this is an object
var width = d3.select('#plot1').node().clientWidth - margin.r - margin.l,
    height = d3.select('#plot1').node().clientHeight - margin.t - margin.b;

// Append svg to div
var plot1 = d3.select('#plot1') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width + margin.r + margin.l)
    .attr('height', height + margin.t + margin.b);

//create groups to put the content inside them
var plotLink = plot1.append('g').attr('transform', 'translate(' + margin.l + ',' + margin.t + ')').attr('class', 'tree link');
var plotNode = plot1.append('g').attr('transform', 'translate(' + margin.l + ',' + margin.t + ')').attr('class', 'tree node');

var plotCircles = plotNode.append("g").attr("class","circles");
var plotNodeNames = plotNode.append("g").attr("class","nodeTitles");
var plotNodeSubNames = plotNode.append("g").attr("class","nodeSubTitles");
var plotNodeNumbers = plotNode.append("g").attr("class","nodeNumbers");

var formatNumber = d3.format(".2");
var blue = "#66b2c5";
var yellow = "#ffb400";
var red = "#c63232";
var green = "#72a746";

//Layout function
var treemap = d3.tree()
    .size([width, height-200])
    .separation(function(a, b) {return (a.parent == b.parent ? 1 : 2) / a.depth; });

var visualizing = "race";


// queue data files, parse them and use them
var queue = d3.queue()
    .defer(d3.csv, "data/Households_by_total_money_income_by_race_age.csv", parseIncome)

    .await(dataloaded);

function dataloaded (err,data){

    // data with which we're going to work
    var filteredData = data.filter(function(d){return d.age_range !== "Mean age of householder"});

    var meanExtent = d3.extent(filteredData,function(d){return d.total});
    var mean = d3.mean(filteredData,function(d){return d.total});

    var scaleStroke = d3.scaleLinear().domain(meanExtent).range([0.5,10]);
    var scaleColor = d3.scaleLinear().domain([meanExtent[0],mean,meanExtent[1]]).range([red,yellow,blue]);


    // create structured data for hierarchy according to race
    var nestedDataRace = d3.nest().key(function(d){return d.race}) // two main groups
        .entries(filteredData);

    var depthRace = d3.max(nestedDataRace,function(d){return d.values.length});

    var rootRace = [];
    var rootsRace = [];

    for(var i=0; i<nestedDataRace.length; i++){
        var name = nestedDataRace[i].key;
        var children = nestedDataRace[i].values;

        rootsRace.push({
            "name": name,
            "children": children
        })


    }

    rootRace.push({
        name: "All",
        children: rootsRace,
        maxDepth: depthRace
    });


    // hierarchy using parent-child relationships
    var hierarchyRace = d3.hierarchy(rootRace[0]); // give the object to get depth and height

    // maps the node data to the tree layout
    var nodesRace = treemap(hierarchyRace);

    // create structured data according to age
    var nestedDataAge = d3.nest().key(function(d){return d.age_range}) // two main groups
        .entries(filteredData);

    var depthAge = d3.max(nestedDataAge,function(d){return d.values.length});


    var rootAge = [];
    var rootsAge = [];

    for(var i=0; i<nestedDataAge.length; i++){
        var name = nestedDataAge[i].key;
        var children = nestedDataAge[i].values;

        rootsAge.push({
            "name": name,
            "children": children
        })


    }

    rootAge.push({
        name: "All",
        children: rootsAge,
        maxDepth: depthAge
    });


    // hierarchy using parent-child relationships
    var hierarchyAge = d3.hierarchy(rootAge[0]); // give the object to get depth and height

    // maps the node data to the tree layout
    var nodesAge = treemap(hierarchyAge);

    draw();


    function draw(){

        //TODO Update chart depending on selected button
        var _nodes = nodesRace;

        // LINKS
        // adds the links between the nodes
        plotLink.selectAll(".link")
            .data( _nodes.descendants().slice(1))
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", function(d) {
                return "M" + d.x + "," + d.y
                    + "C" + d.x + "," + (d.y + d.parent.y) / 2
                    + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
                    + " " + d.parent.x + "," + d.parent.y;
            })
            .style("fill","none")
            .style("stroke",function(d){
                var value = 1;
                if (d.data.total>0){
                    value = d.data.total
                }else{
                    value = d3.mean(d.data.children,function(e){return e.total});

                    if (d.depth===0){
                        value = mean
                    }
                }
                return scaleColor(value)
            })
            .style("stroke-width",function(d){
                var value = 1;
                if (d.data.total>0){
                    value = d.data.total
                }else{
                    value = d3.mean(d.data.children,function(e){return e.total});
                    if (d.depth===0){
                        value = mean
                    }
                }
                return scaleStroke(value)
            });


        //NODES

        // adds circles
        plotCircles.selectAll(".node")
            .data(_nodes.descendants())
            .enter()
            .append("circle")
            .attr("class", function(d) {
                return "node" +
                    (d.children ? " node--internal" : " node--leaf"); })
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; })
            .attr("r", 5)
            .style("fill","white")
            .style("stroke-width",2)
            .style("stroke",function(d){
                var value = 1;
                if (d.data.total>0){
                    value = d.data.total
                }else{
                    value = d3.mean(d.data.children,function(e){return e.total});

                    if (d.depth===0){
                        value = mean
                    }
                }
                return scaleColor(value)
            });


        // adds the text to the node
        plotNodeNames.selectAll(".node")
            .data(_nodes.descendants())
            .enter()
            .append("text")
            .attr("class", function(d) {
                return "nodeNames node" +
                    (d.children ? " node--internal" : " node--leaf"); })
            .attr("transform", function(d) {
                var value = "translate(" + d.x + "," + d.y + ")";
                if (d.depth===2){
                    value = "translate(" + (d.x+20) + "," + (d.y+40) + ")" + "rotate(90)"
                }
                return value })
            .attr("dy", ".35em")
            .attr("y", function(d) { return d.children ? -35 : 20; })
            .style("text-anchor", function(d){
                if (d.depth<2){
                    return "middle"
                }else{
                    return "start"
                }
            })
            .text(function(d) {
                var value = d.data.name;
                if (d.depth === 2 && visualizing === "race"){
                    value = d.data.age_range
                }else if (d.depth === 2 && visualizing === "age"){
                    value = d.data.race
                }
                return value; });


        // adds the numbers to the node
        plotNodeNumbers.selectAll(".node")
            .data(_nodes.descendants())
            .enter()
            .append("text")
            .attr("class", function(d) {
                return "nodeValues node" +
                    (d.children ? " node--internal" : " node--leaf"); })
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; })
            .attr("dy", ".35em")
            .attr("y", function(d) { return d.children ? -15 : 20; })
            .style("text-anchor", "middle")
            .text(function(d){
                var value;
                if (d.data.total>0){
                    value = d.data.total
                }else{
                    value = d3.mean(d.data.children,function(e){return e.total});
                    if (d.depth===0){
                        value = mean
                    }
                }
                return formatNumber((value/1000))
            });

    }


    d3.select("#race").on("click",function(){

    });
    d3.select("#age").on("click",function(){

    });


}



function parseIncome(d,i){

    return {
        race: d.race,
        age_range: d["Characteristic"],
        total: +d.Total,
        id: i
        // median_income: +d["Median income Value"],
        // mean_income: +d["Mean income"],
        // member_income: +d["Income per household member"],
    }
}

