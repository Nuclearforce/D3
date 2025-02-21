import {
    json
    ,csv
} from 'd3';
import { feature } from 'topojson';
 
export const loadAndProcessData=()=>
Promise.all([
    csv('https://vizhub.com/curran/datasets/un-population-estimates-2017-medium-variant.csv'),
    json('https://unpkg.com/visionscarto-world-atlas@0.0.4/world/50m.json')])
    .then(([unData, topojsonData])=>{
        //console.log(unData);
    const rowById=unData.reduce((accumulator,d)=>{
        accumulator[d['Country code']]=d;
        return accumulator;
    },{});

    const countries = feature(topojsonData,topojsonData.objects.countries);

    countries.features.forEach(d=>{
        Object.assign(d.properties, rowById[+d.id]);
        
    });

    const featuresWithPopulation = countries.features
        .filter(d => d.properties['2018'])
        .map(d => {d.properties['2018']=+d.properties['2018'].replace(/ /g,'')*1000;
        return d;
        });

    return {
        features: countries.features,
        featuresWithPopulation
    };
});