import {
    json
    ,tsv
} from 'd3';
import { feature } from 'topojson';

export const loadAndProcessData=()=>
Promise.all([
    tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
    json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')])
    .then(([tsvData, topojsonData])=>{
        console.log(tsvData);
    const rowById=tsvData.reduce((accumulator,d)=>{
        accumulator[d.iso_n3]=d;
        return accumulator;
    },{});
    console.log(rowById);
    const countries = feature(topojsonData,topojsonData.objects.countries);

    countries.features.forEach(d=>{
        Object.assign(d.properties, rowById[d.id]);
    });

    return countries;
});