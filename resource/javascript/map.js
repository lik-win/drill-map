import './load.js';

import '../stylesheets/leaflet/leaflet.css';

import { baseConfig } from "./config.default";

/**
 * 初始化地图
 */
export let map = null;
export const initMap = function (id, type) {
  let mapConfig = {
    'crs': 'bepsg3857',
    'init_level': baseConfig.map.level,
    'init_center': baseConfig.map.center,
    'baseLayer': {
      'type': 'baidu',
      'style': 'normal'
    }
  };
  let definedCRSs = {
    'bepsg3857': L.CRS.BEPSG3857,
    'epsg3395': L.CRS.EPSG3395,
    'epsg3857': L.CRS.EPSG3857,
    'epsg4326': L.CRS.EPSG4326,
    'earth': L.CRS.Earth,
    'simple': L.CRS.Simple
  };
  let mapOptions = {
    'renderer': L.canvas(),
    'crs': definedCRSs[mapConfig.crs],
    'minZoom': 3,
    'attributionControl': false,
    'zoomControl': false,
    'scalePosition': 'bottomleft',
    'zoomPosition': 'bottomleft'
  };
  let mapOptions2 = {
    'renderer': L.svg(),
    'crs': definedCRSs[mapConfig.crs],
    'minZoom': 3,
    'attributionControl': false,
    // 'drawControl': true,
    'zoomControl': false,
    'scalePosition': 'bottomleft',
    'zoomPosition': 'bottomright'
  };
  if (type === 'svg') {
    map = new L.map(id, mapOptions2);
  } else {
    map = new L.map(id, mapOptions);
  }
  let baseLayerConfig = mapConfig.baseLayer;
  let baseLayer = new L.TileLayer.BaiduLayer(baseLayerConfig);
  map.addLayer(baseLayer);
  map.baseLayer = baseLayer;
  let centerPoint = mapConfig.init_center.split(',');
  map.setView([centerPoint[1], centerPoint[0]], mapConfig.init_level);
  L.control.scale({
    'position': mapOptions['scalePosition'], 'metric': true, 'imperial': false
  }).addTo(map);
  /*L.control.zoom({
    'position': mapOptions['zoomPosition'], 'zoomInTitle': '放大', 'zoomOutTitle': '缩小'
  }).addTo(map);*/
  // 隐藏底图
  document.getElementsByClassName('leaflet-layer')[0].style.display = 'none';
  return map;
};

export const createDomMarker = function (className, data) {
  var marker = L.divIcon({
    className: `my-div-icon ${className}`,
    html: `<div>
            <span class="circle" style="background: ${baseConfig.citiesMarkerCircleColor}"></span>
            <span class="name" style="color: ${baseConfig.citiesMarkerNameColor}">${data.name}</span>
          </div>`,
    iconAnchor: [25, 3]
  });
  return L.marker(data.lnglat, {icon: marker});
};

export const addFeatureGroup = function (group) {
  if (!map.hasLayer(group)) {
    map.addLayer(group);
  }
};

export const removeFeatureGroup = function (group) {
  if (map.hasLayer(group)) {
    map.removeLayer(group);
  }
};

export default {
  initMap,
  addFeatureGroup,
  removeFeatureGroup,
  createDomMarker
};
