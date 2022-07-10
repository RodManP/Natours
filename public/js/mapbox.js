/* eslint-disable */

var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibWFudWVscm9kIiwiYSI6ImNsMnFmM3c2cDJvZ3czbW83NXkzZTQzanIifQ.N81ahNDq2iJSRMO62p1jcA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/manuelrod/cl5ckcgvp000214oua5dt834o',
    scrollZoom: false,
    //   center: [-118.11349, 34.117 ],
    //   zoom: 6,
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // add marker
    new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // add Popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //extends map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 200,
      right: 200,
    },
  });
};
