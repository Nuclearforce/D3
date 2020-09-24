var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var svgl1 = d3.select("#ca1");
var
  margin = { top: 20, right: 140, bottom: 30, left: 40 },
  width = +svgl1.attr("width") - margin.left - margin.right,
  height = +svgl1.attr("height") - margin.top - margin.bottom;
var gl1 = svgl1.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the line
{/* var valueline = d3.line()
  .x(function(d) { return x(d.year); })
  .y(function(d) { return y(d.Postschool); }); 
   */}
 
d3.tsv("data.tsv", function (d) {
  d.Postschool = +d.Postschool;
  d.HighValueBroad = +d.HighValueBroad;
  d.HighValueStrict = +d.HighValueStrict;
  return d;
}).then(function (data) {

  var x = d3.scaleBand().rangeRound([0, width]).padding(1),
    y = d3.scaleLinear().rangeRound([height, 0]),
    z = d3.scaleOrdinal(['#036888', '#0D833C', '#D2392A']);

  y.domain([0, d3.max(data, function (d) {
      console.log(Math.max(d.Postschool, d.HighValueBroad,
      d.HighValueStrict));
    return Math.max(d.Postschool, d.HighValueBroad,
      d.HighValueStrict)+1;
  })]);       //return d.Postschool

  x.domain(data.map(function (d) { return d.year; }));
  // define the line
  var line = d3.line()
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.total); });

  z.domain(d3.keys(data[0]).filter(function (key) {
    return key !== "year";
  }));

  var trends = z.domain().map(function (name) {
    return {
      name: name,
      values: data.map(function (d) {
        return {
          year: d.year,
          total: +d[name] 
        };
      })
    };
  });

  var legend = gl1.selectAll('g')
    .data(trends)
    .enter()
    .append('g')
    .attr('class', 'legend');

  legend.append('rect')
    .attr('x', width - 20)
    .attr('y', function (d, i) { return height / 2 - (i + 1) * 20; })
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', function (d) { return z(d.name); });

  legend.append('text')
    .attr('x', width)
    .attr('y', function (d, i) { return height / 2 - (i + 1) * 20 + 10; })
    .text(function (d) { return d.name; });

  // Draw the line
  var trend = gl1.selectAll(".trend")
    .data(trends)
    .enter()
    .append("g")
    .attr("class", "trend");

  trend.append("path")
    .attr("class", "line")
    .attr("d", function (d) { return line(d.values); })
    .style("stroke", function (d) { return z(d.name); });

  // Draw the empty value for every point
  var points = gl1.selectAll('.points')
    .data(trends)
    .enter()
    .append('g')
    .attr('class', 'points')
    .append('text');

  // Draw the circle
  trend
    .style("fill", "#FFF")
    .style("stroke", function (d) { return z(d.name); })
    .selectAll("circle.line")
    .data(function (d) { return d.values })
    .enter()
    .append("circle")
    .attr("r", 5)
    .style("stroke-width", 3)
    .attr("cx", function (d) { return x(d.year); })
    .attr("cy", function (d) { return y(d.total); });

  gl1.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  // append the circle at the intersection               // **********

  var focus = svgl1.append("g")                                // **********
  .attr("class", "focus")
  .style("display", "none");                             // **********

  focus.append('line')                                 // **********
    .attr('class', 'x-hover-line hover-line')
    .attr("y1", 0)
    .attr("y2", height);

  gl1.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y)); // Create an axis component with d3.axisL

  // g.append("g")
  //     .attr("class", "axis axis--y")
  //     .call(d3.axisLeft(y).ticks(10, "%"))
  //   .append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 0)
  //     .attr("dy", "0.71em")
  //     .attr("text-anchor", "end")
  //     .text("");

  svgl1.append('rect')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("mousemove", mousemove);

  var years = data.map(function (name) { return x(name.year); });

  var ticks = data.map(function (d) {
    return d.year
  });
  function mouseover() {
    focus.style("display", null);
    d3.selectAll('.points text').style("display", null);
  }
  function mouseout() {
    focus.style("display", "none");
    d3.selectAll('.points text').style("display", "none");
  }
  function mousemove() {

    var tickPos = x.domain();
    var m = d3.mouse(this),
      lowDiff = 1e99,
      xI = null;
    for (var i = 0; i < tickPos.length; i++) {
      var diff = Math.abs(m[0] - x(tickPos[i]));
      if (diff < lowDiff) {
        lowDiff = diff;
        xI = i;
      }
    }

    var xz = x(tickPos[xI])+40;
    focus.attr("transform", "translate(" + xz + ",0)");
    d3.selectAll('.points text')
      .attr('x', function (d) { return 10+x(tickPos[xI]); })
      .attr('y', function (d) {  return 20+y(d.values[xI].total); })
      .text(function (d) { return d.values[xI].total; })
      .style('fill', function (d) { return z(d.name); });
  }

});
