import { select
    ,scaleOrdinal
    ,schemeSpectral
} from 'd3';
import { loadAndProcessData } from './loadAndProcessData'; 
import {colorLegend} from './colorLegend';
import {choroplethMap} from './ChoroplethMap.js';

const svg=select('svg');
const choroplethMapG = svg.append('g');
const colorLegendG = svg.append('g')
    .attr('transform',`translate(30,300)`);

const colorScale =  scaleOrdinal();
const colorValue = d=>d.properties.income_grp;

let selectedColorValue;
let features;

const onClick = d=>{
    selectedColorValue=d;
    render();
};

loadAndProcessData().then(countries=>{
    features=countries.features;
    render();    
});

const render=()=>{

    colorScale
        .domain(features.map(colorValue))
        .domain(colorScale.domain().sort().reverse())
        .range(schemeSpectral[colorScale.domain().length]);

    colorLegendG.call(colorLegend, {
        colorScale,
        circleRadius:8,
        spacing: 20,
        textOffset:12,
        backgroundRectWidth:235,
        onClick,
        selectedColorValue
    });

    choroplethMapG.call(choroplethMap, {
        features
        ,colorScale
        ,colorValue
        ,selectedColorValue
    });

};
