

maptilersdk.config.apiKey = maptilerApiKey;

    const map = new maptilersdk.Map({
      container: 'map', // container's id or the HTML element in which the SDK will render the map
      style: maptilersdk.MapStyle.VOYAGER.LIGHT,
      center: campground.geometry.coordinates, // starting position [lng, lat]
      zoom: 10 // starting zoom
    });

    const popup = new maptilersdk.Popup().setHTML(`<h4>${campground.title}</h4> <p>${campground.location}</p.`)
;


    const marker = new maptilersdk.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);
