import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = props => {
  //(1)DOM要素を取得するためにreactではuseRefを使用するのがsmart
  // (2)useRefにはrender後もsurviveする変数を定義することができる
  const mapRef = useRef();

  //jsxがrenderingされたあとに実行(useRefがjsxコードestablishされてから実行されないといけない)->useEffectを使う
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
