import React, { useEffect, useRef, useState } from "react";
import useMemberApi from "../../../apis/member";
function GymLocator() {
  const API_KEY = "AIzaSyC9g6BtWm0PxQXGjXSDU1Yzgnu8EzXjvQQ";
  const { getFitnessCentreLocations } = useMemberApi();
  const CONFIGURATION = {
    locations: [],
    mapOptions: {
      center: { lat: 50.0, lng: -1.0 },
      fullscreenControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      zoom: 4,
      zoomControl: true,
      maxZoom: 17,
      mapId: "defaultId",
    },
    mapsApiKey: API_KEY,
    capabilities: {
      input: true,
      autocomplete: true,
      directions: false,
      distanceMatrix: true,
      details: false,
      actions: false,
    },
  };

  // Used to obtain references to DOM elements
  const apiLoaderRef = useRef(null);
  const locatorRef = useRef(null);
  useEffect(() => {
    getFitnessCentreLocations().then(res => {
      let locations = res?.data.map((e, index) => {
        return {
          title: e?.title,
          address1: `${e?.address}
          Contact: ${e?.contactInfo}`,
          coords: { lat: e?.latitude, lng: e?.longitude },
          placeId: (index + 1) + "",
          // phont: e?.contactInfo
        };
      })
      console.log("locations information：", locations);
      // Because React does not pass the key attribute, we manually set the key attribute of the API loader
      if (apiLoaderRef.current) {
        apiLoaderRef.current.setAttribute("key", API_KEY);
      }
      CONFIGURATION.locations = locations;
      // console.log("CONFIGURATION", CONFIGURATION)
      // Wait for the custom element <gmpx-store-locator> to be defined, and then call the configuration method
      customElements.whenDefined("gmpx-store-locator").then(() => {
        if (locatorRef.current) {
          locatorRef.current.configureFromQuickBuilder(CONFIGURATION);
        }
      });
    }).catch((e) => {
      console.log(e);
    })
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", margin: 0 }}>
      {/* Use ref to obtain the API loader instance */}
      <gmpx-api-loader
        ref={apiLoaderRef}
        solution-channel="GMP_QB_locatorplus_v11_cABD"
      ></gmpx-api-loader>

      {/* Map locator */}
      <gmpx-store-locator
        ref={locatorRef}
        map-id="DEMO_MAP_ID"
        style={{
          width: "100%",
          height: "100%",
          "--gmpx-color-surface": "#fff",
          "--gmpx-color-on-surface": "#212121",
          "--gmpx-color-on-surface-variant": "#757575",
          "--gmpx-color-primary": "#1967d2",
          "--gmpx-color-outline": "#e0e0e0",
          "--gmpx-fixed-panel-width-row-layout": "28.5em",
          "--gmpx-fixed-panel-height-column-layout": "65%",
          "--gmpx-font-family-base": '"Roboto", sans-serif',
          "--gmpx-font-family-headings": '"Roboto", sans-serif',
          "--gmpx-font-size-base": "0.875rem",
          "--gmpx-hours-color-open": "#188038",
          "--gmpx-hours-color-closed": "#d50000",
          "--gmpx-rating-color": "#ffb300",
          "--gmpx-rating-color-empty": "#e0e0e0",
        }}
      ></gmpx-store-locator>
    </div>
  );
}

export default GymLocator;
