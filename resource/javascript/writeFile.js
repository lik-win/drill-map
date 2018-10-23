let request = require('request-promise');
let fs = require('fs');

async function getData(name) {

  let provinceOptions = {
    url: 'https://data.dituwuyou.com/biz/district/search/',
    qs: {
      name: name,
      level: 1,
      sub: 1,
      polygon: true,
      subPolygon: true,
      provinceScale: 0.12,
      cityScale: 0.12,
      countyScale: 0.12,
    },
    json: true,
  };
  let provinceRes = await request(provinceOptions);
  const optionsPro = {
    url: 'http://api.map.baidu.com/geocoder/v2/',
    qs: {
      ak: 'LyRXDEGBixFCj7wyGl1ZE053',
      output: 'json',
      address: provinceRes.data && provinceRes.data.length > 0 ? provinceRes.data[0].name : ''
    },
    json: true,
  };
  const provinceLngLat = await request(optionsPro);
  // if(province['result'] && province['result']['location']){
  // 省一级经纬度
  provinceRes.data[0]['lng'] = provinceLngLat['result']['location']['lng'];
  provinceRes.data[0]['lat'] = provinceLngLat['result']['location']['lat'];
  // }

  if (provinceRes['data'][0]['children'] && provinceRes['data'][0]['children'].length > 0) {

    for (let i = 0; i < provinceRes['data'][0].children.length; i++) {
      let cityChild = provinceRes['data'][0];
      const options = {
        url: 'http://api.map.baidu.com/geocoder/v2/',
        qs: {
          ak: 'LyRXDEGBixFCj7wyGl1ZE053',
          output: 'json',
          city: cityChild.name,
          address: cityChild.children[i]['name']
        },
        json: true,
      };
      const cityLngLat = await request(options);
      if (cityLngLat['result'] && cityLngLat['result']['location']) {
        // 市一级经纬度
        cityChild.children[i]['lng'] = cityLngLat['result']['location']['lng'];
        cityChild.children[i]['lat'] = cityLngLat['result']['location']['lat'];
      }

      let cityOptions = {
        url: 'https://data.dituwuyou.com/biz/district/search/',
        qs: {
          json: true,
          name: cityChild['children'][i]['name'],
          level: 2,
          sub: 1,
          polygon: true,
          subPolygon: true,
          provinceScale: 0.12,
          cityScale: 0.12,
          countyScale: 0.12,
        },
      };
      let countyRes = await request(cityOptions);
      if (countyRes.success) {
        let countyChild = countyRes['data'][0];
        if (countyChild['children'] && countyChild['children'].length > 0) {
          for (let j = 0; j < countyChild['children'].length; j++) {
            const options = {
              url: 'http://api.map.baidu.com/geocoder/v2/',
              qs: {
                ak: 'LyRXDEGBixFCj7wyGl1ZE053',
                output: 'json',
                city: cityChild.children[i].name,
                address: countyChild.children[j]['name']
              },
              json: true,
            };
            const countyLngLat = await request(options);
            if (countyLngLat['result'] && countyLngLat['result']['location']) {
              countyChild.children[j]['lng'] = countyLngLat['result']['location']['lng'];
              countyChild.children[j]['lat'] = countyLngLat['result']['location']['lat'];
            }
            cityChild.children[i]['children'] = countyChild['children'];
          }
        }
      }
    }
  }
  write(name, JSON.stringify(provinceRes));

}

function write(fileName, txt) {
  fs.writeFile(`data/${fileName}.json`, txt, function (err) {
    if (err) {
      return console.error(err);
    }
  });
}

let provinceList = [
  // {"name": "北京市"},
  // {"name": "天津市"},
  // {"name": "河北省"},
  // {"name": "山西省"},
  // {"name": "内蒙古"},
  // {"name": "辽宁省"},
  // {"name": "吉林省"},
  // {"name": "上海市"},
  // {"name": "江苏省"},
  // {"name": "浙江省"},
  // {"name": "福建省"},
  // {"name": "江西省"},
  // {"name": "山东省"},
  // {"name": "河南省"},
  // {"name": "湖北省"},
  // {"name": "湖南省"},
  // {"name": "广东省"},
  // {"name": "重庆市"},
  // {"name": "贵州省"},
  // {"name": "云南省"},
  // {"name": "甘肃省"},
  // {"name": "青海省"},
  // {"name": "宁夏"},
  // { "name": "台湾省"},
  // {"name": "四川省"},
  // {"name": "安徽省"},
  // {"name": "海南省"},
  // {"name": "陕西省"},
  // {"name": "西藏"},
  // {"name": "新疆"},
  // {"name": "黑龙江省"},
  // {"name": "广西"},
  // {"name": "香港"},

  {"name": "澳门"}
];

for (let i = 0; i < provinceList.length; i++) {
  getData(provinceList[i]['name']);
}
