DT.LineLayer = function () {
  this.type = 'line_layer'
  this.lines = new DT.HashMap()
  this.featureGroup = new L.layerGroup([])
  this.featureAttrs = new DT.HashMap()
  this.options = {}
  this.uniform_config = {
    strokeColor: '#1087bf',
    strokeWeight: 4,
    strokeOpacity: 0.8,
    strokeStyle: 'solid'
  }
  this.category_config = {
    field: null,
    is_number_field: false,
    method: 'unique',
    level: 2,
    is_categorized: true,
    style_settings: {
      stroke_opacity: 0.8,
      stroke_weight: 4,
      stroke_style: 'solid'
    }
  }

  this.addFeaturesToMap = function (lines) {
    var dtLines = []
    for (var i = 0; i < lines.length; i++) {
      lines[i] = this.refactorFeatureJSON(lines[i])
      var line = this.buildFeature(lines[i])
      if (line) {
        line.obj = lines[i]
        this.setFeature(line)
        this.addFeatureToMap(line)
        if (!line.display) {
          line.hide()
        }
        dtLines.push(line)
      }
    }
    if (this.display === 'hide') {
      this.featureGroup.hide()
    }
    return dtLines
  }

  this.showDtLayer = function (syncToServer) {
    syncToServer = syncToServer || false
    var dtLayer = this
    if (syncToServer) {
      _updateDisplayToServer({mid: mid, id: dtLayer.id, display: 'show'}, function () { _showLayer(dtLayer)})
    } else {
      _showLayer(dtLayer)
    }
  }

  this.hideDtLayer = function (syncToServer) {
    syncToServer = syncToServer || false
    var dtLayer = this
    if (syncToServer) {
      _updateDisplayToServer({mid: mid, id: dtLayer.id, display: 'hide'}, function () { _hideLayer(dtLayer)})
    } else {
      _hideLayer(dtLayer)
    }
  }

  this.show = function () {
    this.featureGroup.clearLayers()
    var lines = this.getFeatures()
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i]
      if (line && line.display) {
        this.featureGroup.addLayer(line)
      }
    }
    this.featureGroup.show()
  }

  this.setFeature = function (line) {
    if (line) {
      line.zIndex = this.zIndex
      if (this.getLines().containsKey(line.feature_id)) {
        this.lines.update(line.feature_id, line)
        var lines = this.getFeatureArray()
        for (var i = 0; i < lines.length; i++) {
          if (lines[i].feature_id === line.feature_id) {
            lines[i] = line
            break
          }
        }
      } else {
        this.getLines().put(line.feature_id, line)
        this.getLines().add(line)
      }
    }
  }

  this.updateFeatures = function (lines) {
    for (var i = 0; i < lines.length; i++) {
      var data = this.refactorFeatureJSON(lines[i].obj)
      var feature = this.buildFeature(data)
      if (feature) {
        this.setFeature(feature)
      }
    }
    var allLines = this.getFeatures()
    for (var l = 0; l < allLines.length; l++) {
      if (!allLines[l].display) {
        allLines[l].hide()
      }
      this.featureGroup.addLayer(allLines[l])
    }
  }

  this.getFeature = function (line_id) {
    if (line_id) {
      return this.getLines().get(line_id)
    }
  }

  this.buildFeature = function (data) {
    if (data.path) {
      var line = new Dtwy.Polyline(data.path, {data: data})
      line.obj = data
      if (line.line_route) {
        this.addDirectionMarkerToMap(line)
      }
      if(line.refreshLabel){
        line.refreshLabel(true)
      }
      return line
    }
  }

  this.addDirectionMarkerToMap = function (line) {
    if (line.wayPoints) {
      map.removeOverlay(line.wayPoints)
    }
    line.wayPoints = new L.LayerGroup([])
    var startDom = '<div class=\'way-points\' line-id=\'' + line.feature_id + '\' style=\'background-color:' + line.line_style['strokeColor'] + '\'>起</div>'
    var startPoint = Utils.strLngLat2Point(line.line_route.origin_point.lnglat)
    if (startPoint) {
      var startDivIcon = new L.divIcon({
        html: startDom,
        className: 'leaflet-direction-icon'
      })
      var startP = new Dtwy.Marker(startPoint, {
        icon: startDivIcon,
        zIndexOffset: 1
      })
      line.wayPoints.addLayer(startP)
    }
    for (var w = 0; w < line.line_route.way_points.length; w++) {
      var way_point_dom = '<div class=\'way-points\' line-id=\'' + line.feature_id + '\' style=\'background-color:' + line.line_style['strokeColor'] + '\'>' + (w + 1) + '</div>'
      var point = Utils.strLngLat2Point(line.line_route.way_points[w].lnglat)
      var wayDivIcon = new L.divIcon({
        html: way_point_dom,
        className: 'leaflet-direction-icon'
      })
      var wayP = new Dtwy.Marker(point, {
        icon: wayDivIcon,
        zIndexOffset: 1
      })
      line.wayPoints.addLayer(wayP)
    }
    var startMarkerID = line.line_route.origin_point.marker_id
    var endMarkerID = line.line_route.destination_point.marker_id
    if (startMarkerID !== endMarkerID) {
      var endDom = '<div class=\'way-points\' line-id=\'' + line.feature_id + '\' style=\'background-color:' + line.line_style['strokeColor'] + '\'>终</div>'
      var endPoint = Utils.strLngLat2Point(line.line_route.destination_point.lnglat)
      if (endPoint) {
        var endDivIcon = new L.divIcon({
          html: endDom,
          className: 'leaflet-direction-icon'
        })
        var endP = new Dtwy.Marker(endPoint, {
          icon: endDivIcon,
          zIndexOffset: 1
        })
        line.wayPoints.addLayer(endP)
      }
    }
    var dtLayer = map.getDtLayer(line.layer_id, 'line_layer')
    if (dtLayer.display === 'hide') {
      line.hide()
    }
    if (line.isVisible()) {
      line.wayPoints.addTo(map)
    }
  }

  this.refactorFeatureJSON = function (line) {
    var label_config = this.getLabelConfig()
    if (!label_config) {
      return region
    }
    line.label_field = label_config.field
    line.label_style_type = label_config.style_type
    return line
  }

  this.getLayerData = function (options) {
    var dtLayer = this
    var opts = L.Util.extend({
      layer_id: dtLayer.id,
      type: 'line_layer'
    }, options)
    setTimeout(function () {
      Utils.ajax2server(get_layer_data_url, 'GET', opts, function (res) {
        var lines = res.layer.lines
        dtLayer.addFeaturesToMap(lines)
        DT.Events.fire(DT.Events.LOAD_LAYER_DATA_COMPLETE, [dtLayer])
      })
    }, 100)
  }

  this.getLines = function () {
    return this.lines
  }

  this.getLine = function (id) {
    return this.lines.get(id)
  }

  this.getFeatures = function () {
    return this.lines.values()
  }

  this.setFeatures = function (lines) {
    if (lines instanceof DT.HashMap) {
      this.lines = lines
    }
  }

  this.getFeatureArray = function () {
    return this.lines.array
  }

  this.getFeaturesCount = function () {
    return this.lines.getSize()
  }

  this.clearFeatureArray = function () {
    this.lines.array = []
  }

  this.addFeatureToArray = function (feature) {
    this.getLines().add(feature)
  }

  this.removeFeatures = function () {
    this.clearFeatureGroup()
    this.removeLines()
  }

  this.removeFeature = function (id) {
    var feature = this.getFeature(id)
    this.removeFeatureFromMap(feature)
    this.removeLine(id)
    return feature
  }

  this.removeLine = function (id) {
    this.lines.remove(id)
    var lineArray = this.getFeatureArray()
    for (var i = 0; i < lineArray.length; i++) {
      if (lineArray[i].feature_id === id) {
        lineArray.splice(i, 1)
        break
      }
    }
  }

  this.removeLines = function () {
    var lines = this.getLines().values()
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i]
      if (line) {
        line.remove()
      }
    }
    this.lines.clear()
  }

  this.getStyleSetting = function () {
    return {
      renderStyle: this.render_style,
      uniformConfig: this.uniform_config,
      categoryConfig: this.category_config,
      labelConfig: this.label_config,
      layer_type: 'line_layer'
    }
  }

  this.isCategorized = function () {
    return this.render_style === 1 && this.category_config.is_categorized
  }

  this.hideFeatures = function () {
    var lines = this.getLines().values()
    for (var j = 0; j < lines.length; j++) {
      lines[j].hide()
      lines[j].hideLabel()
    }
  }

  this.getStyleSetting = function () {
    return {
      renderStyle: this.render_style,
      uniformConfig: this.uniform_config,
      categoryConfig: this.category_config,
      labelConfig: this.label_config,
      layer_type: 'line_layer'
    }
  }

  this.updateTitle = function (data) {
    Utils.ajax2server(update_line_layer_url, 'PUT', data, function (res) {
      if (res.status === true) {
        DT.Events.fire(DT.Events.EDIT_LAYER_TITLE_COMPLETE, [data.id, 'line_layer'])
      }
    })
  }

  this.update = function (layer) {
    if (layer.title) {
      this.setTitle(layer.title)
    }
    if (layer.uniform_title) {
      this.setUniformTitle(layer.uniform_title)
    }
    if (layer.sort_col) {
      this.setAttrs(layer.sort_col.split(','))
    }
    if (layer.show_fields) {
      this.setShowFields(layer.show_fields)
    }
    if (layer.attr_fields) {
      this.setAttrFields(layer.attr_fields)
    }
    if (layer.categories) {
      this.setCategories(layer.categories)
    }
    if (layer.render_style != undefined && layer.render_style.toString()) {
      this.setRenderStyle(layer.render_style)
    }
    if (layer.uniform_config) {
      this.setUniformConfig(layer.uniform_config)
    }
    if (layer.category_config) {
      this.setCategoryConfig(layer.category_config)
    }
    if (layer.label_config) {
      this.setLabelConfig(layer.label_config)
    }
    if (layer.display) {
      this.setLayerDisplay(layer.display)
    }
  }

  this.clearFeatureGroup = function () {
    this.featureGroup.clearLayers()
  }

  this.addFeatureToMap = function (feature) {
    this.featureGroup.addLayer(feature)
  }

  this.removeFeatureFromMap = function (feature) {
    if (feature) {
      this.featureGroup.removeLayer(feature)
    }
  }

  this.fitBounds = function () {
    var features = this.getFeatures()
    var bounds = new L.latLngBounds()
    for (var i = 0; i < features.length; i++) {
      var feature = features[i]
      if (feature && feature._map) {
        bounds.extend(feature.getBounds())
      }
    }
    if (bounds.isValid()) {
      // map.fitBounds(bounds);
      map.flyToBounds(bounds)
    }
  }

  this.saveFeature = function (feature, attrs, callback) {
    var attr, label_config = this.getLabelConfig()
    if (feature.label !== null && label_config.field && label_config.field.length !== 0) {
      for (var j = 0; j < feature.attrs.length; j++) {
        attr = feature.attrs[j]
        if (attr && label_config.field === attr.key) {
          if (feature.getLabel()) {
            feature.getLabel().setContent(attrs[attr.id])
          }
          break
        }
      }
    }
    var currentFeatureAttrs = feature.cloneAttrs()
    var is_changed = this._isAttrsChanged(feature, attrs)
    if (is_changed) {
      Utils.ajax2server(update_line_attrs_url, 'PUT', {
        attrs: attrs,
        id: feature.feature_id,
        mid: mid
      }, function (e) {
        if (callback) {
          callback(e, feature, is_changed)
        }
      }, function (error) {
        if (error.status == 400) {
          feature.attrs = currentFeatureAttrs
          callback(error, feature, is_changed)
        }
      })
    } else {
      if (callback) {
        callback(null, feature, is_changed)
      }
    }
  }

  this.filterFeatures = function (filterFunction, filterGroup, redraw, limit) {
    var _filterFeatures = new DT.HashMap()
    if (typeof(filterFunction) === 'undefined' || filterFunction === null) {
      return _filterFeatures
    }
    if (typeof(limit) === 'undefined' || limit === null || isNaN(limit)) {
      limit = 999999999
    } else {
      limit = parseInt(limit)
    }
    var features = this.getFeatures()
    for (var i = 0; i < features.length; i++) {
      var feature = features[i]
      if (!feature) {
        continue
      }
      if (filterFunction(feature)) {
        _filterFeatures.put(feature.feature_id, feature)
        if (typeof(filterGroup) !== 'undefined' && filterGroup !== null) {
          filterGroup.addLayer(feature)
          if (feature.label && feature.label instanceof BMap.Label) {
            feature.label.show()
          }
        }
      }
      if (_filterFeatures.getSize() >= limit) {
        break
      }
    }
    return _filterFeatures
  }

  var _showLayer = function (dtLayer) {
    dtLayer.setLayerDisplay('show')
    dtLayer.show()
  }

  var _hideLayer = function (dtLayer) {
    dtLayer.setLayerDisplay('hide')
    dtLayer.hide()
  }

  var _updateDisplayToServer = function (payload, callback) {
    Utils.ajax2server(line_layer_display_url, 'POST', payload, function () {
      if (callback) {
        callback()
      }
    })
  }
}

DT.LineLayer.prototype = new DT.Layer()
