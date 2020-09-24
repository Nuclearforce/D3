import { select
    ,geoPath
    ,geoNaturalEarth1
    ,zoom
    ,event
    ,geoCentroid
    ,scaleSqrt
    ,max
    ,format
} from 'd3';
import { loadAndProcessData } from './loadAndProcessData'; 
import {sizeLegend} from './sizeLegend';

const svg=select('svg');
 
const projection = geoNaturalEarth1();
const pathGenerator = geoPath().projection(projection);
const sizeScale = scaleSqrt();
const radiusValue = d=> d.properties['2018'];

const g = svg.append('g');

const colorLegendG = svg.append('g')
    .attr('transform',`translate(30,300)`);

g.append('path')
    .attr('class','sphere')
    .attr('d',pathGenerator({type:'Sphere'}));

svg.call(zoom().on('zoom',()=>{
    g.attr('transform',event.transform);
}));

const populationFormat = format(',');

loadAndProcessData().then(countries=>{

    sizeScale
        .domain([0,max(countries.features,radiusValue)])
        .range([0,33]);

    g.selectAll('path')
        .data(countries.features)
        .enter().append('path')
            .attr('class','country')
            .attr('d', pathGenerator)
            .attr('fill',d=>d.properties['2018'] ? '#d8d8d8' : '#fec1c1')
        .append('title')
            .text(d=> isNaN(radiusValue(d))
                ? 'Missing data'
                :[
                d.properties['Region, subregion, country or area *'],
                populationFormat(radiusValue(d))
            ].join(': '));

    countries.featuresWithPopulation.forEach(d=>{
        d.properties.projected=projection(geoCentroid(d));
    }); 

    g.selectAll('circle')
    .data(countries.featuresWithPopulation)
    .enter().append('circle')
        .attr('class','country-circle')
        .attr('cx',d => d.properties.projected[0])
        .attr('cy',d => d.properties.projected[1])
        .attr('r',d=>sizeScale(radiusValue(d)));

    g.append('g')
        .attr('transform',`translate(55,220)`)
        .call(sizeLegend, {
        sizeScale,
        spacing: 40,
        textOffset:10,
        numTicks:5,
        tickFormat: populationFormat
    })
    .append('text')
        .attr('class','legend-title')
        .text('Population')
        .attr('y',-50)
        .attr('x',-20);
    });