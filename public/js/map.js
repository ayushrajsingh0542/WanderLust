
            // let mapToken=mapToken;//defined in show.ejs
            // console.log(mapToken);
            
            mapboxgl.accessToken = 'pk.eyJ1IjoiYXl1c2gtc2luZ2giLCJhIjoiY2x5M3dvb3N6MGIxYTJrcXY1bTN1cXQ2biJ9.JgsuO-H2l7_yMUczIlA1Pg';
            // const coordinates2="<%- listing.geometry.coordinates%>";
            
            const map = new mapboxgl.Map({
                container: 'map', // container ID
                center: coordinates.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
                zoom: 12 // starting zoom
            });
            

             console.log(coordinates);

            const marker = new mapboxgl.Marker({color:"red"})
        .setLngLat(coordinates.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25})
        
        .setHTML("<p>Contact:</p><p>6392131807</p>"))
        .addTo(map);