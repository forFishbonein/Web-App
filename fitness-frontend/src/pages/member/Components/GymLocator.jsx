import React, { useEffect, useRef, useState } from "react";
import useMemberApi from "../../../apis/member";
function GymLocator() {
  const API_KEY = "AIzaSyC9g6BtWm0PxQXGjXSDU1Yzgnu8EzXjvQQ";
  const { getFitnessCentreLocations } = useMemberApi();
  const CONFIGURATION = {
    locations: [],
    // locations: [
    //   {
    //     title: "SO14 3LS",
    //     address1: "英国南安普敦邮政编码: SO14 3LS",
    //     coords: { lat: 50.90044526176812, lng: -1.401829022090142 },
    //     placeId: "1",
    //     // ✅ 额外字段（可选）
    //     phone: "+44 1234 567890",  // 联系电话
    //     website: "https://example.com", // 官网链接
    //     rating: 4.5, // 评分（例如 Google Maps 风格的评分）
    //     category: "Gym", // 分类（如“健身房”、“游泳馆”等）
    //     hours: "Mon-Fri: 9:00 AM - 10:00 PM", // 营业时间
    //     tags: ["Fitness", "Yoga", "Weightlifting"], // 相关标签
    //     image: "https://example.com/gym-photo.jpg", // 图片链接
    //     description: "A modern gym with advanced equipment.", // 详细描述
    //   },
    //   {
    //     title: "SO15 3BJ",
    //     address1: "Freemantle, Southampton SO15 3BJ英国",
    //     coords: { lat: 50.91221526371706, lng: -1.4238895644180372 },
    //     placeId: "2",
    //   },
    //   {
    //     title: "SO14 2AR",
    //     address1: "英国南安普敦邮政编码: SO14 2AR",
    //     coords: { lat: 50.896945502405266, lng: -1.4050336932540985 },
    //     placeId: "3",
    //   },
    //   {
    //     title: "SO14 0YG",
    //     address1: "英国南安普敦邮政编码: SO14 0YG",
    //     coords: { lat: 50.912481969160666, lng: -1.3971051509262056 },
    //     placeId: "4",
    //   },
    // ],
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

  // 用于获取 DOM 元素的引用
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
      // 因为 React 不会传递 key 属性，我们手动设置 API loader 的 key 属性
      if (apiLoaderRef.current) {
        apiLoaderRef.current.setAttribute("key", API_KEY);
      }
      CONFIGURATION.locations = locations;
      // console.log("CONFIGURATION", CONFIGURATION)
      // 等待 <gmpx-store-locator> 自定义元素定义完毕，再调用配置方法
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
