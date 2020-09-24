(function (d3) {
  'use strict';

  const svg=d3.select('svg');
  const width = document.body.clientWidth;
  const height = document.body.clientHeight;

  svg    
      .attr('width',width)
      .attr('height',height)
    .append('rect')
      .attr('width',width)
      .attr('height',height)
      .attr('rx',40);

}(d3));
//# sourceMappingURL=bundle.js.map
