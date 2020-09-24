import { select
    ,csv
    ,scaleLinear
    ,extent
    ,axisLeft
    ,axisBottom
    ,scaleTime
    ,line
    ,curveBasis
} from 'd3';

const svg=select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {

    const xValue=d=> d.timestamp;
    const xAxisLabel='Time';
    const yValue=d => d.temperature;
    const yAxisLabel='Temperature';
    const margin = {top:60, right:40, bottom:90, left:105};
    const innerWidth=width - margin.left - margin.right;
    const innerHeight=height - margin.top - margin.bottom;
    const circleRadius=6;
    const title='Cars: Horsepower vs. Weight'
    

    const xScale = scaleTime()
        .domain(extent(data,xValue))
        .range([0, innerWidth])
        .nice();

    const yScale = scaleLinear()
        .domain(extent(data,yValue))
        .range([innerHeight,0])
        .nice();

    const g = svg.append('g')
        .attr('transform',`translate(${margin.left},${margin.top})`);


    const xAxis=axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(15);

    const yAxis = axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickPadding(15);

    g.append('g')
        .call(yAxis)
        .selectAll('.domain')
            .remove();

    const yAxisG = g.append('g').call(yAxis);
    yAxisG.selectAll('.domain').remove();

    yAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('y',-60)
    .attr('x',-innerHeight/2)
    .attr('fill','black')
    .attr('transform',`rotate(-90)`)
    .attr('text-anchor','middle')
    .text(yAxisLabel);

    const xAxisG = g.append('g').call(xAxis)
        .attr('transform',`translate(0,${innerHeight})`);
        
    xAxisG.select('.domain')
            .remove();

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y',75)
        .attr('x',innerWidth/2)
        .attr('fill','black')
        .text(xAxisLabel);


    const lineGenerator = line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
        .curve(curveBasis);

    g.append('path')
        .attr('class','line-path')
        .attr('d', lineGenerator(data));

    g.selectAll('circle').data(data)
        .enter().append('circle')
            .attr('cy',d => yScale(yValue(d)))
            .attr('cx',d => xScale(xValue(d)))
            .attr('r',circleRadius);

    g.append('text')
        .attr('class', 'title')
        .attr('y',-10)
        .text(title);
};

csv("https://vizhub.com/curran/datasets/temperature-in-san-francisco.csv")
    .then( data => {
    data.forEach(d => {
        d.temperature = +d.temperature;
        d.timestamp = new Date(d.timestamp);
    });
    render(data);
});
