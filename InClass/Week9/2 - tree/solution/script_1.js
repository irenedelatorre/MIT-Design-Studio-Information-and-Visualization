
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
    // .defer(d3.csv, "../data/Households_by_total_money_income.csv", parseData)
    .defer(d3.csv, "../data/Households_by_total_money_income_by_race_age.csv", parseIncome)

    .await(dataloaded);

function dataloaded (err,data){

    // data with which we're going to work
    var filteredData = data.filter(function(d){return d.age_range !== "Mean age of householder"});

    var meanExtent = d3.extent(filteredData,function(d){return d.total});
    var mean = d3.mean(filteredData,function(d){return d.total});

    console.log(meanExtent)

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
        var _nodes;

        if (visualizing === "race"){
            _nodes = nodesRace;
        }else{
            _nodes = nodesAge;
        }

        // LINKS
        // adds the links between the nodes
        var link = plotLink.selectAll(".link")
            .data( _nodes.descendants().slice(1));

        //ENTER
        link
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

        //EXIT
        link.exit().remove();

        //REMOVE
        link
            .transition()
            .duration(1000)
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
        var nodeCircles = plotCircles.selectAll(".node")
            .data(_nodes.descendants());

        // adds the circle to the node
        nodeCircles
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

            nodeCircles.exit().remove();

        nodeCircles
            .transition()
            .duration(1000)
            .attr("class", function(d) {
                return "node" +
                    (d.children ? " node--internal" : " node--leaf"); })
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; })
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
        var nodeNames = plotNodeNames.selectAll(".node")
            .data(_nodes.descendants());

        nodeNames
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

        nodeNames.exit().remove();

        nodeNames
            .transition()
            .duration(1000)
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
                    value = d.data.race;
                }
                return value; });


        // adds the numbers to the node
        var nodeNumbers = plotNodeNumbers.selectAll(".node")
            .data(_nodes.descendants());

        nodeNumbers
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

        nodeNumbers.exit().remove();

        nodeNumbers
            .transition()
            .duration(1000)
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
        visualizing="race";
        draw()
    });
    d3.select("#age").on("click",function(){
        visualizing="age"
        draw()
    });


}

function parseData(d){

    return {
        metric: d.Metric,
        first_category: d["Main category"],
        second_category: d["Characteristic"],
        third_category: d["Sub-characteristic"],
        total: +d.Total,
        under_5000: +d["Under $5,000"],
        between_5000_9999: +d["$5,000 to  $9,999"],
        between_10000_14999: +d["$10,000 to $14,999"],
        between_15000_19999: +d["$15,000 to $19,999"],
        between_20000_24999: +d["$20,000 to $24,999"],
        between_25000_29999: +d["$25,000 to $29,999"],
        between_30000_34999: +d["$30,000 to $34,999"],
        between_35000_39999: +d["$35,000 to $39,999"],
        between_40000_44999: +d["$40,000 to $44,999"],
        between_45000_49999: +d["$45,000 to $49,999"],
        between_50000_56999: +d["$50,000 to $54,999"],
        between_55000_59999: +d["$55,000 to $59,999"],
        between_60000_66999: +d["$60,000 to $64,999"],
        between_65000_69999: +d["$65,000 to $69,999"],
        between_70000_74999: +d["$70,000 to $74,999"],
        between_75000_79999: +d["$75,000 to $79,999"],
        between_80000_84999: +d["$80,000 to $84,999"],
        between_85000_89999: +d["$85,000 to $89,999"],
        between_90000_94999: +d["$90,000 to $94,999"],
        between_95000_99999: +d["$95,000 to $99,999"],
        between_100000_104999: +d["$100,000 to $104,999"],
        between_105000_109999: +d["$105,000 to $109,999"],
        between_110000_114999: +d["$90,000 to $94,999"],
        between_115000_119999: +d["$95,000 to $99,999"],
        between_120000_124999: +d["$120,000 to $124,999"],
        between_125000_129999: +d["$125,000 to $129,999"],
        between_130000_134999: +d["$90,000 to $94,999"],
        between_135000_139999: +d["$95,000 to $99,999"],
        between_140000_144999: +d["$140,000 to $144,999"],
        between_145000_149999: +d["$145,000 to $149,999"],
        between_150000_154999: +d["$90,000 to $94,999"],
        between_155000_159999: +d["$95,000 to $99,999"],
        between_160000_164999: +d["$160,000 to $164,999"],
        between_165000_169999: +d["$165,000 to $169,999"],
        between_170000_174999: +d["$90,000 to $94,999"],
        between_175000_179999: +d["$95,000 to $99,999"],
        between_180000_184999: +d["$180,000 to $184,999"],
        between_185000_189999: +d["$185,000 to $189,999"],
        between_190000_194999: +d["$90,000 to $94,999"],
        between_195000_199999: +d["$95,000 to $99,999"],
        over_200000: +d["$200,000 and over"],
        median_income: +d["Median income Value"],
        mean_income: +d["Mean income Value"],
        member_income: +d["Income per household member Value"],
    }
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

