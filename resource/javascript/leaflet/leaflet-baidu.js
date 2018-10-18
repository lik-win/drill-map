L.Projection.BaiduSphericalMercator = {
  EARTHRADIUS: 6370996.81,
  MCBAND: [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0],
  LLBAND: [75, 60, 45, 30, 15, 0],
  MC2LL: [[1.410526172116255e-008, 8.983055096488720e-006, -1.99398338163310, 2.009824383106796e+002, -1.872403703815547e+002, 91.60875166698430, -23.38765649603339, 2.57121317296198, -0.03801003308653, 1.733798120000000e+007],
        [-7.435856389565537e-009, 8.983055097726239e-006, -0.78625201886289, 96.32687599759846, -1.85204757529826, -59.36935905485877, 47.40033549296737, -16.50741931063887, 2.28786674699375, 1.026014486000000e+007],
        [-3.030883460898826e-008, 8.983055099835780e-006, 0.30071316287616, 59.74293618442277, 7.35798407487100, -25.38371002664745, 13.45380521110908, -3.29883767235584, 0.32710905363475, 6.856817370000000e+006],
        [-1.981981304930552e-008, 8.983055099779535e-006, 0.03278182852591, 40.31678527705744, 0.65659298677277, -4.44255534477492, 0.85341911805263, 0.12923347998204, -0.04625736007561, 4.482777060000000e+006],
        [3.091913710684370e-009, 8.983055096812155e-006, 0.00006995724062, 23.10934304144901, -0.00023663490511, -0.63218178102420, -0.00663494467273, 0.03430082397953, -0.00466043876332, 2.555164400000000e+006],
        [2.890871144776878e-009, 8.983055095805407e-006, -0.00000003068298, 7.47137025468032, -0.00000353937994, -0.02145144861037, -0.00001234426596, 0.00010322952773, -0.00000323890364, 8.260885000000000e+005]],
  LL2MC: [[-0.0015702102444, 111320.7020616939, 1704480524535203, -10338987376042340, 26112667856603880, -35149669176653700, 26595700718403920, -10725012454188240, 1800819912950474, 82.5],
        [0.0008277824516172526, 111320.7020463578, 647795574.6671607, -4082003173.641316, 10774905663.51142, -15171875531.51559, 12053065338.62167, -5124939663.577472, 913311935.9512032, 67.5],
        [0.00337398766765, 111320.7020202162, 4481351.045890365, -23393751.19931662, 79682215.47186455, -115964993.2797253, 97236711.15602145, -43661946.33752821, 8477230.501135234, 52.5],
        [0.00220636496208, 111320.7020209128, 51751.86112841131, 3796837.749470245, 992013.7397791013, -1221952.21711287, 1340652.697009075, -620943.6990984312, 144416.9293806241, 37.5],
        [-0.0003441963504368392, 111320.7020576856, 278.2353980772752, 2485758.690035394, 6070.750963243378, 54821.18345352118, 9540.606633304236, -2710.55326746645, 1405.483844121726, 22.5],
        [-0.0003218135878613132, 111320.7020701615, 0.00369383431289, 823725.6402795718, 0.46104986909093, 2351.343141331292, 1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45]],
  project: function (latLng) {
      return this._convertLL2MC(latLng);
    },
  unproject: function (mc) {
      return this._convertMC2LL(mc);
    },
    //平面直角坐标转换成经纬度坐标
  _convertMC2LL: function (point) {
      let temp, factor;
      temp = { x: Math.abs(point.y), y: Math.abs(point.x) };
      for (let i = 0, len = this.MCBAND.length; i < len; i++) {
          if (temp.x >= this.MCBAND[i]) {
              factor = this.MC2LL[i];
              break;
            }
        }
      var point = this._convertor(point, factor);
      return new L.LatLng(point.y.toFixed(6), point.x.toFixed(6));
    },
    //经纬度坐标转换成平面直角坐标
  _convertLL2MC: function (lnglat) {
      let temp, factor;
      lnglat.x = this._getLoop(lnglat.lng, -180, 180);
      lnglat.y = this._getRange(lnglat.lat, -74, 74);
      temp = new L.Point(lnglat.x, lnglat.y);
      for (let k = 0; k < this.LLBAND.length; k++) {
          if (temp.y >= this.LLBAND[k]) {
              factor = this.LL2MC[k];
              break;
            }
        }
      if (!factor) {
          for (let j = this.LLBAND.length - 1; j >= 0; j--) {
              if (temp.y <= -this.LLBAND[j]) {
                  factor = this.LL2MC[j];
                  break;
                }
            }
        }
      let mc = this._convertor(lnglat, factor);
      return new L.Point(mc.x.toFixed(2), mc.y.toFixed(2));
    },
  _convertor: function (fromPoint, factor) {
      if (!fromPoint || !factor) {
          return null;
        }
      let x = factor[0] + factor[1] * Math.abs(fromPoint.x);
      let temp = Math.abs(fromPoint.y) / factor[9];
      let y = factor[2] + factor[3] * temp + factor[4] * temp * temp +
            factor[5] * temp * temp * temp + factor[6] * temp * temp * temp * temp +
            factor[7] * temp * temp * temp * temp * temp +
            factor[8] * temp * temp * temp * temp * temp * temp;
      x *= (fromPoint.x < 0 ? -1 : 1);
      y *= (fromPoint.y < 0 ? -1 : 1);
      return new L.Point(x, y);
    },
  _getRange: function (v, a, b) {
      if (a != null) {
          v = Math.max(v, a);
        }
      if (b != null) {
          v = Math.min(v, b);
        }
      return v;
    },
  _getLoop: function (v, a, b) {
      while (v > b) {
          v -= b - a;
        }
      while (v < a) {
          v += b - a;
        }
      return v;
    },
  bounds: (function () {
      let MAX_X = 20037726.37;
      let MIN_Y = -11708041.66;
      let MAX_Y = 12474104.17;
      let bounds = L.bounds(
            [-MAX_X, MIN_Y],
            [MAX_X, MAX_Y]
        );
      let MAX = 33554432;
      bounds = new L.Bounds(
            [-MAX, -MAX],
            [MAX, MAX]
        );
      return bounds;
    })()
};


