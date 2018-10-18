import './load.js';

import '../stylesheets/leaflet/leaflet.css';

import Vue from 'vue';

/**
 * 初始化地图
 */
export let map = null;
export const initMap = function (id, type) {
  let mapConfig = {
    'crs': 'bepsg3857',
    'init_level': 5,
    'init_center': '106.500711, 37.46694',
    'baseLayer': {
      'type': 'baidu',
      'style': 'dark'
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
  let numHtml = '';
  if(data.num !== 0){
    numHtml = `<span class="num">${data.num}</span>`;
  }else{
    numHtml = `<span class="num-no"></span>`;
  }
  var marker = L.divIcon({
    className: `my-div-icon ${className}`,
    html: `<div>
            ${numHtml}
            <span class="circle"></span>
            <span class="name">${data.name}</span>
          </div>`,
    iconAnchor: [25, 23]
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
