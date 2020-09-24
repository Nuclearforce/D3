(function (d3) {
    'use strict';

    const colorScale=d3.scaleOrdinal()
        .domain(['apple','lemon'])
        .range(['#c11d1d','#eae600']);

    const radiusScale=d3.scaleOrdinal()
        .domain(['apple','lemon'])
        .range([50,30]);

    const xPosition = (d,i)=>i*120 + 60;

    const fruitBowl = (selection, props) =>{
        const {fruits
                ,height
                ,setSelectedFruit
                ,selectedFruit
            } = props;
        const circles = selection.selectAll('circle')
                .data(fruits, d=>d.id);
            circles.enter().append('circle')
                .attr('cx',xPosition)
                .attr('cy',height/2)
                .attr('r',0)
            .merge(circles)         
                .attr('fill',d=>colorScale(d.type))
                .attr('stroke-width',5)
                .attr('stroke', d=> d.id===selectedFruit
                    ? 'black'
                    : 'none'
                )
                .on('mouseover', d => setSelectedFruit(d.id))
                .on('mouseout', () => setSelectedFruit(null))
            .transition().duration(1000)
                .attr('cx',xPosition)
                .attr('r',d=>radiusScale(d.type));
            circles.exit()
                .transition().duration(1000)
                    .attr('r',0)
                .remove();
        };

    const svg=d3.select('svg');

    const makeFruit = type => ({ 
        type,
        id: Math.random()
    });

    let fruits = d3.range(5)
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
    },1000);

    //replace an apple with a lemon
    setTimeout(()=>{
        fruits[2].type = 'lemon';
        render();
    },2000);

    //eat an apple
    setTimeout(()=>{
        fruits=fruits.filter((d,i)=> i != 1);
        render();
    },3000);

}(d3));
//# sourceMappingURL=bundle.js.map