L.CRS.BEPSG3857 = L.extend({}, L.CRS, {
  code: 'EPSG:3857',
  projection: L.Projection.BaiduSphericalMercator,
  R: 6370996.81,

  transformation: (function () {
      let z = -18 - 8;
      let scale = Math.pow(2, z);
      return new L.Transformation(scale, 0.5, -scale, 0.5);
    }()),

  degreeToRad: function (degree) {
      return Math.PI * degree / 180;
    },

  distance: function (latlng1, latlng2) {
      latlng1.lng = this.projection._getLoop(latlng1.lng, -180, 180);
      latlng1.lat = this.projection._getRange(latlng1.lat, -74, 74);
      latlng2.lng = this.projection._getLoop(latlng2.lng, -180, 180);
      latlng2.lat = this.projection._getRange(latlng2.lat, -74, 74);

      let x1, x2, y1, y2;
      x1 = this.degreeToRad(latlng1.lng);
      y1 = this.degreeToRad(latlng1.lat);
      x2 = this.degreeToRad(latlng2.lng);
      y2 = this.degreeToRad(latlng2.lat);

      return this.R * Math.acos((Math.sin(y1) * Math.sin(y2) + Math.cos(y1) * Math.cos(y2) * Math.cos(x2 - x1)));
        // if (!latlng1 || !latlng2) {
        //     return 0;
        // }
        // var b = this.degreeToRad(latlng1.lat), d = this.degreeToRad(latlng2.lat), e = b - d, f = this.degreeToRad(latlng1.lng) - this.degreeToRad(latlng2.lng);
        // b = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(e / 2), 2) + Math.cos(b) * Math.cos(d) * Math.pow(Math.sin(f / 2), 2)));
        // b *= this.R;
        // return Math.round(b * 1E5) / 1E5;
    }
});

