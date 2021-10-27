function loadData() {
    //  d3.json("../grocery.json", function(data) {
    // console.log(data);
    // });

    var width = 960,
        height = 1160;

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.json("../uk.json", function (uk) {
        // <!-- Returns the GeoJSON Feature or FeatureCollection for the specified object
        //  in the given topology. If the specified object is a string, it is treated as topology.objects[object]. 
        //  Then, if the object is a GeometryCollection, a FeatureCollection is returned, and each geometry in the 
        //  collection is mapped to a Feature. Otherwise, a Feature is returned. The returned feature is a shallow copy 
        //  of the source object: they may share identifiers, bounding boxes, properties and coordinates.
        // -->


        var subunits = topojson.feature(uk, uk.objects.subunits);

        // <!-- albers is a type of projection -->
        // <!-- Aparna working code -->

        var projection = d3.geo.albers()
            .center([0, 55.4])
            .rotate([4.4, 0])
            .parallels([25, 40])
            .scale(5000)
            .translate([width / 2, height / 2]);

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
            .attr("class", function (d) { return "subunit " + d.id; })
            .attr("d", path);

        svg.append("path")
            .datum(topojson.mesh(uk, uk.objects.subunits, function (a, b) { return a !== b && a.id !== "IRL"; }))
            .attr("d", path)
            .attr("class", "subunit-boundary");

        svg.append("path")
            .datum(topojson.mesh(uk, uk.objects.subunits, function (a, b) { return a === b && a.id === "IRL"; }))
            .attr("d", path)
            .attr("class", "subunit-boundary IRL");

        svg.selectAll(".subunit-label")
            .data(topojson.feature(uk, uk.objects.subunits).features)
            .enter().append("text")
            .attr("class", function (d) { return "subunit-label " + d.id; })
            .attr("transform", function (d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function (d) { return d.properties.name; });

        var cityData = [];
        // numTowns = Math.floor((Math.random() * 50) + 1);

        numTownsString = getCookie("NumberOfTowns");
        if (numTownsString !== null) {
            numTowns = parseInt(numTownsString)
            document.getElementById("numberInput").value = numTowns;
        }
        else {
            numTowns = 25;
            document.getElementById("numberInput").value = numTowns;
        }

        d3.json("http://35.233.33.123/Circles/Towns/" + numTowns, function (data) {
            var jsonString = JSON.stringify(data);
            var urlData = JSON.parse(jsonString);
            for (var j = 0; j < urlData.length; j++) {

                console.log(urlData[j].Town + ":" + urlData[j].Population + ":" + urlData[j].lng + ":" + urlData[j].lat);

                cityDataAdd = {
                    name: urlData[j].Town,
                    population: urlData[j].Population,
                    lat: urlData[j].lat,
                    long: urlData[j].lng
                };
                cityData[j] = cityDataAdd;
            }

            console.log("City JSON data:", cityData);
            svg
                .selectAll("myCircles")
                .data(cityData)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return projection([d.long, d.lat])[0] })
                .attr("cy", function (d) { return projection([d.long, d.lat])[1] })
                .attr("r", 5)
                .style("fill", "#f71818")
                .attr("stroke", "#f71818")
                .attr("stroke-width", 3)
                .attr("fill-opacity", .4)
                .append("title").text(function (d) { return ( "Population:" +d.population); });

            console.log("uk.feature:", topojson.feature(uk, uk.objects.places))

            svg.selectAll(".place-label")
                .data(cityData)
                .enter().append("text")
                .attr("class", "place-label")
                .attr("transform", function (d) { return "translate(" + projection([d.long, d.lat]) + ")"; })
                .attr("dy", ".35em")
                .text(function (d) { return d.name; });

            svg.selectAll(".place-label")
                .attr("x", function (d) { return d.long > -1 ? 6 : -6; })
                .style("text-anchor", function (d) { return ([d.long, d.lat]) > -1 ? "start" : "end"; });

            
        });
    });

}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

window.onload = loadData;