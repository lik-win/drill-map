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
        allLevel: 0,
        drillZoom: []
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
        this.$emit('map-click');
      });
      this.map.on('zoomend', () => {
        let curZoom = this.map.getZoom();
        if (this.curLevel === 0 && curZoom < 5) {
          this.map.flyTo([37.46694, 104.051711], 5, {
            duration: 0.5,
          });
        }
        if (this.drillZoom[this.drillZoom.length - 1] > curZoom) {
          this.drillUp();
        }
      });
    },
    methods: {
      renderChinaPolygon() {
        let data = chinaData;
        this.renderPolygon(data, 'provincePolygon', true);
        if (baseConfig.citiesMarkerShow) {
          this.addMarkerLayer(provinces, 'provinceMarker');
        }
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
              fillColor: baseConfig.hoverColor || '#00FFFE',
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
          if (baseConfig.mapFromLevel === 1) {
            this.curLevel = 3;
            this.showTile();
          } else if (baseConfig.mapFromLevel === 2) {
            this.curLevel = 2;
            this.cityFitBoundsRegion = region;
          }
        } else if (this.curLevel === 2) {
          this.curLevel = 3;
          this.showTile();
        } else if (this.curLevel === 3) {
          return;
        }
        this.removeGroup(this.map.regionGroup);
        this.drillDown(data, this.curLevel);
        this.fitBounds(region);
      },
      drillDown(data, level) {
        if (this.drillZoom[this.drillZoom.length - 1] !== this.map.getZoom()) {
          this.drillZoom.push(this.map.getZoom());
        }
        let group = {};
        if (level === 1) {
          group = {
            showPolygon: 'cityPolygon',
            showMarker: 'cityMarker',
          }
        } else if (level === 2) {
          group = {
            showPolygon: 'countyPolygon',
            showMarker: 'countyMarker',
          }
        } else if (level === 3) {
          if (baseConfig.mapFromLevel === 1) {
            group = {
              showPolygon: 'countyPolygon',
              showMarker: 'countyMarker',
            }
          } else if (baseConfig.mapFromLevel === 2) {
            group = {};
          }
          this.renderPolygon([data], 'tilePolygon', true);
        }
        if (level === 3) return;
        let url = `https://data.dituwuyou.com/biz/district/search?name=${data.name}&level=${level}&sub=1&polygon=true&subPolygon=true&provinceScale=0.12&cityScale=0.12&countyScale=0.12`;
        this.$axios.get(url)
          .then(async (res) => {
            if (res.data.success && res.data.data.length > 0 && res.data.data[0].children) {
              let childrenData = res.data.data[0].children;
              this.renderPolygon(childrenData, group['showPolygon'], true);
              if (baseConfig.citiesMarkerShow) {
                for (let i = 0; i < childrenData.length; i++) {
                  let location = await this.getLocation(res.data.data[0]['name'], childrenData[i].name);
                  if (!location) continue;
                  childrenData[i]['lng'] = location['lng'];
                  childrenData[i]['lat'] = location['lat'];
                }
                this.addMarkerLayer(childrenData, group['showMarker']);
              }
              this.allLevel = 0;
            } else {
              if (level === 1) {
                this.allLevel = 2;
              } else if (level === 2) {
                this.allLevel = 3;
              }
              this.curLevel = 3;
              this.showTile();
              this.renderPolygon([data], 'tilePolygon', true);
            }
          });
      },
      drillUp() {
        this.drillZoom.pop(this.drillZoom.length - 1);
        let level = this.curLevel;
        if (level === 0) return;
        this.removeGroup(this.map.regionGroup);
        this.hideTile();
        let group = {};
        if (level === 1 || this.allLevel === 2) {
          group = {
            showPolygon: 'provincePolygon',
            showMarker: 'provinceMarker',
          };
          this.map.flyTo([37.46694, 104.051711], 5, {
            duration: 0.5,
          });
          this.curLevel = 0;
        } else if (level === 2) {
          group = {
            showPolygon: 'cityPolygon',
            showMarker: 'cityMarker',
          };
          this.curLevel = 1;
          this.fitBounds(this.provinceFitBoundsRegion);
        } else if (level === 3) {
          if (baseConfig.mapFromLevel === 1 || this.allLevel === 3) {
            group = {
              showPolygon: 'cityPolygon',
              showMarker: 'cityMarker',
            };
            this.curLevel = 1;
            this.fitBounds(this.provinceFitBoundsRegion);
          } else if (baseConfig.mapFromLevel === 2) {
            group = {
              showPolygon: 'countyPolygon',
              showMarker: 'countyMarker',
            };
            this.curLevel = 2;
            this.fitBounds(this.cityFitBoundsRegion);
          }
        }
        this.add([this.map.regionGroup[group['showPolygon']], this.map.regionGroup[group['showMarker']]]);
      },
      showTile() {
        document.getElementsByClassName('leaflet-layer')[0].style.display = 'block';
      },
      hideTile() {
        if(!baseConfig.tileShow){
          document.getElementsByClassName('leaflet-layer')[0].style.display = 'none';
        }
      },
      // 坐标点
      addMarkerLayer(datalist, group) {
        let layergroup = new L.layerGroup([]);
        for (let i = 0; i < datalist.length; i++) {
          let data = datalist[i];
          let className = `my-icon-${i}`;
          if (!data.lat || !data.lng) continue;
          data.lnglat = [data.lat, data.lng];
          let marker = createDomMarker(className, data);
          layergroup.addLayer(marker);
        }
        layergroup.addTo(this.map);
        this.map.regionGroup[group] = layergroup;
      },
      // 查询百度坐标
      async getLocation(city, address) {
        let url = '/api/geocoder/v2/';
        let params = {
          ak: 'LyRXDEGBixFCj7wyGl1ZE053',
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
            if (layers[i]) {
              addFeatureGroup(layers[i]);
            }
          }
        } else if (_.isObject(layers)) {
          if (layers) {
            addFeatureGroup(layers);
          }
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
      removeGroup(layers) {
        for (let key in layers) {
          removeFeatureGroup(layers[key]);
        }
      },
    }
  };
</script>
<style lang="less">
  #LeafletMap {
    background-color: #1c2431;
    z-index: 990;
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
