import React, { useEffect, useRef, useState } from "react";

function GymLocator() {
  const API_KEY = "AIzaSyC9g6BtWm0PxQXGjXSDU1Yzgnu8EzXjvQQ";

  const CONFIGURATION = {
    locations: [
      {
        title: "SO14 3LS",
        address1: "英国南安普敦邮政编码: SO14 3LS",
        coords: { lat: 50.90044526176812, lng: -1.401829022090142 },
        placeId: "1",
      },
      {
        title: "SO15 3BJ",
        address1: "Freemantle, Southampton SO15 3BJ英国",
        coords: { lat: 50.91221526371706, lng: -1.4238895644180372 },
        placeId: "2",
      },
      {
        title: "SO14 2AR",
        address1: "英国南安普敦邮政编码: SO14 2AR",
        coords: { lat: 50.896945502405266, lng: -1.4050336932540985 },
        placeId: "3",
      },
      {
        title: "SO14 0YG",
        address1: "英国南安普敦邮政编码: SO14 0YG",
        coords: { lat: 50.912481969160666, lng: -1.3971051509262056 },
        placeId: "4",
      },
    ],
    mapOptions: {
      center: { lat: 38.0, lng: -100.0 },
      fullscreenControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      zoom: 4,
      zoomControl: true,
      maxZoom: 17,
      mapId: "",
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

  // 用于获取 DOM 元素的引用
  const apiLoaderRef = useRef(null);
  const locatorRef = useRef(null);
  const [address, setAddress] = useState(null);
  useEffect(() => {
    // 因为 React 不会传递 key 属性，我们手动设置 API loader 的 key 属性
    if (apiLoaderRef.current) {
      apiLoaderRef.current.setAttribute("key", API_KEY);
    }

    // 等待 <gmpx-store-locator> 自定义元素定义完毕，再调用配置方法
    customElements.whenDefined("gmpx-store-locator").then(() => {
      if (locatorRef.current) {
        // 添加事件监听，监听 "store-selected" 事件
        locatorRef.current.addEventListener("click", (event) => {
          // alert(111)
          // event.detail 中包含了所选地址的信息
          console.log("Selected store:", event);
          setAddress(event.detail);
          // 你可以把 event.detail 保存到 state，或执行其他操作
        });
        locatorRef.current.configureFromQuickBuilder(CONFIGURATION);
      }
    });
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", margin: 0 }}>
      {/* 使用 ref 来获取 API loader 实例 */}
      <gmpx-api-loader
        ref={apiLoaderRef}
        solution-channel="GMP_QB_locatorplus_v11_cABD"
      ></gmpx-api-loader>

      {/* 地图定位器 */}
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
