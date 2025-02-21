(function (d3) {
   'use strict';

   const allCaps = str => str=== str.toUpperCase();
   const isRegion = name => allCaps(name) && name !== 'WORLD';
   const parseYear = d3.timeParse('%Y');
   const melt= (unData,minYear, maxYear) =>{

       const years = d3.range(minYear,maxYear+1);
       const data = [];
       unData.forEach(d=>{
           const name = d['Region, subregion, country or area *'].replace('AND THE', '&');
           years.forEach(year => {
               const population = +d[year].replace(/ /g,'')*1000;
               const row = {
                   year:parseYear(year),
                   name,
                   population
               };
               data.push(row);
           });
       });
       return data.filter(d=>isRegion(d.name));
   };

   const loadAndProcessData=()=>
   Promise.all([
       d3.csv('https://vizhub.com/curran/datasets/un-population-estimates-2017-medium-variant.csv'),
       d3.csv('https://vizhub.com/curran/datasets/un-population-estimates-2017.csv')])
       .then(([unDataMediumVariant, unDataEstimates])=>{
           return melt(unDataEstimates,1950,2014)
               .concat(melt(unDataMediumVariant,2015,2100));

      
   });

   const colorLegend = (selection, props) =>{
       const {colorScale
           ,circleRadius
           ,spacing    
           ,textOffset
       } = props;

       const groups = selection.selectAll('g')
               .data(colorScale.domain());

       const groupsEnter = groups
           .enter().append('g')
           .attr('class','tick');

       groupsEnter.merge(groups)
               .attr('transform',(d,i)=>
                   `translate(0,${i*spacing})`
               );
       groups.exit().remove();
       
       groupsEnter.append('circle')
       .merge(groups.select('circle'))
           .attr('r',circleRadius)
           .attr('fill',colorScale);

       groupsEnter.append('text')
       .merge(groups.select('text'))
           .text(d=>d)
           .attr('dy','0.32em')
           .attr('x',textOffset);
       };

   const svg = d3.select('svg');
     
     const width = +svg.attr('width');
     const height = +svg.attr('height');
     
     const render = data => {
       const title = 'Population over time by region';
       
       const xValue = d => d.year;
       const xAxisLabel = 'Time';
       
       const yValue = d => d.population;
       const yAxisLabel = 'Population';
       
       const colorValue = d => d.name;
       
       const margin = { top: 60, right: 210, bottom: 88, left: 105 };
       const innerWidth = width - margin.left - margin.right;
       const innerHeight = height - margin.top - margin.bottom;
       
       const xScale = d3.scaleTime()
         .domain(d3.extent(data, xValue))
         .range([0, innerWidth]);
       
       const yScale = d3.scaleLinear()
         .domain(d3.extent(data, yValue))
         .range([innerHeight, 0])
         .nice();
       
       const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
       
       const g = svg.append('g')
         .attr('transform', `translate(${margin.left},${margin.top})`);
       
       const xAxis = d3.axisBottom(xScale)
         .tickSize(-innerHeight)
         .tickPadding(15);

       const yAxisTickFormat = number =>
         d3.format('.2s')(number)
           .replace('G','B')
           .replace('.0','');
           
       const yAxis = d3.axisLeft(yScale)
         .tickSize(-innerWidth)
         .tickFormat(yAxisTickFormat)
         .tickPadding(10);
       
       const yAxisG = g.append('g').call(yAxis);
       yAxisG.selectAll('.domain').remove();
       
       yAxisG.append('text')
           .attr('class', 'axis-label')
           .attr('y', -60)
           .attr('x', -innerHeight / 2)
           .attr('fill', 'black')
           .attr('transform', `rotate(-90)`)
           .attr('text-anchor', 'middle')
           .text(yAxisLabel);
       
       const xAxisG = g.append('g').call(xAxis)
         .attr('transform', `translate(0,${innerHeight})`);
       
       xAxisG.select('.domain').remove();
       
       xAxisG.append('text')
           .attr('class', 'axis-label')
           .attr('y', 80)
           .attr('x', innerWidth / 2)
           .attr('fill', 'black')
           .text(xAxisLabel);
       
       const lineGenerator = d3.line()
         .x(d => xScale(xValue(d)))
         .y(d => yScale(yValue(d)))
         .curve(d3.curveBasis);
       
       const lastYValue = d =>
         yValue(d.values[d.values.length - 1]);
       
       const nested = d3.nest()
         .key(colorValue)
         .entries(data)
         .sort((a, b) =>
           d3.descending(lastYValue(a), lastYValue(b))
         );
       
       //console.log(nested);
       
       colorScale.domain(nested.map(d => d.key));
       
       g.selectAll('.line-path').data(nested)
         .enter().append('path')
           .attr('class', 'line-path')
           .attr('d', d => lineGenerator(d.values))
           .attr('stroke', d => colorScale(d.key));
       
       g.append('text')
           .attr('class', 'title')
           .attr('y', -10)
           .text(title);
       
       svg.append('g')
         .attr('transform', `translate(780,121)`)
         .call(colorLegend, {
           colorScale,
           circleRadius: 13,
           spacing: 50,
           textOffset: 17
         });
     };
     
     loadAndProcessData()
       .then(render);

}(d3));
//# sourceMappingURL=bundle.js.map
