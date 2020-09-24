(function (d3) {
    'use strict';

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

    const sizeLegend = (selection, props) =>{
        const {sizeScale
            ,spacing    
            ,textOffset
            ,numTicks
            ,circleFill
        } = props;

        const ticks = sizeScale.ticks(numTicks)
            .filter(d=>d!==0)
            .reverse();

        
        const groups = selection.selectAll('g')
                .data(ticks);

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
            .attr('r',sizeScale)
            .attr('fill',circleFill);

        groupsEnter.append('text')
        .merge(groups.select('text'))
            .text(d=>d)
            .attr('dy','0.32em')
            .attr('x',d=>sizeScale(d) + textOffset);
        
    };

    const svg=d3.select('svg');

    const colorScale=d3.scaleOrdinal()
        .domain(['apple','lemon', 'lime', 'orange'])
        .range(['#c11d1d','#eae600','green', 'orange']);

    svg.append('g')
        .attr('transform',`translate(100,150)`)
        .call(colorLegend, {
        colorScale,
        circleRadius:30,
        spacing: 80,
        textOffset:40
    });

    const sizeScale = d3.scaleSqrt()
        .domain([0,10])
        .range([0,50]);

    svg.append('g')
        .attr('transform',`translate(600,100)`)
        .call(sizeLegend, {
        sizeScale,
        spacing: 80,
        textOffset:10,
        numTicks:5,
        circleFill:'rgba(0,0,0, 0.5)'
    });

}(d3));
//# sourceMappingURL=bundle.js.map
