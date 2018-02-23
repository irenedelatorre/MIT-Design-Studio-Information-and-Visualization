//plots
var margin1 = {t: 5, r: 40, b: 20, l: 30}; //this is an object
var width1 = d3.select('#mobile1').node().clientWidth - margin1.r - margin1.l,
    height1 = (d3.select('#mobile1').node().clientHeight / 4) - margin1.t - margin1.b;

var plot1 = d3.select('#plot1') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width1 + margin1.r + margin1.l)
    .attr('height', height1 + margin1.t + margin1.b);

var margin2 = {t: 0, r: 40, b: 20, l: 30}; //this is an object
var width2 = d3.select('#mobile1').node().clientWidth - margin2.r - margin2.l,
    height2 = (d3.select('#mobile1').node().clientHeight / 4) - margin2.t - margin2.b;

var plot2 = d3.select('#plot2') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width2 + margin2.r + margin2.l)
    .attr('height', height2 + margin2.t + margin2.b);


// var url = 'https://api.darksky.net/forecast/c6b293fcd2092b65cfb7313424b2f7ff/42.361145,-71.057083'

d3.json("../data/boston_weather.json",draw);

function draw(error,data){

    //PLOT 1 - today's weather
    var todayWeather = data.hourly.data;

    //today's temperature evolution

    // 1 UNDERSTAND THE DATA
    // 1.1 how do you want to show the information? By time (axis X)
    // check the data, transform it into date (is it the correct date???)
    // data is in seconds
    var extentTimeWeather = d3.extent(todayWeather,function(d){
        return new Date (d.time * 1000)
    });

    // data is until wednesday. We only want 24 hours --> filter data
    var todayNow = new Date ().getTime()/1000;
    var tomorrow = new Date ().getTime()/1000 + 24 * 3600;

    var data24h = todayWeather.filter(function(d){
        return d.time >= todayNow && d.time <= tomorrow
    });

    var extentdata24h = d3.extent(data24h,function(d){
        return new Date (d.time * 1000)
    });

    // 1.2 how do you want to show the information? By temperature (axis Y)
    // what are the min and maximum temperatures?
    var extentTodayWeather = d3.extent(data24h,function(d){
        return d.temperature
    });

    // and the average?
    var meanTodayWeather = d3.mean(data24h,function(d){
        return d.temperature
    });

    // 1.3 create scales to put the data in the dom element
    var scaleX1 = d3.scaleTime().domain(extentdata24h).range([0,width1]);
    var scaleY1 = d3.scaleLinear().domain([32,extentTodayWeather[1]]).range([height1,0]);

    // 1.4 create groups to put the content inside them
    plot1.append('g').attr('transform', 'translate(' + margin1.l + ',' + margin1.t + ')').attr('class', 'axis axis-y');
    plot1.append('g').attr('transform', 'translate(' + margin1.l + ',' + (margin1.t+height1) + ')').attr('class', 'axis axis-x');
    plot1.append('g').attr('transform', 'translate(' + margin1.l + ',' + margin1.t + ')').attr('class', 'todayWeather');


    // 1.5 create AXIS
   var formatHours = d3.timeFormat("%H:00");
   var formatDate = d3.timeFormat("%A");

    var axisHourX = d3.axisBottom().scale(scaleX1).ticks().tickFormat(formatHours),
        axisHourY = d3.axisLeft().scale(scaleY1).tickSizeInner(-width1).tickPadding([10]).ticks(5);

    plot1.select(".axis-x").call(axisHourX);
    plot1.select(".axis-y").call(axisHourY);


    //1.5 create graphical form - line
    var lineWeather = d3.line()
        .x(function(d) { return scaleX1(new Date (d.time*1000)); })
        .y(function(d) { return scaleY1(d.temperature); });

    // background
    var areaWeather = d3.area()
        .x(function(d) { return scaleX1(new Date (d.time*1000)); })
        .y1(function(d) { return scaleY1(d.temperature); })
        .y0(function(d) { return scaleY1(32); });

    plot1.select('.todayWeather')
        .datum(data24h) //select the data
        .append("path")
        .attr("class", "weatherArea") // this is the same class that we have selected before
        .attr("d",areaWeather);

    plot1.select('.todayWeather')
        .datum(data24h) //select the data
        .append("path")
        .attr("class", "weather") // this is the same class that we have selected before
        .attr("d",lineWeather);

    plot1
        .select('.todayWeather')
        .append("line")
        .attr("class","meanWeather")
        .attr("x1",scaleX1(extentdata24h[0]))
        .attr("x2",scaleX1(extentdata24h[1]))
        .attr("y1",scaleY1(meanTodayWeather))
        .attr("y2",scaleY1(meanTodayWeather));

    var plotDots = plot1.select('.todayWeather')
        .append("g")
        .attr("class","dots");
    //
    // var plotNumbers = plot1.select('.todayWeather')
    //     .append("g")
    //     .attr("class","numbers");

    plotDots
        .selectAll(".weatherDots")
        .data(data24h) //select the data
        .enter()
        .append("circle")
        .attr("class", "weatherDots") // this is the same class that we have selected before
        .attr("cx",function(d) { return scaleX1(new Date (d.time*1000)); })
        .attr("cy",function(d) { return scaleY1(d.temperature); })
        .attr("r",3);
    //
    // plotNumbers
    //     .selectAll(".weatherNumbers")
    //     .data(data24h) //select the data
    //     .enter()
    //     .append("text")
    //     .attr("class", "weatherNumbers") // this is the same class that we have selected before
    //     .text(function(d){return d.temperature})
    //     .attr("x",function(d) { return scaleX1(new Date (d.time*1000)); })
    //     .attr("y",function(d) { return scaleY1(d.temperature); });

    d3.select("#date").html(formatDate(extentdata24h[0]))



    //PLOT 2 - WEEKLY
    var weekWeather = data.daily.data;
    var weekWeatherSummary = data.daily.summary;

    d3.select("#summary").html(weekWeatherSummary);

    // 2 UNDERSTAND THE DATA
    // 2.1 how do you want to show the information? By time (axis X)
    var extentWeek = d3.extent(weekWeather,function(d){
        return new Date (d.time * 1000)
    });

    // 2.2 how do you want to show the information? By temperature (axis Y)
    // what are the min and maximum temperatures?
    var maxHighTemp = d3.max(weekWeather,function(d){return d.temperatureHigh});
    var minLowTemp = d3.min(weekWeather,function(d){return d.temperatureMin});

    // and the average?
    var meanWeekWeather = d3.mean(data24h,function(d){
        return d.temperature
    });

    // 2.3 create scales to put the data in the dom element
    var scaleX2 = d3.scaleTime().domain(extentWeek).range([0,width2]);
    var scaleY2 = d3.scaleLinear().domain([minLowTemp-5,maxHighTemp+5]).range([height2,0]);

    // 2.4 create groups to put the content inside them
    plot2.append('g').attr('transform', 'translate(' + margin2.l + ',' + margin2.t + ')').attr('class', 'axis axis-y');
    plot2.append('g').attr('transform', 'translate(' + margin2.l + ',' + (margin2.t+height1) + ')').attr('class', 'axis axis-x');
    plot2.append('g').attr('transform', 'translate(' + margin2.l + ',' + margin2.t + ')').attr('class', 'weekWeather');


    var plotLines = plot2.select('.weekWeather')
        .append("g")
        .attr("class","lines");

    var plotMax = plot2.select('.weekWeather')
        .append("g")
        .attr("class","maxDots");

    var plotMin = plot2.select('.weekWeather')
        .append("g")
        .attr("class","minDots");


    var formatWeek = d3.timeFormat("%a");

    var axisWeekX = d3.axisBottom().scale(scaleX2).ticks(8).tickFormat(formatWeek),
        axisWeekY = d3.axisLeft().scale(scaleY2).tickSizeInner(-width1).tickPadding([10]).ticks(5);
    
    plot2.select(".axis-x").call(axisWeekX);
    plot2.select(".axis-y").call(axisWeekY);


    plotLines
        .selectAll(".extent")
        .data(weekWeather) //select the data
        .enter()
        .append("line")
        .attr("class", "extent") // this is the same class that we have selected before
        .attr("x1",function(d) { return scaleX2(new Date (d.time*1000)); })
        .attr("x2",function(d) { return scaleX2(new Date (d.time*1000)); })
        .attr("y1",function(d) { return scaleY2(d.temperatureHigh); })
        .attr("y2",function(d) { return scaleY2(d.temperatureMin); });

    plotMax
        .selectAll(".dots")
        .data(weekWeather) //select the data
        .enter()
        .append("circle")
        .attr("class", "dots") // this is the same class that we have selected before
        .attr("cx",function(d) { return scaleX2(new Date (d.time*1000)); })
        .attr("cy",function(d) { return scaleY2(d.temperatureHigh); })
        .attr("r",3);

    plotMin
        .selectAll(".dots")
        .data(weekWeather) //select the data
        .enter()
        .append("circle")
        .attr("class", "dots") // this is the same class that we have selected before
        .attr("cx",function(d) { return scaleX2(new Date (d.time*1000)); })
        .attr("cy",function(d) { return scaleY2(d.temperatureMin); })
        .attr("r",3);
}
