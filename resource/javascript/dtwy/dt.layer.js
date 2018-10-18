DT.Layer = function () {
    this.id = '';
    this.type = "";
    this.title = '';
    this.display = "show";
    this.show_fields = '';
    this.uniform_title = '';
    this.categories = [];
    this.attrs = [];
    this.attr_fields = [];
    this.locate_field = '';
    this.uniform_config = null;
    this.category_config = null;
    this.label_config = {field: null, style_type: 0};
    this.render_style = 0;
};

DT.Layer.prototype = {

    setLayerDisplay: function (display) {
        this.display = display;
    },

    setShowFields: function (show_fields) {
        this.show_fields = show_fields;
    },

    getLayerDisplay: function () {
        return this.display;
    },
    getLayerId: function () {
        return this.id;
    },

    setLayerId: function (layer_id) {
        this.id = layer_id;
    },

    getTitle: function () {
        return this.title;
    },

    setTitle: function (title) {
        this.title = title;
    },

    getTypeLabel: function () {
        if (this.type === 'marker_layer') {
            return "标注";
        } else if (this.type === 'line_layer') {
            return "线路";
        } else if (this.type === 'region_layer') {
            return "区域";
        } else {
            return "";
        }
    },

    getType: function () {
        return this.type;
    },

    setType: function (layer_type) {
        this.type = layer_type;
    },

    getUniformTitle: function () {
        return this.uniform_title;
    },

    setUniformTitle: function (uniform_title) {
        this.uniform_title = uniform_title;
    },

    getLabelConfig: function () {
        return this.label_config;
    },

    setLabelConfig: function (label_config) {
        this.label_config = label_config;
    },

    getAttrs: function () {
        return this.attrs;
    },

    setAttrs: function (attrs) {
        this.attrs = attrs;
    },

    getAttrFields: function () {
        return this.attr_fields;
    },

    getAttrField: function (field) {
        var attr_field = null;
        if (!this.attr_fields) {
            return null;
        }
        for (var i = 0; i < this.attr_fields.length; i++) {
            if (this.attr_fields[i].field === field) {
                attr_field = this.attr_fields[i];
                break;
            }
        }
        return attr_field;
    },

    getNumberFields: function () {
        var number_fields = [];
        for (var i = 0; i < this.attr_fields.length; i++) {
            if (this.attr_fields[i].field_type === 'number') {
                number_fields.push(this.attr_fields[i]);
            }
        }
        return number_fields;
    },

    setAttrFields: function (attr_fields) {
        this.attr_fields = attr_fields;
    },

    getLocateField: function () {
        return this.locate_field;
    },

    setLocateField: function (locate_field) {
        this.locate_field = locate_field;
    },

    getCategories: function () {
        return this.categories;
    },

    getCategory: function (category_id) {
        var category = null;
        if (this.categories && this.categories.length > 0) {
            for (var i = 0; i < this.categories.length; i++) {
                if (this.categories[i] && this.categories[i].id === category_id) {
                    category = this.categories[i];
                    break;
                }
            }
        }
        return category;
    },

    setCategories: function (categories) {
        this.categories = categories;
    },

    getUniformConfig: function () {
        return this.uniform_config;
    },

    setUniformConfig: function (uniform_config) {
        this.uniform_config = uniform_config;
    },

    getCategoryConfig: function () {
        return this.category_config;
    },

    setCategoryConfig: function (category_config) {
        this.category_config = category_config;
    },

    getLabelStyle: function () {
        return this.label_config.style_type;
    }
};

