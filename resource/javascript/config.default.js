export const baseConfig = {
  // 访问百度接口 ak 值
  baiduAk: 'LyRXDEGBixFCj7wyGl1ZE053',
  // 地图瓦片是否显示
  tileShow: false,
  // 区域颜色系列
  colors:[
    '#90d7ec',
    '#3991C3',
    '#0073CD',
    '#005AB7',
    '#005099',
    '#4F589E',
    '#2874AD',
    '#3CAEFF',
    '#4F93AF',
    '#09A3BC',
    '#A5DDD5'
  ],
  // 城市是否显示
  citiesMarkerShow: true,
  // 区域active颜色， 默认：#00FFFE
  hoverColor: '',
  // 地图展示层级，  1：市 => 地图；2：县 => 地图
  mapFromLevel: 2,
  map: {
    // 地图初始缩放比例
    level: 5,
    // 地图初始中心坐标
    center: '104.051711, 37.46694'
  },
};
