    function loadData() {
         d3.json("../grocery.json", function(data) {
        console.log(data);
        });

        var width = 960,
        height = 1160;

        var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

        d3.json("../uk.json", function(uk) {
            var subunits = topojson.feature(uk, uk.objects.subunits);

            var projection = d3.geo.mercator()
            .scale(500)
            .translate([width /1.5 , height /1.5]);

            var path = d3.geo.path()
            .projection(projection);

            svg.append("path")
                .datum(subunits)
                .attr("d", path);

            var projection = d3.geo.albers()
                .center([0, 55.4])
                .rotate([4.4, 0])
                .parallels([50, 60])
                .scale(6000)
                .translate([width / 2, height / 2]);  

            svg.selectAll(".subunit")
                .data(topojson.feature(uk, uk.objects.subunits).features)
                .enter().append("path")
                .attr("class", function(d) { return "subunit " + d.id; })
                .attr("d", path);
               
            svg.append("path")
                .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; }))
                .attr("d", path)
                .attr("class", "subunit-boundary");

            svg.append("path")
                .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return a === b && a.id === "IRL"; }))
                .attr("d", path)
                .attr("class", "subunit-boundary IRL");
            
            svg.append("path")
                .datum(topojson.feature(uk, uk.objects.places))
                .attr("d", path)
                .attr("class", "place");
            //check this code there is problem after this
            svg.selectAll(".place-label")
                .data(topojson.feature(uk, uk.objects.places).features);
            //     .enter().append("text")
            //     .attr("class", "place-label")
            //     .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
            //     .attr("dy", ".35em")
            //     .text(function(d) { return d.properties.name; });

            // svg.selectAll(".place-label")
            //     .attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 2 : -2; })
            //     .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; });
    });
    // d3.json("../uk.json", function(uk) {
    //         svg.append("path")
    //             .datum(topojson.feature(uk, uk.objects.subunits))
    //             .attr("d", d3.geo.path().projection(d3.geo.mercator()));
            
    //     });
}

window.onload = loadData;