DT.MarkerLayer = function () {
    this.type = 'marker_layer';
    this.markers = new DT.HashMap();
    this.uniform_config = {
        icon_id: null,
        icon_url: null,
        color: 'f86767',
        size: 's',
        symbol: 'null',
        bubble: false,
        is_cluster: false
    };
    this.canvas_config = {
        color: '#f86767',
        size: 'BMAP_POINT_SIZE_SMALL',
        shape: 'BMAP_POINT_SHAPE_CIRCLE'
    };
    this.heatmap_config = {
        gradient: 'one',
        radius: 20,
        max: null,
        field: null
    };
    this.category_config = {
        field: null,
        is_number_field: false,
        method: 'unique',
        level: 2,
        is_categorized: true,
        is_cluster: false,
        size: 's',
        symbol: 'null',
        bubble: true
    };
    this.text_config = {
        color: "#ffffff",
        background_color: "#3ca0d3",
        border_color: "#ede8e4",
        font: 0,
        show_decoration: false,
        size: 12
    };
    this.sort_config = {
        color: 'f86767',
        size: 's',
        type: 'a-z',
        is_cluster: false
    };

    this.getMarkers = function () {
        return this.markers;
    };

    this.setMarkers = function (markers) {
        if (markers instanceof DT.HashMap) {
            this.markers = markers;
        }
    };

    this.getFeaturesCount = function () {
        return this.markers.getSize();
    };

    this.getMarker = function (id) {
        return this.markers.get(id);
    };

    this.setMarker = function (marker) {
        this.markers.update(marker.feature_id, marker);
    };

    this.removeMarker = function (id) {
        this.markers.remove(id);
        var markerArray = this.getMarkers().getArray();
        for (var i = 0; i < markerArray.length; i++) {
            if (markerArray[i].feature_id === id) {
                markerArray.splice(i, 1);
                break;
            }
        }
    };

    this.removeMarkers = function () {
        var markers = this.getMarkers().values();
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            if (marker) {
                marker.remove();
            }
        }
        this.markers.clear();
    };

    this.update = function (layer) {
        this.setTitle(layer.title);
        this.setUniformTitle(layer.uniform_title);
        if (layer.sort_col) {
            this.setAttrs(layer.sort_col.split(','));
        }
        this.setAttrFields(layer.attr_fields);
        this.setLocateField(layer.locate_field);
        this.setCategories(layer.categories);
        this.render_style = parseInt(layer.render_style);
        this.setUniformConfig(layer.uniform_config);
        this.setCanvasConfig(layer.canvas_config);
        this.setHeatmapConfig(layer.heatmap_config);
        this.setCategoryConfig(layer.category_config);
        this.setTextConfig(layer.text_config);
        this.setSortConfig(layer.sort_config);
        this.setLabelConfig(layer.label_config);
    };

    this.getStyleSetting = function () {
        return {
            renderStyle: this.render_style,
            uniformConfig: this.uniform_config,
            canvasConfig: this.canvas_config,
            heatmapConfig: this.heatmap_config,
            categoryConfig: this.category_config,
            textConfig: this.text_config,
            sortConfig: this.sort_config,
            labelConfig: this.label_config,
            layer_type: 'marker_layer'
        };
    };

    this.getCanvasConfig = function () {
        return this.canvas_config;
    };

    this.setCanvasConfig = function (canvas_config) {
        if (canvas_config) {
            this.canvas_config = canvas_config;
        }
    };

    this.getHeatmapConfig = function () {
        return this.heatmap_config;
    };

    this.setHeatmapConfig = function (heatmap_config) {
        if (heatmap_config) {
            this.heatmap_config = heatmap_config;
        }
    };

    this.getTextConfig = function () {
        return this.text_config;
    };

    this.setTextConfig = function (text_config) {
        if (text_config) {
            this.text_config = text_config;
        }
    };

    this.getSortConfig = function () {
        return this.sort_config;
    };

    this.setSortConfig = function (sort_config) {
        if (sort_config) {
            this.sort_config = sort_config;
        }
    };

    this.isCategorized = function () {
        return this.render_style === 6 && this.category_config.is_categorized;
    };

    this.isCluster = function () {
        if (this.render_style === 0) {
            return this.uniform_config.is_cluster;
        } else if (this.render_style === 6) {
            return this.category_config.is_cluster;
        } else if (this.render_style === 5) {
            return this.sort_config.is_cluster;
        } else {
            return false;
        }
    };

    this.hideFeatures = function () {
        if (this.render_style === 2) {
            MarkerUtils.map.removeOverlay(MarkerUtils.map.dt_heatmap[this.id][0]);
        } else if (this.isCluster()) {
            MarkerUtils.map.removeOverlay(MarkerUtils.map.dt_clusterer[this.id]);
        } else {
            var markers = this.getMarkers().values();
            for (var j = 0; j < markers.length; j++) {
                markers[j].hide();
                markers[j].hideLabel();
            }
        }
    };

    this.removeMarkersFromMap = function () {
        var render_style = this.render_style;
        var markers = this.getMarkers().values();
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            if (render_style === 0 && marker instanceof Dtwy.CanvasMarker) {
                marker.remove();
            } else if (render_style === 1 && marker instanceof Dtwy.Marker) {
                marker.remove();
            }
        }
    };
};


