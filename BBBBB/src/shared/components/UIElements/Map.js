import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = props => {
  //DOM要素を取得するためにreactではuseRefを使用するのがsmart
  const mapRef = useRef();

  //jsxがrenderingされたあとに実行(useRefがjsxコードestablishされてから実行されないといけない)
  const { center, zoom } = props;
  useEffect(() => {
    //init google map api(where should it be rendered)
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });
    //config marker position
    new window.google.maps.Marker({
      position: center,
      map: map,
    });
  }, [center, zoom]);
  return (
    <div
      //useRefの返り値をsetしてbind
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};
export default Map;