L.TileLayer.BaiduLayer = L.TileLayer.extend({
  options: {
      minZoom: 3,
      maxZoom: 19,
      subdomains: ['online1', 'online2', 'online3'],
      attribution: '',
      style: 'normal',
      styleJson: [],
      styleStr: null
    },

  _urls: {
      'normal': 'https://ss0.bdstatic.com/8bo_dTSlRsgBo1vgoIiO_jowehsv/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=2&udt=20170803',
      'weixing': 'https://ss0.bdstatic.com/5bwHcj7lABFT8t_jkk_Z1zRvfdw6buu/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46&udt=20170803',
      'light': 'https://api.map.baidu.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20170803&scale=2&t%20=%201480488883931',
      'dark': 'https://api.map.baidu.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20170803&scale=2',
      'googlelite': 'https://api.map.baidu.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20170803&scale=2&t%20=%201480488980881',
      'grassgreen': 'https://api.map.baidu.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20170803&scale=2&t%20=%201480489105735',
      'midnight': 'https://api.map.baidu.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20170803&scale=2&t%20=%201480489148092',
      'bluish': 'https://api.map.baidu.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20170803&scale=2&t%20=%201480489171571',
      'hardedge': 'https://api.map.baidu.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20170803&scale=2&t%20=%201480489194855',
      'grayscale': 'https://api.map.baidu.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20170803&scale=2&t%20=%201480489194855'
    },

  _weixing_label_url: 'https://ss0.bdstatic.com/8bo_dTSlRMgBo1vgoIiO_jowehsv/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sl&udt=20141015',

  initialize: function (options) {
      let baiduLayer = this;
      let url;
      if (options.url) {
          url = options.url;
        } else if (options.style) {
          url = baiduLayer._urls[options.style];
          if (options.hideArr) {
              let styleJson = getStyleJson(options.style, options.hideArr);
              options.styleStr = this._generateStyleStr(styleJson);
            }
        }
      if (!url) {
          url = 'https://ss0.bdstatic.com/8bo_dTSlRsgBo1vgoIiO_jowehsv/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=2&udt=20170803';
        }
      L.TileLayer.prototype.initialize.call(this, url, options);
      if (options.style == "weixing") {
          baiduLayer.labelLayer = new L.TileLayer.BaiduLayer({ url: baiduLayer._weixing_label_url });
          baiduLayer.on('add', function () {
              baiduLayer.labelLayer.addTo(baiduLayer._map);
            });
        }
    },

  getTileUrl: function (coords) {
      let offset = Math.pow(2, coords.z - 1),
          x = coords.x - offset,
          y = offset - coords.y - 1,
          baiduCoords = L.point(x, y);
      baiduCoords.z = coords.z;
      let url = L.TileLayer.prototype.getTileUrl.call(this, baiduCoords);
      if (this.options.style) {
          url += this.options.styleStr ? ("&styles=" + encodeURIComponent(this.options.styleStr)) : ("&customid=" + this.options.style);
        }
      return url;
    },

  setMapStyle: function (mapStyle, hideArr) {
      let styleJson = getStyleJson(mapStyle, hideArr);

      let url;
      if (mapStyle) {
          url = this._urls[mapStyle];
          this.options.style = mapStyle;
        }
      if (!url) {
          url = 'https://ss0.bdstatic.com/8bo_dTSlRsgBo1vgoIiO_jowehsv/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=2&udt=20160401';
        }
      if (styleJson) {
          this.options.styleStr = this._generateStyleStr(styleJson);
        } else {
          this.options.styleStr = null;
        }
      if (mapStyle == 'weixing') {
          if (!this.labelLayer) {
              this.labelLayer = new L.TileLayer.BaiduLayer({ url: this._weixing_label_url });
            }
          if (!this.labelLayer._map) {
              this.labelLayer.addTo(this._map);
            }
        } else if (this.labelLayer && this.labelLayer._map) {
          this.labelLayer.remove();
        }
      L.TileLayer.prototype.setUrl.call(this, url);
    },

  _generateStyleStr: function (a) {
      for (var b = {
            featureType: "t",
            elementType: "e",
            visibility: "v",
            color: "c",
            lightness: "l",
            saturation: "s",
            weight: "w",
            zoom: "z",
            hue: "h"
          }, c = {
          all: "all",
          geometry: "g",
          "geometry.fill": "g.f",
          "geometry.stroke": "g.s",
          labels: "l",
          "labels.text.fill": "l.t.f",
          "labels.text.stroke": "l.t.s",
          "lables.text": "l.t",
          "labels.icon": "l.i"
        }, d = [], e = 0, f; f = a[e]; e++) {
          var g = f.stylers;
          delete f.stylers;
          L.extend(f, g);
          var g = [], i;
          for (i in b)
              f[i] && ("elementType" === i ? g.push(b[i] + ":" + c[f[i]]) : g.push(b[i] + ":" + f[i]));
          2 < g.length && d.push(g.join("|"));
        }
      return d.join(",");
    }
});

L.tileLayer.baiduLayer = function (url, options) {
  return new L.TileLayer.BaiduLayer(url, options);
};
