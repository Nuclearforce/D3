var projection = d3.geoMercator()
  .scale(1800)
  .center([26,-28]);

var path = d3.geoPath()
.projection(projection);

var svg = d3.select("#ca2");

var tooltip = d3.select("body").append("div") 
      .attr("class", "tooltip")       
      .style("opacity", 0);

var provs = d3.map();
var colorScale = d3.scaleThreshold()
.domain([11,15,20,30])
.range(["lightgrey","lightblue","blue","black"]);

var promises = [
  d3.json("saprov2.json"),
  d3.csv("provd.csv")
];

// Legend
var g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)");
g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Credential Attainment %");
var labels = ['8-10', '11-14', '15-19', '20-30'];
var legend = d3.legendColor()
    .labels(function (d) {return labels[d.i]; })
    .shapePadding(4)
    .scale(colorScale);
svg.select(".legendThreshold")
    .call(legend);

var gdt;
var yr="2009";
d3.selectAll("input[name='stack']").on("change", function(){
    yr = this.value;
    svg.selectAll("path")
        .attr("fill", function(d) { 
            let obj = gdt.find(obj => 
                               obj.id == +d.properties.id
                               && obj.year==yr);
            if (typeof obj !== 'undefined') {
                return colorScale(+obj.perc); }
            else { return colorScale(1); }})
        .attr("d", path)
    // .append("title")
    //  .text(function(d) { return d.rate + "%"; })
    ;
});

Promise.all(promises).then(ready)

function ready([us,dt]) {
    gdt = dt;
    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.ZAF_adm1).features)
        .enter().append("path")
        .attr("fill", function(d) { 
            let obj = dt.find(obj => 
                    obj.id == +d.properties.id
                    && obj.year==yr);
            if (typeof obj !== 'undefined') {
                return colorScale(+obj.perc); }
            else { return colorScale(1); }})
        .on("mouseover", function(d) {    
            tooltip.transition()    
                .duration(100)    
                .style("opacity", .9);    
            tooltip.html(function() {
                let obj = dt.find(obj => 
                    obj.id == +d.properties.id
                    && obj.year==yr);
                if (typeof obj !== 'undefined') {
                    return d.properties.NAME_1+" " 
                        + obj.perc + "%"; }
            else { return d.properties.NAME_1; }})
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY - 28) + "px");  
        })          
        .on("mouseout", function(d) {   
            tooltip.transition()    
                .duration(500)    
                .style("opacity", 0); 
        })
        .attr("d", path)
    // .append("title")
    //  .text(function(d) { return d.rate + "%"; })
    ;
}

// d3.json("saprov.json", function(error, uk) {
// svg.append("path")
// .datum(topojson.feature(uk, uk.objects.ZAF_adm1))
// .attr("d", path);
// });


//  data from demarcation.org.za district municipalities  
// // .json("dm.json", function(error, uk)
//    svg.selectAll(".subunit") 
//        .data(topojson.feature(uk, uk.objects.bbox).features) 
//      .enter().append("path") 
//        .attr("class", function(d) { return "subunit " + d.OBJECT_ID; }) 
//        .attr("d", path); 
//  }); 
