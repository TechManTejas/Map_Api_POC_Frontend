import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoidGVqYXMtdmFpai1zYW5nbmFrIiwiYSI6ImNsY2FzdmNiMTB4YnAzcWxoNXJpcWlwbTMifQ.7KVRTljFZ_9pPG1GP--xDw';

var markers = [];

const App = () => {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(73.8465579312512);
  const [lat, setLat] = useState(18.650317441227628);
  const [zoom, setZoom] = useState(12);

  const [radius, setRadius] = useState(3)

  function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }
      return dist;
    }
  }

  var createGeoJSONCircle = function (center, radiusInKm, points) {
    if (!points) points = 64;

    var coords = {
      latitude: center[1],
      longitude: center[0]
    };

    var km = radiusInKm;

    var ret = [];
    var distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
    var distanceY = km / 110.574;

    var theta, x, y;
    for (var i = 0; i < points; i++) {
      theta = (i / points) * (2 * Math.PI);
      x = distanceX * Math.cos(theta);
      y = distanceY * Math.sin(theta);

      ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);

    return {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [ret]
          }
        }]
      }
    };
  };

  function setMarker(e) {
    console.log("WHAT ")
    map.current.getSource('polygon').setData(createGeoJSONCircle([e.lngLat.lng, e.lngLat.lat], radius).data);
    markers.forEach((marker) => {
      if(distance(
        marker.getLngLat().lat, marker.getLngLat().lng, 
        e.lngLat.lat, e.lngLat.lng, "K"
      )>3)
        marker.remove()
    })
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
    });

  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    
    map.current.on('load',() => {

      map.current.addSource("polygon", createGeoJSONCircle([0, 0], radius));

      map.current.addLayer({
        "id": "polygon",
        "type": "fill",
        "source": "polygon",
        "layout": {},
        "paint": {
          "fill-color": "red",
          "fill-opacity": 0.2
        }
      });
    });
    
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on('click', (e) => {
      console.log(e.lngLat);
      var marker = new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map.current)
      markers.push(marker)
    });

    map.current.on('contextmenu', (e) => {
      setMarker(e)
    });
  },[]);

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>

      <div className="absolute font-bold z-10 bg-slate-200" style={{top:"45px", left:"15px"}}>
        Radius: 
        <input className='m-1 h-6' type='number' value={radius} onChange={(e) => setRadius(e.target.value)} />
      </div>

      <div ref={mapContainer} className="h-screen overflow-y-hidden" />
      
      
    </div>
  );
}
export default App;