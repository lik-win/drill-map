;(function (name, context, factory) {
  // Supports UMD. AMD, CommonJS/Node.js and browser context
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    define(factory)
  } else {
    context[name] = factory()
  }
})('Utils', window, function () {
  'use strict'
  var Utils = {
    ajax2server: function (url, method, async, data, callback, err) {
      $.ajax({
        url: url,
        beforeSend: function (xhrObj) {
          xhrObj.setRequestHeader('x-access-token', localStorage.getItem('token'))
        },
        data: data, type: method, async: async, dataType: 'json', cache: false, success: function (res) {
          if (typeof(callback) !== 'undefined' && callback !== null && typeof(callback) === 'function') {
            callback(res)
          }
        }, error: function (o, s, e) {
          if (err) {
            err(o, s, e)
          }
          var error_msg = '发生错误，再来一次'
          if (o.responseJSON && o.responseJSON.error) {
            error_msg = o.responseJSON.error
          } else if (o.responseJSON && o.responseJSON.msg) {
            error_msg = o.responseJSON.msg
          }
        }
      })
    },
    convertStr2LeafletPath: function (str) {
      if (str != '' && str != null) {
        var results = []
        if (str.indexOf('|') > -1) {
          var ll = str.split('|')
          for (var j = 0; j < ll.length; j++) {
            results.push(Utils.convertStr2LeafletPath(ll[j]))
          }
          return results
        } else {
          var pp = str.split(';')
          for (var i = 0; i < pp.length; i++) {
            results.push(new L.LatLng(pp[i].split(',')[1], pp[i].split(',')[0]))
          }
        }
        return results
      } else {
        return null
      }
    },
    decodePath: function (encoded_path) {
      if (typeof(encoded_path) == 'undefined' || encoded_path == null || encoded_path == '') {
        return null
      }
      var decode_path = []
      var paths = encoded_path.split('0')
      for (var j = 0; j < paths.length; j++) {
        var part = []
        var points = PolylineUtil.decode(paths[j])
        for (var i = 0; i < points.length; i++) {
          part.push(points[i][1] + ',' + points[i][0])
        }
        decode_path.push(part.join(';'))
      }
      return decode_path.join('|')
    },
    decodeMarkerPath: function (encoded_path) {
      if (typeof(encoded_path) == 'undefined' || encoded_path == null || encoded_path == '') {
        return null
      }
      return encoded_path
    },
    initDrawHandler: function (map) {
      L.drawLocal.draw.handlers = {
        circle: {
          tooltip: {
            start: '点击并拖拽绘制圆形.'
          },
          radius: '半径'
        },
        marker: {
          tooltip: {
            start: '点击绘制标注.'
          }
        },
        polygon: {
          tooltip: {
            start: '点击右键开始绘制区域.',
            cont: '点击右键继续绘制.',
            end: '点击起点或双击完成绘制.'
          }
        },
        polyline: {
          error: '<strong>错误:</strong> 线路不能相交!',
          tooltip: {
            start: '点击开始绘制线路.',
            cont: '点击继续绘制.',
            end: '双击完成绘制.'
          }
        },
        rectangle: {
          tooltip: {
            start: '点击并拖拽绘制矩形.'
          }
        },
        simpleshape: {
          tooltip: {
            end: '释放鼠标完成绘制.'
          }
        },
        circlemarker: {
          tooltip: {
            start: '点击开始绘制'
          }
        }
      }
      L.drawLocal.draw.toolbar = {
        actions: {
          title: '取消绘制',
          text: '取消'
        },
        finish: {
          title: '完成绘制',
          text: '完成'
        },
        undo: {
          title: '删除最后绘制的点',
          text: '删除最后一个点位'
        },
        buttons: {
          polyline: '画线',
          polygon: '绘制区域',
          rectangle: '绘制矩形',
          circle: '绘制圆形',
          marker: '绘制标注',
          circlemarker: '绘制圆形标注'
        }
      }
    },
    // 区域等级
    getPatrolLevel: function (level) {
      switch (level) {
        case 0:
          return '一级';
        case 1:
          return '二级';
        case 2:
          return '三级';
      }
    },
    // 区域等级列表
    patrolLevels: function () {
      return [
        {'id': 0, name: '一级'},
        {'id': 1, name: '二级'},
        {'id': 2, name: '三级'}
      ];
    },
    // 防控目标
    getPatrolProperty: function (property) {
      switch (property) {
        case 0:
          return '消防';
        case 1:
          return '烟花爆竹';
        case 2:
          return '日常巡逻';
        case 3:
          return '其他';
      }
    },
    // 防控目标列表
    properties: function () {
      return [
        {'id': 0, name: '消防'},
        {'id': 1, name: '烟花爆竹'},
        {'id': 2, name: '日常巡逻'},
        {'id': 3, name: '其他'}
      ];
    },
    getCaseLevel: function (level) {
      switch (level) {
        case 0:
          return '一级';
        case 1:
          return '二级';
        case 2:
          return '三级';
        case 3:
          return '四级';
      }
    },
    downloadExcel: function (name) {
      window.location = CONFIG_DEFAULT.host + '/plans/' + name + '.xlsx';
    },
    downloadAttendance: function (name) {
      window.location.href = CONFIG_DEFAULT.host + '/attendance/' + name + '.xlsx';
    },
    getRandomNum: function (min, max) {
      return parseInt(Math.random() * (max - min) + min);
    },
    getQueryString: function (name) {
      let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
      let r = window.location.search.substr(1).match(reg);
      if (r !== null) {
        return unescape(r[2]);
      }
      return null;
    },
    checkPhone: function (phone) {
      if (!(/^1[34578]\d{9}$/.test(phone))) {
        return false;
      }
      return true;
    },
    getImage: function (str) {
      let url = CONFIG_DEFAULT.host;
      if (CONFIG_DEFAULT.imghost) {
        url = CONFIG_DEFAULT.imghost;
      }
      if (url.lastIndexOf('/') === url.length - 1) {
        url = url.substr(0, url.length - 1);
      }
      url += CONFIG_DEFAULT.caseDetailImgUrl + str;
      return url;
    },
    cutstr(sourcestr, len) {
      let str = sourcestr;
      if (str.length > len) {
        str = str.substr(0, len - 1);
        str = `${str}...`;
      }
      return str;
    },
    checkNumber(num) {
      if (isNaN(num)) {
        return parseInt(num.replace(/[^0-9,]*/g, ''));
      }
      if (typeof num === 'string') {
        return parseInt(num);
      }
      return num;
    }
  };
  return Utils
})
