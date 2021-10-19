    function loadData() {
        //  d3.json("../grocery.json", function(data) {
        // console.log(data);
        // });

        var width = 960,
            height = 1160;

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

        d3.json("../uk.json", function(uk) {
            // <!-- Returns the GeoJSON Feature or FeatureCollection for the specified object
            //  in the given topology. If the specified object is a string, it is treated as topology.objects[object]. 
            //  Then, if the object is a GeometryCollection, a FeatureCollection is returned, and each geometry in the 
            //  collection is mapped to a Feature. Otherwise, a Feature is returned. The returned feature is a shallow copy 
            //  of the source object: they may share identifiers, bounding boxes, properties and coordinates.
            // -->


            var subunits = topojson.feature(uk, uk.objects.subunits);

            // <!-- mercator is a type of projection -->
            // <!-- Aparna working code -->
            // var projection = d3.geo.mercator()
            //         .center([-5, 50])
            //         .scale(2000)
            //         .translate([width/2,height/2]);

            // var path = d3.geo.path()
            // .projection(projection);

            var projection = d3.geo.albers()
            .center([0,55.4])
            .rotate([4.4,0])
            .parallels([50,60])
            .scale(5000)
            .translate([width/2,height/2]);

            var path = d3.geo.path()
            .projection(projection)
            .pointRadius(5);


            // <!-- Gets or sets the bound data for each selected element.
            //  Unlike selection.data, this method does not compute a join and does not affect indexes
            //   or the enter and exit selections.
            // -->

            svg.append("path")
                .datum(subunits)
                .attr("d", path);

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
            
            svg.selectAll(".subunit-label")
                .data(topojson.feature(uk,uk.objects.subunits).features)
                .enter().append("text")
                .attr("class", function(d) {return "subunit-label " + d.id; })
                .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .text(function(d) { return d.properties.name; });                    


            //check this code there is problem after this
            var test_objects_places = {
                type: "GeometryCollection",
                geometries: [
                    {
                        type: "Point",
                        coordinates: [6914,5997], // Dundee
                        properties: {
                            name: "Dundee"
                        }
                    }
                ]
            };
            // projection(test_objects_places.geometries[0].coordinates
            // test_objects_places.geometries[0].properties.name;

            svg.append("path")
                .datum(topojson.feature(uk,uk.objects.places))
                .attr("d", path)
                .attr("class", "place");

            svg.selectAll(".place-label")
                .data(topojson.feature(uk, uk.objects.places).features)
                .enter().append("text")
                .attr("class", "place-label")
                .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
                .attr("dy", ".35em")
                .text(function(d) { return d.properties.name; });


            svg.selectAll(".place-label")
                .attr("x", function(d) {return d.geometry.coordinates[0] > -1 ? 6: -6;})
                .style("text-anchor", function(d) {return d.geometry.coordinates[0] > -1 ? "start": "end";});


    });
}

window.onload = loadData;