DT.RegionLayer = function () {
    this.type = 'region_layer';
    this.regions = new DT.HashMap();
    this.uniform_config = {
        fillColor: '#ff0000',
        fillOpacity: 0.2,
        strokeColor: '#ff0000',
        strokeWeight: 1,
        strokeOpacity: 0.8,
        strokeStyle: 'solid'
    };
    this.category_config = {
        field: null,
        is_number_field: false,
        method: 'unique',
        level: 2,
        is_categorized: true
    };

    this.getRegions = function () {
        return this.regions;
    };

    this.getRegion = function (id) {
        return this.regions.get(id);
    };

    this.getFeaturesCount = function () {
        return this.regions.getSize();
    };

    this.removeRegion = function (id) {
        this.regions.remove(id);
    };

    this.removeRegions = function () {
        var regions = this.getRegions().values();
        for (var i = 0; i < regions.length; i++) {
            var region = regions[i];
            if (region) {
                region.remove();
            }
        }
        this.regions.clear();
    };

    this.update = function (layer) {
        this.setTitle(layer.title);
        this.setUniformTitle(layer.uniform_title);
        if (layer.sort_col) {
            this.setAttrs(layer.sort_col.split(','));
        }
        this.setShowFields(layer.show_fields);
        this.setAttrFields(layer.attr_fields);
        this.setCategories(layer.categories);
        this.render_style = parseInt(layer.render_style);
        this.setUniformConfig(layer.uniform_config);
        this.setCategoryConfig(layer.category_config);
        this.setLabelConfig(layer.label_config);
    };
    this.getStyleSetting = function () {
        return {
            renderStyle: this.render_style,
            uniformConfig: this.uniform_config,
            categoryConfig: this.category_config,
            labelConfig: this.label_config,
            layer_type: 'region_layer'
        }
    };

    this.isCategorized = function () {
        return this.render_style === 1 && this.category_config.is_categorized;
    };

    this.hideFeatures = function () {
        var regions = this.getRegions().values();
        for (var j = 0; j < regions.length; j++) {
            regions[j].hide();
            regions[j].hideLabel();
        }
    };

    this.sort = function (type) {
        if (type === "area") {
            var regions = this.getRegions().values();
            regions.sort(function (a, b) {
                var areaA = 0, areaB = 0;
                if (a instanceof Dtwy.Circle) {
                    areaA = Math.PI * Math.pow(a.getRadius(), 2);
                } else {
                    areaA = L.GeometryUtil.geodesicArea(a.getLatLngs());
                }
                if (b instanceof Dtwy.Circle) {
                    areaB = Math.PI * Math.pow(b.getRadius(), 2);
                } else {
                    areaB = L.GeometryUtil.geodesicArea(b.getLatLngs());
                }
                return areaA < areaB ? 1 : -1
            });
        }
    };
};

DT.LineLayer = function () {
    this.type = 'line_layer';
    this.lines = new DT.HashMap();
    this.uniform_config = {
        strokeColor: '#1087bf',
        strokeWeight: 4,
        strokeOpacity: 0.8,
        strokeStyle: 'solid'
    };
    this.category_config = {
        field: null,
        is_number_field: false,
        method: 'unique',
        level: 2,
        is_categorized: true,
        color_name: 'BuGn',
        color_order: 'asc'
    };

    this.getLines = function () {
        return this.lines;
    };

    this.getLine = function (id) {
        return this.lines.get(id);
    };

    this.getFeaturesCount = function () {
        return this.lines.getSize();
    };

    this.removeLine = function (id) {
        this.lines.remove(id);
    };

    this.removeLines = function () {
        var lines = this.getLines().values();
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line) {
                line.remove();
            }
        }
        this.lines.clear();
    };

    this.update = function (layer) {
        this.setTitle(layer.title);
        this.setUniformTitle(layer.uniform_title);
        if (layer.sort_col) {
            this.setAttrs(layer.sort_col.split(','));
        }
        this.setShowFields(layer.show_fields);
        this.setAttrFields(layer.attr_fields);
        this.setCategories(layer.categories);
        this.render_style = layer.render_style;
        this.setUniformConfig(layer.uniform_config);
        this.setCategoryConfig(layer.category_config);
        this.setLabelConfig(layer.label_config);
    };
    this.getStyleSetting = function () {
        return {
            renderStyle: this.render_style,
            uniformConfig: this.uniform_config,
            categoryConfig: this.category_config,
            labelConfig: this.label_config,
            layer_type: 'line_layer'
        };
    };

    this.isCategorized = function () {
        return this.render_style === 1 && this.category_config.is_categorized;
    };

    this.hideFeatures = function () {
        var lines = this.getLines().values();
        for (var j = 0; j < lines.length; j++) {
            lines[j].hide();
            lines[j].hideLabel();
        }
    };
};

DT.MarkerLayer.prototype = new DT.Layer();
DT.RegionLayer.prototype = new DT.Layer();
DT.LineLayer.prototype = new DT.Layer();
