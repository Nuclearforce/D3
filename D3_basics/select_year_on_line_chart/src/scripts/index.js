import {
  select,
  scaleOrdinal,
  nest,
  schemeCategory10,
  descending,
} from 'd3';

import { colorLegend } from './colorLegend';
import {
  loadAndProcessData,
} from './loadAndProcessData';
import { lineChart } from './lineChart';

const svg = select('svg');
const lineChartG = svg.append('g');
const colorLegendG = svg.append('g');

const width = +svg.attr('width');
const height = +svg.attr('height');

// State
let selectedYear = 2018;
let data;

const setSelectedYear = year => {
  selectedYear = year;
  render();
};

const render = () => {
  const yValue = d => d.population;
  const colorValue = d => d.name;
  const colorScale = scaleOrdinal(schemeCategory10);
  
  const lastYValue = d =>
    yValue(d.values[d.values.length - 1]);
  
  const nested = nest()
    .key(colorValue)
    .entries(data)
    .sort((a, b) =>
      descending(lastYValue(a), lastYValue(b))
    );
  
  colorScale.domain(nested.map(d => d.key));
  
  lineChartG.call(lineChart, {
    colorScale,
    colorValue,
    yValue,
    title: 'Population over Time by Region',
    xValue: d => d.year,
    xAxisLabel: 'Time',
    circleRadius: 6,
    yAxisLabel: 'Population',
    margin: {
      top: 60,
      right: 280,
      bottom: 88,
      left: 105
    },
    width,
    height,
    data,
    nested,
    selectedYear,
    setSelectedYear
  });
  
  colorLegendG
    .attr('transform', `translate(700,110)`)
    .call(colorLegend, {
      colorScale,
      circleRadius: 10,
      spacing: 55,
      textOffset: 15
    });
};

loadAndProcessData()
  .then((loadedData) => {
    data = loadedData;
    render();
  });