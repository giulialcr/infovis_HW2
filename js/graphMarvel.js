// grafo hero to hero

function GraphMarvel(id, graph) {

    // dimensions

    var height = 750;
    var width = window.innerWidth;

    var margin = {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
    }
    var radius = 6;

    // var c10=["blue","orange","green","indianred","purple","maroon","#000000 "]
    //var c10=["#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824","#000000"] //green

    //var c10=["#000000","#005824","#238b45","#41ae76","#66c2a4","#99d8c9","#ccece6"] //green crescente
    //var c10=["#9999ff","#6666ff","#3333ff","#0000e6","#000099","#00004d","#00001a"] ////green decrescente
    var c10 = ["#000000", "#800026", "#bd0026", "#fc4e2a", "#fd8d3c", "#febd67", "#ffeda0"] //red decrescente


    // create an svg to draw in
    var svg = d3.select("#div2")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append('g')
        .attr('transform', 'translate(' + margin.top + ',' + margin.left + ')');

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    var linkWidthScale = d3.scaleLinear()
        .range([1, 10]);
    var linkStrengthScale = d3.scaleLinear()
        .range([0, 0.45]);

    var simulation = d3.forceSimulation()
        // pull nodes together based on the links between them. Distance and stregth in base al peso dell'arco
        .force("link", d3.forceLink()
            .id(function (d) {
                return d.id;
            })
            .distance(function (d) {
                return linkStrengthScale(d.weight)
            })
            .strength(function (d) {
                return linkStrengthScale(d.weight);
            }))
        // push nodes apart to space them out
        .force("charge", d3.forceManyBody()
            .strength(-100))
        // add some collision detection so they don't overlap
        .force("collide", d3.forceCollide()
            .radius(45))
        // and draw them around the centre of the space
        .force("center", d3.forceCenter(width / 2, height / 2));

    // set the nodes
    var nodes = graph.nodes;
    // links between nodes
    var links = graph.links;

    linkWidthScale.domain(d3.extent(links, function (d) {
        return d.weight;
    }));
    linkStrengthScale.domain(d3.extent(links, function (d) {
        return d.weight;
    }));

    // add the curved links to our graphic
    var link = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr('id', function (d) { return "link" + d.weight })
        .attr('stroke', function (d) {   //si colora secondo c10 array-legenda colori per peso
            return c10[d.weight - 1];
        })
        .attr('stroke-width', function (d) {  //spessore secondo il peso
            return linkWidthScale(d.weight);
        });

 
    // add the nodes to the graphic
    var node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        //chiamata per i metodi drag
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));


    node.append("image")
        .attr("xlink:href", function (d) { return d.img; })
        .attr("x", function (d) { return -25; })
        .attr("y", function (d) { return -25; })
        .attr("height", 35)
        .attr("width", 35)
        .on("mouseover", mouseOver(.1))
        .on("mouseout", mouseOut)
        .on('click', function (d) {
            if (d.type == "hero") {
                d3.select("h1").html(d.name);

                d3.select("h3").html("Real name: " + d.realname);

            }

        });


    // add a label to each node
    node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.name;
        })
        .style("stroke", "black")
        .style("stroke-width", 0.5)
        .style("fill", "black");

    // add the nodes to the simulation and
    // tell it what to do on each tick
    simulation
        .nodes(nodes)
        .on("tick", ticked);

    // add the links to the simulation
    simulation
        .force("link")
        .links(links);

    // on each tick, update node and link positions
    function ticked() {
        link.attr("d", positionLink);
        node.attr("transform", positionNode);
    }

    // links are drawn as curved paths between nodes,
    // through the intermediate nodes
    function positionLink(d) {
        var offset = 15; ///30 to curved

        var midpoint_x = (d.source.x + d.target.x) / 2;
        var midpoint_y = (d.source.y + d.target.y) / 2;

        var dx = (d.target.x - d.source.x);
        var dy = (d.target.y - d.source.y);

        var normalise = Math.sqrt((dx * dx) + (dy * dy));

        var offSetX = midpoint_x + offset * (dy / normalise);
        var offSetY = midpoint_y - offset * (dx / normalise);

        return "M" + d.source.x + "," + d.source.y +
            "S" + offSetX + "," + offSetY +
            " " + d.target.x + "," + d.target.y;
    }

    // move the node based on forces calculations
    function positionNode(d) {
        // keep the node within the boundaries of the svg
        if (d.x < 0) {
            d.x = 0
        };
        if (d.y < 0) {
            d.y = 0
        };
        if (d.x > width) {
            d.x = width
        };
        if (d.y > height) {
            d.y = height
        };
        return "translate(" + d.x + "," + d.y + ")";
    }


    //metodi per il drag dei nodi, attivi solo se selezionata la checkbox dragOk
    function dragstarted(d) {
        if (dragOk){
            if (!d3.event.active) simulation.alphaTarget(0.7).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
       
    }

    function dragged(d) {
        if (dragOk){
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }}

    function dragended(d) {
        if (dragOk){
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }}

    // build a dictionary of nodes that are linked
    var linkedByIndex = {};
    links.forEach(function (d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });

    var linkedByWeight = {};
    links.forEach(function (d) {
        linkedByWeight[d.source.id + "," + d.target.id] = d.weight;
    });

    // check the dictionary to see if nodes are linked
    function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }


    // fade nodes on hover
    function mouseOver(opacity) {
        return function (d) {

            // check all other nodes to see if they're connected
            // to this one. if so, keep the opacity at 1, otherwise
            // fade
            node.style("opacity", function (o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity;
                return thisOpacity;
            });
            node.style("opacity", function (o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity;
                return thisOpacity;
            });
            // also style link accordingly
            link.style("stroke-opacity", function (o) {
                return o.source === d || o.target === d ? 1 : opacity;
            });
            link.style("stroke", function (o) {
                return o.source === d || o.target === d ? c10[o.weight - 1] : "#cccccc";  //se connesso si colora secondo c10(array di colori secondo peso), altrimenti grigio
            });
        };
    }

    function mouseOut() {
        node.style("opacity", 1);
        node.style("opacity", 1);
        link.style("stroke-opacity", 1);
        link.style("stroke", "#cccccc");
    }

var dragOk;
// This function is gonna able/unable the dragging of the graph
function update1(){
    if(document.getElementById("dragOk").checked){
        dragOk=true;
      }else{
        dragOk=false;
      }
  }

  // When the checkbox to able the drag change, I run the update function
  d3.select("#dragOk").on("change",update1);

  // And I initialize it at the beginning
  update1()

}//graphMarvel hero to hero
