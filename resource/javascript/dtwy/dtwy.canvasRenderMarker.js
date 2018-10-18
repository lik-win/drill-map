;(function (name, context, factory) {
  // Supports UMD. AMD, CommonJS/Node.js and browser context
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    define(factory)

  } else {
    context[name] = factory()
  }
})('CanvasRenderMarker', Dtwy, function () {
  'use strict'

  var DtwyCanvasRenderMarker = L.Class.extend({
    initialize: function (point, options) {
      if (options && options['data']) {
        var data = options['data']
        if (data.cooperation) {
          this.cooperation = data.cooperation
        }
        this.type = 'marker';
        this.marker_id = data.id;
        this.id = data.id;
        this.x = point[0];
        this.y = point[1];
        // this.attrs = [
        //   {key: "点位等级", value: Utils.getPatrolLevel(data.patrolLevel)},
        //   {key: "点位属性", value: Utils.getPatrolProperty(data.property)},
        //   {key: "点位地址", value: data.address},
        //   // {key: "点位负责人", value: data.chief},
        //   // {key: "负责人联系方式", value: data.chief},
        //   // {key: "点位巡防人数", value: data.patrolOfficer.length},
        //   // {key: "巡防人员信息", value: data.patrolOfficer.length},
        // ];
        this.obj = data;
        delete options['data'];
      }
    },
    refreshLabel: function() {
      if (!this.label_field) {
        return;
      }
      if (this.layer && this.layer.getRenderStyle() === 1) {
        return;
      }
      var content = '';
      var attrs = this.attrs;
      for (var j = 0; attrs && j < attrs.length; j++) {
        if (attrs[j] && this.label_field == attrs[j].key) {
          content = attrs[j].value || "";
          break;
        }
      }
      if (content && (content = content.toString()) && content.length > 0) {
        this.label = {
          type: 'box',
          text: content.trim().replace(/\n/g,''),
          style: this.getLabelSettings(content)
        };
      }
    },
    refreshText: function(textConfig){
      if (!textConfig) {
        return;
      }

      if (textConfig.show_decoration) {
        this.label = {
          type: "popup",
          hideMarker: true,
          text: this.title,
          style: {
            fillColor: textConfig.background_color,
            color: textConfig.border_color,
            textColor: textConfig.color,
            textFont: 'bold ' + textConfig.size + 'px ' + this.getTextFontFamily(textConfig.font),
            offset: [0,15],
            padding: 32,
            boxHeight: 28,
          }
        };
      } else {
        this.label = {
          type: 'box',
          hideMarker: true,
          text: this.title,
          style: {
            hideBox: true,
            textColor: textConfig.color,
            textFont: 'bold ' + textConfig.size + 'px ' + this.getTextFontFamily(textConfig.font),
            offset: [0, 0],
            padding: 32,
            boxHeight: 28
          }
        };
      }
    },
    getTextFontFamily: function (font) {
      var font_families = ['SimSun', 'Microsoft YaHei', 'KaiTi'];
      if (!font || isNaN(font) || font < 0 || font >= font_families.length) {
        return font_families[0];
      }
      return font_families[font];
    },
    _convertBDSize: function(bdSize){
      return {
        'BMAP_POINT_SIZE_SMALL': [8,8],
        'BMAP_POINT_SIZE_NORMAL': [12,12],
        'BMAP_POINT_SIZE_BIG': [16,16],
        'BMAP_POINT_SIZE_MINI': [4,4]
      }[bdSize];
    },
    convertBDShape: function(bdShape){
      switch(bdShape){
        case "BMAP_POINT_SHAPE_CIRCLE":
          return this.drawCircle;
        case "BMAP_POINT_SHAPE_STAR":
          return this.drawStar;
        case "BMAP_POINT_SHAPE_SQUARE":
          return this.drawBox;
        case "BMAP_POINT_SHAPE_RHOMBUS":
          return this.drawRhombus;
        case "BMAP_POINT_SHAPE_WATERDROP":
          return this.drawCircle;
      }
    },
    drawRhombus: function(iconSize, params){
      var color = params.color;
      var box = new createjs.Shape();
      box.graphics.beginFill(color).drawRect(-iconSize[0]/2, -iconSize[1]/2,iconSize[0],iconSize[1]);
      box.rotation = 45;
      return box;
    },
    drawBox: function(iconSize, params){
      var color = params.color;
      var box = new createjs.Shape();
      box.graphics.beginFill(color).drawRect(-iconSize[0]/2, -iconSize[1]/2,iconSize[0],iconSize[1]);
      return box;
    },
    drawStar: function(iconSize, params){
      var color=params.color;
      var box = new createjs.Shape();
      var len= (iconSize[0] + 8)/2;
      box.graphics.beginFill(color).drawPolyStar(0, 0, len, 5, 0.6, -90);
      return box;
    },
    drawCircle: function(iconSize, params){
      var color = params.color;
      var box = new createjs.Shape();
      var len = iconSize[0] / 2;
      box.graphics.beginFill(color).drawCircle(0, 0, len);
      return box;
    },
    hide: function(){
      this.display = false;
      if (this.layer.getRenderStyle() !== 2) {
        this.layer.hideData([this.feature_id]);
      }
    },
    show: function(){
      this.display = true;
      if (this.layer.getLayerDisplay() === 'show' && this.layer.getRenderStyle() !== 2) {
        this.layer.showData([this.feature_id]);
      }
    },
    getLabelSettings: function(content){
      var layer = map.getDtLayer(this.layer_id, 'marker_layer');
      if (!layer) {
        return null;
      }
      var labelConfig = layer.getLabelConfig();
      var width = _getContentWidthFormBytes(content, this.getIcon().iconSize[1]);
      switch (labelConfig.style_type){
        case 0:
          return {
            color:"#ff0000",
            textFont: 'normal 12px Microsoft YaHei',
            padding: 8,
            boxHeight: 22,
            offset:[parseInt(width / 2),0]
          };
        case 1:
          return {
            color:"#ff0000",
            textFont: 'normal 12px Microsoft YaHei',
            fillOpacity: 0,
            opacity: 0,
            padding: 8,
            boxHeight: 22,
            offset:[0, -24]
          };
        case 2:
          return {
            color:"#000",
            textFont: 'normal 12px Microsoft YaHei',
            padding: 8,
            boxHeight: 22,
            offset:[parseInt(width / 2),0]
          };
        case 3:
          return {
            color:"#484848",
            textFont: 'normal 12px Microsoft YaHei',
            padding: 8,
            boxHeight: 22,
            fillColor:'#484848',
            textColor: 'white',
            offset:[parseInt(width / 2),0]
          };
        case 4:
          return {
            color:"#00A8FF",
            textFont: 'normal 12px Microsoft YaHei',
            padding: 8,
            boxHeight: 22,
            offset:[parseInt(width / 2),0]
          };
      }
    },
    cloneAttrs: function(){
      var cloneAttrs = [];
      for (var i = 0; i < this.attrs.length; i++) {
        var attr = this.attrs[i];
        var cloneAttr = {};
        cloneAttr.field_type = attr.field_type;
        cloneAttr.id = attr.id;
        cloneAttr.is_show = attr.is_show;
        cloneAttr.key = attr.key;
        cloneAttr.value = attr.value;
        cloneAttrs.push(cloneAttr);
      }

      return cloneAttrs;
    },
    setAttrs: function (attrs) {
      this.attrs = attrs;
    },
    getAttr: function (field_id) {
      if (!field_id || !this.attrs || this.attrs.length === 0) {
        return null;
      }
      var key = this.feature_id + '_' + field_id;
      for (var i = 0; i < this.attrs.length; i++) {
        if (this.attrs[i].id === key) {
          return this.attrs[i];
        }
      }
      return null;
    },
    getAttrs: function(){
      return this.attrs;
    },
    updateFromObj: function (obj) {
      if (!obj) {
        return;
      }
      var overlay = this;
      if(obj.lat && obj.lng){
        overlay.setLatLng(L.latLng(obj.lat, obj.lng));
      }
      if(obj.marker_attrs){
        overlay.attrs = obj.marker_attrs;
      }

      if(obj.display != undefined){
        overlay.display = obj.display;
      }

      if(obj.uniform_title){
        overlay.uniform_title = obj.uniform_title;
      }

      if(obj.label_field){
        overlay.label_field = obj.label_field;
      }

      if(obj.label_style_type){
        overlay.label_style_type = obj.label_style_type;
      }

      if(obj.imgs){
        overlay.imgs = obj.imgs;
      }
      if (obj.title) {
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
      if(overlay.obj){
        $.extend(overlay.obj, obj);
      } else {
        overlay.obj = obj;
      }
      // if(obj.display !== undefined){
      //     if (obj.display) {
      //         this.layer.showData([this.feature_id]);
      //     } else {
      //         this.layer.hideData([this.feature_id]);
      //     }
      // }
    },
    setLatLng: function(point){
      this.lnglat = point;
      this.x = point.lng;
      this.y = point.lat;
    },
    getLatLng: function(){
      this.lnglat.x = this.lnglat.lng;
      this.lnglat.y = this.lnglat.lat;
      return this.lnglat;
    },
    setIcon: function(icon){
      if(icon){
        this.icon = {
          iconUrl: icon.options.iconUrl,
          iconSize: icon.options.iconSize
        };
      }
    },
    getIcon: function(){
      return this.icon;
    },
    getPosition: function(){
      return this.getLatLng();
    },
    getImages: function (url, callback) {
      $.ajax({
        url: url,
        data: {id: this.feature_id},
        type: 'get',
        dataType: 'json',
        cache: false,
        success: function (res) {
          if (callback) {
            callback(res.imgs);
          }
        }
      });
    },
    updateToServer: function(options, callback){
      var position = this.getPosition();
      var data = L.Util.extend(options, {
        id: this.feature_id,
        lng: position.lng.toFixed(6),
        lat: position.lat.toFixed(6)
      });
      Utils.ajax2server(update_marker_url, 'PUT', data, function (e) {
        if (callback) {
          callback(e);
        }
      });
    },
    isVisible: function() {
      var layer = map.getDtLayer(this.layer_id, 'marker_layer');
      if (layer.getRenderStyle() === 2) {
        return this.display === true;
      } else {
        var inCanvasLayer = this.layer.canvasLayer.getDataById(this.feature_id, this.layer_id);
        return this.display === true && typeof(inCanvasLayer) !== 'undefined';
      }
    },
    getTitle: function () {
      return this.title;
    },
    updateTitle: function () {
      var title = null;
      for (var i = 0; i < this.attrs.length; i++) {
        var attr = this.attrs[i];
        if (this.uniform_title === attr.key) {
          title = (attr.value && attr.value.toString()) || "";
          break;
        }
      }
      if (title) {
        this.title = title;
      }
      if (this.obj) {
        this.obj.uniform_title = this.uniform_title;
        this.obj.title = this.title;
      }
    },
    disableEditing: function () {
      // disableEditing
    },
    setCooperation: function (cooperation) {
      this.cooperation = cooperation;
      if (this.obj && this.obj.cooperation) {
        this.obj.cooperation = cooperation;
      }
    }
  })
  var _getContentWidthFormBytes = function(content, width){
    var pixelWidth = 6; // 一字节约等于6个像素
    var paddingWidth = 8; // 样式固定padding为8
    var len = content.length;
    var bytes = len;
    for (var i = 0; i < len; i++) {
      // console.log(str[i],str.charCodeAt(i));
      if (content.charCodeAt(i) > 255) bytes++;
    }
    // 计算当前字符串的长度，字节数*像素宽度+当前图片或者元素本身的宽度+内边距宽度得到字符串大概的长度
    return bytes * pixelWidth + width + paddingWidth;
  };

  return DtwyCanvasRenderMarker
})
