import { select
    ,range
} from 'd3';
import {fruitBowl} from './fruitBowl';

const svg=select('svg');

const makeFruit = type => ({ 
    type,
    id: Math.random()
});

let fruits = range(5)
    .map(() => makeFruit('apple'));

let selectedFruit= null;

const setSelectedFruit = id => {
    selectedFruit = id;
    render();
};

const render=()=>{
        fruitBowl(svg, {
            fruits,
            height:+svg.attr('height'),
            setSelectedFruit,
            selectedFruit
        });
    };
render();

//eat an apple
setTimeout(()=>{
    fruits.pop();
    render();
},1000)

//replace an apple with a lemon
setTimeout(()=>{
    fruits[2].type = 'lemon';
    render();
},2000)

//eat an apple
setTimeout(()=>{
    fruits=fruits.filter((d,i)=> i != 1);
    render();
},3000)
