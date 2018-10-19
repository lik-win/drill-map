<template>
  <div id="LeafletMap"></div>
</template>
<script>
  import _ from 'lodash';
  import {baseConfig} from "../../resource/javascript/config.default";
  import {
    initMap,
    addFeatureGroup,
    removeFeatureGroup,
    createDomMarker
  } from '../../resource/javascript/map';
  import {provinces} from '../../resource/javascript/data/position';
  import {chinaData} from '../../resource/javascript/data/data';

  export default {
    data() {
      return {
        map: null,
        curLevel: 0, // 全国 0， 省 1, 市 2，县 3， 地图 4
        provinceFitBoundsRegion: null,
        cityFitBoundsRegion: null,
        polylineClickTime: null,
        polygonClickTime: null,
        activeFeature: null,
        activePolylineFeature: null,
        activePolygonFeature: null,
        hoverMarkerLayers: null,
        hoverPolygonLayers: null,
        hoverPolygonFeatures: []
      };
    },
    mounted() {
      this.map = initMap('LeafletMap');
      this.map.clickTimeout = null;
      this.map.regionGroup = {};
      this.map.lineGroup = {};
      this.map.canvasLayer = new L.R.Canvas(this.map, {
        zIndex: 999,
        showAll: true
      });
      this.map.on('click', (e) => {
        this.clearSelectMarekr();
        this.clearSelectPolygon();
        this.clearSelectPolyline();
        this.$emit('map-click');
      });
    },
    methods: {
      renderChinaPolygon() {
        let data = chinaData;
        this.renderPolygon(data, 'provincePolygon', true);
        this.addMarkerLayer(provinces, 'provinceMarker');
        this.curLevel = 0;
      },

      // 区域
      renderPolygon(datalist, group, isRerender) {
        let map = this.map;
        if (!isRerender && map.regionGroup[group]) {
          map.regionGroup[group].addTo(map);
          return;
        }
        let layergroup = new L.layerGroup([]);
        if (!datalist) return;
        let colors = baseConfig.colors;
        for (let i = 0; i < datalist.length; i++) {
          let data = datalist[i];
          let points = data.geom;

          let color = colors[i % colors.length];

          let style = {};
          if (this.curLevel !== 3) {
            style = {
              fillColor: color,
              fillOpacity: 1,
              weight: 1,
              color: color,
              opacity: 0.2
            };
          } else {
            style = {
              fillColor: '',
              fillOpacity: 0,
              weight: 3,
              color: '#000',
              opacity: 0.8
            };
          }

          let region = L.geoJSON(points, style);
          region.on('mouseover', () => {
            region.setStyle({
              fillColor: baseConfig.hoverColor,
            });
          });
          region.on('mouseout', () => {
            region.setStyle({
              fillColor: color,
            });
          });
          region.on('click', () => {
            this.drill(data, region);
          });
          region.on('contextmenu', () => {
            this.drillUp();
            return false;
          });
          layergroup.addLayer(region);
        }
        layergroup.addTo(map);
        map.regionGroup[group] = layergroup;
      },
      drill(data, region) {
        if (this.curLevel === 0) {
          // 全国 => 省
          this.curLevel = 1;
          this.provinceFitBoundsRegion = region;
        } else if (this.curLevel === 1) {
          // 省 => 市
          if(baseConfig.mapFromLevel === 1){
            this.curLevel = 3;
            this.showTile();
          }else if(baseConfig.mapFromLevel === 2){
            this.curLevel = 2;
            this.cityFitBoundsRegion = region;
          }
        } else if (this.curLevel === 2) {
          this.curLevel = 3;
          this.showTile();
        }
        this.drillDown(data, this.curLevel);
        this.fitBounds(region);
      },
      drillDown(data, level) {
        let group = {};
        if (level === 1) {
          group = {
            hidePolygon: 'provincePolygon',
            hideMarker: 'provinceMarker',
            showPolygon: 'cityPolygon',
            showMarker: 'cityMarker',
          }
        } else if (level === 2) {
          group = {
            hidePolygon: 'cityPolygon',
            hideMarker: 'cityMarker',
            showPolygon: 'countyPolygon',
            showMarker: 'countyMarker',
          }
        } else if (level === 3) {
          if(baseConfig.mapFromLevel === 1){
            group = {
              hidePolygon: 'cityPolygon',
              hideMarker: 'cityMarker',
              showPolygon: 'countyPolygon',
              showMarker: 'countyMarker',
            }
            this.renderPolygon([data], 'tilePolygon', true);
          }else if(baseConfig.mapFromLevel === 2){
            group = {
              hidePolygon: 'countyPolygon',
              hideMarker: 'countyMarker',
            };
            this.renderPolygon([data], 'tilePolygon', true);
          }
        }
        this.remove([this.map.regionGroup[group['hidePolygon']], this.map.regionGroup[group['hideMarker']]]);
        if(level === 3) return;
        let url = `https://data.dituwuyou.com/biz/district/search?name=${data.name}&level=${level}&sub=1&polygon=true&subPolygon=true&provinceScale=0.12&cityScale=0.12&countyScale=0.12`;
        this.$axios.get(url)
          .then(async (res) => {
            if (res.data.data.length > 0 && res.data.data[0].children) {
              let data = res.data.data[0].children;
              this.renderPolygon(data, group['showPolygon'], true);
              for (let i = 0; i < data.length; i++) {
                let location = await this.getLocation(res.data.data[0]['name'], data[i].name);
                data[i]['lng'] = location['lng'];
                data[i]['lat'] = location['lat'];
              }
              this.addMarkerLayer(data, group['showMarker']);
            }
          });
      },
      drillUp() {
        let level = this.curLevel;
        let group = {};
        if (level === 1) {
          group = {
            hidePolygon: 'cityPolygon',
            hideMarker: 'cityMarker',
            showPolygon: 'provincePolygon',
            showMarker: 'provinceMarker',
          };
          this.map.flyTo([37.46694, 104.051711], 5, {
            duration: 0.5,
          });
          this.curLevel = 0;
        } else if (level === 2) {
          group = {
            hidePolygon: 'countyPolygon',
            hideMarker: 'countyMarker',
            showPolygon: 'cityPolygon',
            showMarker: 'cityMarker',
          };
          this.curLevel = 1;
          this.fitBounds(this.provinceFitBoundsRegion);
        } else if (level === 3) {
          if(baseConfig.mapFromLevel === 1){
            group = {
              hidePolygon: 'tilePolygon',
              hideMarker: '',
              showPolygon: 'cityPolygon',
              showMarker: 'cityMarker',
            };
            this.curLevel = 1;
            this.fitBounds(this.provinceFitBoundsRegion);
          }else if(baseConfig.mapFromLevel === 2){
            group = {
              hidePolygon: 'tilePolygon',
              hideMarker: '',
              showPolygon: 'countyPolygon',
              showMarker: 'countyMarker',
            };
            this.curLevel = 2;
            this.fitBounds(this.cityFitBoundsRegion);
          }
          this.hideTile();
        }
        this.add([this.map.regionGroup[group['showPolygon']], this.map.regionGroup[group['showMarker']]]);
        this.remove([this.map.regionGroup[group['hidePolygon']], this.map.regionGroup[group['hideMarker']]]);
      },
      showTile() {
        document.getElementsByClassName('leaflet-layer')[0].style.display = 'block';
      },
      hideTile() {
        document.getElementsByClassName('leaflet-layer')[0].style.display = 'none';
      },

      // 坐标点
      addMarkerLayer(datalist, group) {
        let layergroup = new L.layerGroup([]);
        for (let i = 0; i < datalist.length; i++) {
          let data = datalist[i];
          let className = `my-icon-${i}`;
          data.lnglat = [data.lat, data.lng];
          let marker = createDomMarker(className, data);
          layergroup.addLayer(marker);
        }
        layergroup.addTo(this.map);
        this.map.regionGroup[group] = layergroup;
      },
      getPoints(datalist, group) {
        let x, y;
        let dataArr = [];
        for (let i = 0; i < datalist.length; i++) {
          let data = datalist[i];
          data.groupId = group + i;
          if (data.x && data.y) {
            let x = parseFloat(data.x);
            let y = parseFloat(data.y);
            let newGroup;
            if (group === 'shopService' && this.$config.serveSetting[data['serviceTypeName']]) {
              newGroup = this.$config.serveSetting[data['serviceTypeName']];
            } else if (group === 'orgProjects' && this.$config.serveSetting[data['leibieName']]) {
              newGroup = this.$config.serveSetting[data['leibieName']];
            } else {
              newGroup = group
            }
            let icon = {
              iconUrl: '../../static/icons/19-企业信息.png',
              iconSize: [41, 52],
              iconAnchor: [0, -26]
            };
            dataArr.push(
              L.extend({groupId: group + i, x: x, y: y, hitR: 20}, {icon}, {data: data, group: group})
            );
          } else {
            continue;
          }
        }
        return dataArr;
      },
      createCanvasLayerOptions(key) {
        let _this = this;
        let icon = {
          iconUrl: '../../static/icons/19-企业信息.png',
          iconSize: [41, 52],
          iconAnchor: [0, -26]
        };
        return {
          type: 'Marker',
          icon: icon,
          parser: function (data) {
            let _data = {};
            _data.groupId = data.groupId;
            _data.x = data.x;
            _data.y = data.y;
            _data.icon = data.icon;
            _data.label = data.obj && data.obj.name;
            return _data;
          },
          enableMouseOver: 0, // 开启后 Safari 上存在性能问题
          event: {
            click: (data, e) => {
              if (_this.map.polygonClickTime) {
                clearTimeout(_this.map.polygonClickTime);
              }
              let group = data.group;
              let feature = data;
              this.selectMarker(feature);
              this.$emit('layerClick', {
                group,
                data: data.data
              });
            }
          }
        };
      },
      // 查询百度坐标
      async getLocation(city, address) {
        let url = '/api/geocoder/v2/';
        let params = {
          ak: 'xlbBFeF4xY3v9wbLNSPRqMFYvggSU7Mu',
          output: 'json',
          city: city,
          address: address
        };
        let res = await this.$axios.get(url, {params});
        if (res && res.status === 200 && res.data.status === 0) {
          return res.data.result.location;
        }
      },
      // 大小变化重新渲染
      resize() {
        this.map.invalidateSize();
      },
      fitBounds(layer) {
        if (layer) {
          this.map.fitBounds(layer.getBounds());
        } else {
          this.map.fitBounds();
        }
      },
      add(layers) {
        if (_.isArray(layers)) {
          for (let i in layers) {
            addFeatureGroup(layers[i]);
          }
        } else if (_.isObject(layers)) {
          addFeatureGroup(layers);
        }
      },
      remove(layers) {
        if (_.isArray(layers)) {
          for (let i in layers) {
            removeFeatureGroup(layers[i]);
          }
        } else if (_.isObject(layers)) {
          removeFeatureGroup(layers);
        }
      },

      drillProvince(name) {
        this.curLevel = 1;
        let url = `https://data.dituwuyou.com/biz/district/search?name=${name}&level=1&sub=1&polygon=true&subPolygon=true&provinceScale=0.12&cityScale=0.12&countyScale=0.12`;
        this.$axios.get(url)
          .then(async (res) => {
            let data = res.data.data[0].children;
            this.hideRegionGroup('provincePolygon');
            this.hideMarkerGroup('provinceMarker');
            this.renderPolygon(data, 'citiesPolygon', true);
            for (let i = 0; i < data.length; i++) {
              let location = await this.getLocation(res.data.data[0]['name'], data[i].name);
              data[i]['lng'] = location['lng'];
              data[i]['lat'] = location['lat'];
            }
            this.addMarkerLayer(data, 'cities');
          });
      },
      drillCity(name) {
        let url = `https://data.dituwuyou.com/biz/district/search?name=${name}&level=2&sub=1&polygon=true&subPolygon=true&provinceScale=0.12&cityScale=0.12&countyScale=0.12`;
        this.$axios.get(url)
          .then(async (res) => {
            let data = res.data.data[0].children;
            this.remove([this.map.regionGroup['citiesMarker'], this.map.regionGroup['citiesPolygon']]);
            this.renderPolygon(data, 'countiesPolygon', true);
            for (let i = 0; i < data.length; i++) {
              let location = await this.getLocation(res.data.data[0]['name'], data[i].name);
              data[i]['lng'] = location['lng'];
              data[i]['lat'] = location['lat'];
            }
            this.addMarkerLayer(data, 'county');
          });
      },

      renderMarker(datalist, group) {
        let data = this.getPoints(datalist, group);
        this.map.canvasLayer.setOptions(this.createCanvasLayerOptions(), group);
        this.map.canvasLayer.setData(data, group);
      },
      hideMarkerGroup(group) {
        this.map.canvasLayer.clearData(group);
      },
      clearSelectMarekr() { // 清除选择点位
        if (this.activeFeature) {
          this.map.removeLayer(this.activeFeature);
          this.activeFeature = null;
        }
      },
      selectMarker(feature) { // 点击选择某个点位
        let icon = L.icon({
          iconUrl: '../../static/icons/19-企业信息.png',
          iconSize: [41, 52],
          iconAnchor: [0, -26]
        });
        let lnglat = new L.latLng(feature.y, feature.x);
        let marker = new L.Marker(lnglat, {
          icon: icon
        });
        this.activeFeature = marker;
        this.map.addLayer(marker);
      },
      hoverMarkers(features) { // 群体加圈圈
        if (this.hoverMarkerLayers) {
          this.clearHoverMarkers();
        }
        this.hoverMarkerLayers = L.featureGroup();
        let icon = L.icon({
          iconUrl: '../../static/icons/19-企业信息.png',
          iconSize: [41, 52],
          iconAnchor: [0, -26]
        });
        for (let i = 0, n = features.length; i < n; i++) {
          if (!features[i].x || !features[i].y) continue;
          let lnglat = new L.latLng(features[i].y, features[i].x);
          let marker = new L.Marker(lnglat, {
            icon: icon
          });
          this.hoverMarkerLayers.addLayer(marker);
        }
        this.hoverMarkerLayers.addTo(this.map);
      },
      clearHoverMarkers() { // 群体去圈圈
        if (this.hoverMarkerLayers) {
          this.map.removeLayer(this.hoverMarkerLayers);
          this.hoverMarkerLayers = null;
        }
      },

      // 线路
      renderPolygonSvgsettlePath(pathArr) {
        if (pathArr) {
          let markerArr = [];
          for (let i = 0, len = pathArr.length; i < len; i++) {
            markerArr.push(pathArr[i].join(','));
          }
          let path = markerArr.join(';');
          return path;
        }
      },
      renderPolyline(datalist, group, isRerender) {
        let map = this.map;
        if (!isRerender && map.lineGroup[group]) {
          map.lineGroup[group].addTo(map);
          return;
        }
        let PolylineLayer = new DT.LineLayer();
        let style = {
          color: '#E41D2F',
          weight: 2,
        };
        let layergroup = new L.featureGroup([]);
        for (let i = 0, len = datalist.length; i < len; i++) {
          let data = datalist[i];
          let polyline = PolylineLayer.buildFeature(data, style);
          layergroup.addLayer(polyline);
        }
        layergroup.setStyle(style).addTo(map);
        map.lineGroup[group] = layergroup;
      },
      selectPolyline(feature) { // 选中某个区域
        clearTimeout(this.polylineClickTime);
        this.polylineClickTime = setTimeout(() => {
          feature.setStyle({
            weight: 5
          });
          this.activePolylineFeature = feature;
        }, 100);
      },
      clearSelectPolyline() {
        if (this.activePolylineFeature) {
          this.activePolylineFeature.setStyle({
            weight: 2
          });
        }
      },
      hidePolyline(group) {
        removeFeatureGroup(this.map.lineGroup[group]);
      },

      hideRegionGroup(group) { // 隐藏区域
        removeFeatureGroup(this.map.regionGroup[group]);
      },
      clearSelectPolygon() { // 清除选中的区域
        if (this.activePolygonFeature) {
          let style = {
            iconUrl: '../../static/icons/19-企业信息.png',
            iconSize: [41, 52],
            iconAnchor: [0, -26]
          };
          let isHover = false;
          if (this.hoverPolygonFeatures.filter(item => item.groupId === this.activePolygonFeature.data.groupId).length > 0) {
            isHover = true;
          }
          if (isHover) {
            this.activePolygonFeature.setStyle({
              fillColor: style.fillColor
            });
          } else {
            this.activePolygonFeature.setStyle(style);
          }
          this.activePolygonFeature = null;
        }
      },
      selectPolygon(feature) { // 选中某个区域
        feature.setStyle({
          color: 'red',
          fillColor: 'red'
        });
        this.activePolygonFeature = feature;
      },
      hoverPolygons(features, group) { // 群体加红边框
        if (this.hoverPolygonLayers) {
          this.clearHoverPolygons();
        }
        this.hoverPolygonFeatures = features;
        let allFeatures = this.map.regionGroup[group];
        let inTower = false;
        if (['user', 'dangzuzhi'].indexOf(group) > -1) {
          allFeatures = this.map.regionGroup['tower'];
          inTower = true;
        }
        let hoverLayers = L.featureGroup();
        try {
          allFeatures.eachLayer(layer => {
            for (let i = 0, n = features.length; i < n; i++) {
              if ((inTower && layer.data.dtTitle === features[i].building) || (layer.data.groupId === features[i].groupId)) {
                layer.setStyle({
                  color: 'red'
                });
                hoverLayers.addLayer(layer);
                break;
              }
            }
          });
        } catch (e) {
        }
        this.hoverPolygonLayers = hoverLayers;
      },
      clearHoverPolygons() { // 群体去除红边框
        if (this.hoverPolygonLayers) {
          this.hoverPolygonLayers.eachLayer(layer => {
            let group = layer.group;
            let style = this.$config.allCates[group];

            layer.setStyle({
              color: style.color
            });
          });
          this.hoverPolygonFeatures = [];
          this.hoverPolygonLayers = null;
        }
      },

      fitBoundsArray(arr) {
        if (arr) {
          this.map.flyToBounds(arr, {
            duration: 1
          });
        } else {
          this.map.fitBounds();
        }
      },
      setCenter(lnglat) {
        let latlngs = this.lnglats2latlngs(lnglat);
        this.map.setView(latlngs);
      },
      getPolygonCenter(group, obj) {
        let layerGroup = this.map.regionGroup[group];
        let polygon;
        layerGroup.eachLayer(layer => {
          let isFilter = false;
          for (let i in obj) {
            if (layer.data[i] === obj[i]) {
              isFilter = true;
            }
          }
          if (isFilter) {
            polygon = layer;
          }
        });
        if (polygon) {
          return polygon.getCenter();
        }
        let center = this.$config.map.center.split(',');
        return {
          lat: center[1],
          lng: center[0]
        };
      },
      lnglats2latlngs(lnglat) {
        if (!lnglat || lnglat.length < 2) {
          return null;
        }
        return [lnglat[1], lnglat[0]];
      }
    }
  };
</script>
<style lang="less">
  #LeafletMap {
    background-color: #1c2431;
    z-index: 990;
  }

  .marker_sign {
    width: 16px;
    height: 16px;
    text-align: center;
    line-height: 16px;
    border-radius: 50%;
    color: #fff;
  }

  .map-echarts-pie-tooltip {
    z-index: 9999;
    td {
      padding: 0 3px;
    }
    .map-echarts-span {
      width: 30px;
      height: 14px;
      border-radius: 5px;
      display: inline-block;
    }
  }

  .my-div-icon {
    width: 50px !important;
    height: 53px !important;
    text-align: center;
    color: #fff;
    .name {
      font-weight: bold;
    }
    .circle {
      display: block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      margin: 0 auto;
      background: #fff;
    }
  }
</style>
