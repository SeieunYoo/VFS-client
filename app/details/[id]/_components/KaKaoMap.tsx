"use client";

import { useEffect, useRef } from "react";

interface KakaoMapProps {
  location: string;
  latitude: number;
  longitude: number;
}

export const KakaoMap = ({ location, latitude, longitude }: KakaoMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const apiKey: string | undefined = process.env.NEXT_PUBLIC_KAKAO_API_KEY;

  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          if (mapContainerRef.current) {
            const coords = new window.kakao.maps.LatLng(latitude, longitude);

            const mapOptions = {
              center: coords,
              level: 3,
            };

            const map = new window.kakao.maps.Map(
              mapContainerRef.current,
              mapOptions
            );

            const marker = new window.kakao.maps.Marker({
              position: coords,
              map: map,
            });

            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:5px;">${location}</div>`,
            });

            window.kakao.maps.event.addListener(marker, "click", () => {
              infowindow.open(map, marker);
            });

            map.setCenter(coords);
          }
        });
      }
    };

    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    document.head.appendChild(script);

    script.onload = loadKakaoMap;

    return () => {
      document.head.removeChild(script);
    };
  }, [apiKey, latitude, location, longitude]);

  return (
    <div
      id={location}
      ref={mapContainerRef}
      style={{ width: "300px", height: "200px" }}
    ></div>
  );
};
