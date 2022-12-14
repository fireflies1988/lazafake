import React from "react";

function GoogleMap({ style, address }) {
  return (
    <iframe
      title="map"
      style={style}
      loading="lazy"
      allowfullscreen
      referrerpolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${address}`}
    />
  );
}

export default GoogleMap;
