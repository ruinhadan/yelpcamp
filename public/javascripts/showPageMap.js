mapboxgl.accessToken = mapToken;
const lnglat = Array.from(coordinates.split(',')).map(x => parseFloat(x))
const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: lnglat,
        zoom: 10
});

new mapboxgl.Marker()
        .setLngLat(lnglat)
        .addTo(map)