;(function (name, context, factory) {
  // Supports UMD. AMD, CommonJS/Node.js and browser context
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define(factory);
  } else {
    context[name] = factory();
  }
})('Polyline', Dtwy, function () {
  'use strict';

  var DtwyPolyline = L.Polyline.extend({
    initialize: function (path, options) {
      if (typeof(path) === "string") {
        path = Utils.convertStr2LeafletPath(path);
      }
      if (!path) {
        return;
      }
      if (options && options["layer"]) {
        this.layer = options["layer"];
      }
      if (options && options['data']) {
        var data = options['data'];
        if (data.cooperation) {
          this.cooperation = data.cooperation;
        }
        this.type = 'line';
        this.feature_id = data.id;
        this.name = data.name;
        this.attrs = [
          {key: '线路描述', value: data.describe},
          {key: '线路负责人', value: data.describe},
          {key: '负责人联系方式', value: data.describe},
        ]
        this.obj = data;
      }
      if (options) {
        delete options['data'];
      }
      L.Polyline.prototype.initialize.call(this, path, options);
      this._setDecorator();
    },
    onAdd: function (map) {
      L.Polyline.prototype.onAdd.call(this, map);
      if (this.decorator) {
        this.decorator.addTo(map);
      }
      if (this.wayPoints) {
        this.wayPoints.addTo(map);
      }
    },
    onRemove: function (map) {
      L.Polyline.prototype.onRemove.call(this, map);
      if (this.decorator) {
        this.decorator.remove();
      }

      if (this.wayPoints) {
        this.wayPoints.remove();
      }
    },
    clone: function () {
      var line = this;
      var ps = line.getLatLngs();
      var tempLine = new DtwyPolyline(ps, line.options);
      tempLine.type = 'line';
      tempLine.feature_id = line.feature_id;
      tempLine.layer_id = line.layer_id;
      tempLine.attrs = line.attrs;
      tempLine.label_field = line.label_field;
      tempLine.label_style_type = line.label_style_type;
      tempLine.uniform_title = line.uniform_title;
      tempLine.display = line.display;
      tempLine.imgs = line.imgs;
      tempLine.title = line.title;
      tempLine.line_style = line.line_style;
      tempLine.line_route = line.line_route;
      tempLine.line_type = line.line_type;
      tempLine.line = line;
      return tempLine;
    },
    updateFromObj: function (obj) {
      if (!obj) {
        return;
      }
      if (obj.encoded_path) {
        obj.path = Utils.decodePath(obj.encoded_path);
      }
      var overlay = this;
      if(obj.line_attrs){
        overlay.attrs = obj.line_attrs;
      }
      if(obj.line_route){
        overlay.line_route = obj.line_route;
        overlay.layer.addDirectionMarkerToMap(overlay);
      }
      if(obj.line_style){
        overlay.line_style = obj.line_style;
      }
      if(obj.display != undefined && obj.display != null){
        overlay.display = obj.display;
      }

      if (typeof(obj.title) !== 'undefined' && obj.title !== null) {
        overlay.title = obj.title.toString();
      } else if (overlay.uniform_title && overlay.attrs) {
        var title = null;
        for (var m = 0; m < overlay.attrs.length; m++) {
          var attr = overlay.attrs[m];
          if (overlay.uniform_title === attr.key) {
            title = (attr.value && attr.value.toString()) || "";
            break;
          }
        }
        if (title) {
          overlay.title = title;
          obj.title = title;
        }
      }
      if(obj.path){
        overlay.setPath(obj.path);
      }

      var options = this.options;
      if(options && obj.line_style){
        options['weight'] = parseInt(obj.line_style.strokeWeight);
        options['color'] = obj.line_style.strokeColor;
        options['opacity'] = obj.line_style.strokeOpacity;
        options['style'] = obj.line_style.strokeStyle;
        overlay.setStyle(options);
      }
      if (overlay.obj) {
        $.extend(overlay.obj, obj);
      } else {
        overlay.obj = obj;
      }
      if (overlay.display) {
        overlay.show();
      } else {
        overlay.hide();
      }
    },
    delete: function () {
      if (this.line_route && this.wayPoints) {
        this.wayPoints.remove();
      }
      this.remove();
    },
    redraw: function () {
      L.Polyline.prototype.redraw.call(this);

      if (this.decorator) {
        this._setDecorator();
        this.decorator.redraw();
      }
    },
    enableEditing: function () {
      if (this.line_route) {
        return;
      }

      L.Polyline.prototype.enableEditing.call(this);
    },
    setLatLngs: function (latlngs) {
      L.Polyline.prototype.setLatLngs.call(this, latlngs);
      if (this.editing) {
        var editable = this.editing.enabled();
        this.editing.disable();
        this.editing = new L.Edit.Poly(this, this.options.poly);
        if (editable) {
          this.editing.enable();
        }
      }
    },
    getPath: function () {
      return this.getLatLngs();
    },
    getPathString: function () {
      var paths = [];
      var path = this.getPath();
      if (path) {
        for (var i = 0; i < path.length; i++) {
          var lng = path[i].lng.toFixed(6);
          var lat = path[i].lat.toFixed(6);
          paths.push(lng + "," + lat);
        }
      }
      return paths.join(";");
    },
    setPath: function (path) {
      var latlngs = Utils.convertStr2LeafletPath(path);
      this.setLatLngs(latlngs);
      if (this.options['style'] === 'arrow' || this.options['style'] === 'arrow_node') {
        this._setDecorator();
      }
    },
    setStyle: function (options) {
      if (!options) {
        return;
      }
      if (options['style'] === "dashed") {
        options['dashArray'] = options['weight'] * 2 + ',' + options['weight'] * 2
      } else {
        options['dashArray'] = "0,0";
      }
      L.Polyline.prototype.setStyle.call(this, options);
      if (options['style'] === 'arrow' || options['style'] === 'arrow_node') {
        this._setDecorator();
        if (this._map && this.decorator && !this.decorator._map) {
          this.decorator.addTo(this._map);
        }
      } else {
        if (this._map && this.decorator && this.decorator._map) {
          this.decorator.remove();
        }
      }
    },
    setStrokeColor: function (strokeColor) {
      var options = this.options;
      options['color'] = strokeColor;
      this.setStyle(options);
    },
    getStrokeColor: function () {
      return this.options["color"];
    },
    setStrokeOpacity: function (strokeOpacity) {
      var options = this.options;
      options['opacity'] = strokeOpacity;
      this.setStyle(options);
    },
    getStrokeOpacity: function () {
      return this.options['opacity'];
    },
    setStrokeWeight: function (strokeWeight) {
      var options = this.options;
      options['weight'] = parseInt(strokeWeight);
      this.setStyle(options);
    },
    getStrokeWeight: function () {
      return this.options['weight'];
    },
    setStrokeStyle: function (strokeStyle) {
      var options = this.options;
      options['style'] = strokeStyle;
      this.setStyle(options);
    },
    getStrokeStyle: function () {
      return this.options['style'];
    },
    updateToServer: function (options, callback) {
      var data = L.Util.extend(options, {
        id: this.feature_id,
        path: this.getPathString()
      });

      Utils.ajax2server(update_line_url, 'PUT', data, function (e) {
        if (callback) {
          callback(e);
        }
      });
    },
    editNodeLine: function () {
      if (this.line_route) {
        PromptInfo.xcConfirm('路线不支持编辑节点', PromptInfo.xcConfirm.typeEnum.info);
        return;
      }
      this.toggleEditing();
      BInfowindow.close();
    },
    _setDecorator: function () {
      var patterns, options = this.options;
      if (options["style"] === "arrow") {
        patterns = [
          {
            offset: '100%',
            repeat: 0,
            symbol: L.Symbol.arrowHead({
              pixelSize: options["weight"] * 2,
              polygon: true,
              pathOptions: {
                stroke: true,
                color: options["color"],
                weight: options["weight"],
                opacity: options["opacity"],
                fillColor: options["color"],
                fillOpacity: options["opacity"]
              }
            })
          }
        ];
      } else if (options["style"] === "arrow_node") {
        patterns = [];
        var distances = [];
        var totalDistance = 0;
        var l = 0;
        var latlngs = this.getLatLngs();
        var last_latlng = latlngs[0];
        for (l = 1; l < latlngs.length; l++) {
          var latlng = latlngs[l];
          totalDistance += last_latlng.distanceTo(latlng);
          distances.push(totalDistance);
          last_latlng = latlng;
        }
        for (l = 0; l < distances.length; l++) {
          var offset = (distances[l] * 100 / totalDistance) + "%";
          var pattern = {
            offset: offset,
            repeat: 0,
            symbol: L.Symbol.arrowHead({
              pixelSize: options["weight"] * 2,
              polygon: true,
              pathOptions: {
                stroke: true,
                color: options["color"],
                weight: options["weight"],
                opacity: options["opacity"],
                fillColor: options["color"],
                fillOpacity: options["opacity"]
              }
            })
          };

          patterns.push(pattern);
        }
      }
      if (!patterns) {
        return;
      }
      if (this.decorator) {
        this.decorator.setPaths(this);
        this.decorator.setPatterns(patterns);
      } else {
        this.decorator = L.polylineDecorator(this, {
          patterns: patterns
        });
      }
    }
  });

  return DtwyPolyline;
});
