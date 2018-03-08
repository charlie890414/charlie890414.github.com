// build d3 graph

var vis = d3.select(".graph")
	.append("svg:svg")
	.attr("width", width)
	.attr("height", height)
	.attr("transform", "translate(0, -100) scale(1.5)")
    .style("background", bg_color)
	.attr("pointer-events", "all")
	.call(d3.behavior.zoom().on("zoom", redraw));

function redraw() {
	console.log("here", d3.event.translate, d3.event.scale);
	vis.attr("transform","translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")"); 
}

var force = d3.layout.force()
    .gravity(.05)
    .charge(-200)
    .linkDistance(100)
    .size([height, height]);

// build arrow
vis.append("svg:defs").selectAll("marker")
    .data(["end"])
    .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 15)
        .attr("refY", 5)
        .style("fill", line_color)
        .style("opacity", 0.5)
        .attr("markerWidth", 4)
        .attr("markerHeight", 3)
        .attr("orient", "auto")
        .append("svg:path")
            .attr("d", "M 0 0 L 10 5 L 0 10 z");

// build line

var link = vis.selectAll("line")
    .data(json.links)
    .enter().append("line")
    .attr("marker-end", "url(#end)")
    .attr("stroke-width", 5)
    .attr("stroke-opacity", 0.5)
    .attr("stroke", line_color);

// build node

var node = vis.selectAll("g.node")
    .data(json.nodes)
    .enter().append("svg:g")
    .call(force.drag);

node.append("svg:circle")
    .attr("r", function(d) { return d.size + 10; })
    .style("fill", function(d) {
        if (d.style == "filled" && d.color)
            return d.color;
        else
            return node_inner_color;
    })
    .style("stroke", function(d) {
        if (d.style !== "filled") {
            if (d.color)
                return d.color;
            var num = d.name.length % 5;
            return node_default_colors[num];
        }
    })
    .style("stroke-width", 4)
    .style("opacity", 1)
    .on("mouseover", function() { d3.select(this).style("opacity", 0.8); })
    .on("mouseout", function() { d3.select(this).style("opacity", 1); });

node.append("svg:text")
    .attr("text-anchor", "middle") 
    .attr("fill", text_color)
    .style("pointer-events", "none")
    .attr("font-size", function(d) { return (d.size + 15) + "px"; })
    .attr("font-weight", function(d) {
            return "500";})
    .text( function(d) { return d.name; });

// tooltipster
node.each(function(d, id){
    $(this).tooltipster({
        content: d.desc,
        contentAsHTML: true,
        theme: 'tooltipster-shadow',
        offsetY: -20,
        delay: 150,
        maxWidth: 500,
        position: "left",
        animation: "fade",
        interactive: true});
});


force
    .nodes(json.nodes)
    .links(json.links)
    .on("tick", tick)
    .start();

function tick() {
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")";});

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
}
