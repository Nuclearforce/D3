(function (d3) {
    'use strict';

    const colorScale=d3.scaleOrdinal()
        .domain(['apple','lemon'])
        .range(['#c11d1d','#eae600']);

    const radiusScale=d3.scaleOrdinal()
        .domain(['apple','lemon'])
        .range([80,30]);

    const fruitBowl = (selection, props) =>{
        const {fruits, height} = props;

        const bowl = selection.selectAll('rect')
            .data([null])
            .enter().append('rect')
            .attr('y',110)
            .attr('width',920)
            .attr('height',300)
            .attr('rx',150);

        const groups = selection.selectAll('g')
                .data(fruits);
        const groupsEnter = groups.enter().append('g');
        groupsEnter.merge(groups)
                .attr('transform',(d,i)=>
                    `translate(${i*180+100},${height/2})`
                );
        groups.exit().remove();
        
        groupsEnter.append('circle')
        .merge(groups.select('circle'))
            .attr('fill',d=>colorScale(d.type))
            .attr('r',d=>radiusScale(d.type));

        groupsEnter.append('text')
        .merge(groups.select('text'))
            .text(d=>d.type)
            .attr('y',120);
        };

    const svg=d3.select('svg');

    const makeFruit = type => ({ 
        type,
        id: Math.random()
    });
     
    let fruits = d3.range(5)
        .map(() => makeFruit('apple'));

        const render=()=>{
            fruitBowl(svg, {
                fruits,
                height:+svg.attr('height')
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
