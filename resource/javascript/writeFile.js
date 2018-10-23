let request = require('request-promise');
let https = require('https');
let fs = require('fs');

function getData(name) {

  https.get(`https://data.dituwuyou.com/biz/district/search?name=${encodeURI(name)}&level=1&sub=2&polygon=true&subPolygon=true&provinceScale=0.12&cityScale=0.12&countyScale=0.12`, (res) => {
    let resData = '';
    res.on("data", function (data) {
      resData += data;
    });
    res.on("end", async function () {
      let aa = JSON.parse(resData);
      console.log(aa.data[0].name);
      const optionsPro = {
        url: 'http://api.map.baidu.com/geocoder/v2/',
        qs: {
          ak: 'xlbBFeF4xY3v9wbLNSPRqMFYvggSU7Mu',
          output: 'json',
          address: aa.data[0].name
        },
        json: true,
      };
      const province = await request(optionsPro);
      if(province['result'] && province['result']['location']){
        aa.data[0]['lng'] = province['result']['location']['lng'];
        aa.data[0]['lat'] = province['result']['location']['lat'];
      }
      if(aa.data[0].children){
        for (let i = 0; i < aa.data[0].children.length; i++) {
          let child = aa.data[0];
          const options = {
            url: 'http://api.map.baidu.com/geocoder/v2/',
            qs: {
              ak: 'xlbBFeF4xY3v9wbLNSPRqMFYvggSU7Mu',
              output: 'json',
              city: child.name,
              address: child.children[i]['name']
            },
            json: true,
          };
          const cityRes = await request(options);
          if(cityRes['result'] && cityRes['result']['location']){
            child.children[i]['lng'] = cityRes['result']['location']['lng'];
            child.children[i]['lat'] = cityRes['result']['location']['lat'];
          }
          if (child.children[i]['children']) {
            let counties = child.children[i]['children'];
            for (let j = 0; j < counties.length; j++) {
              let child = aa.data[0];
              const countyOptions = {
                url: 'http://api.map.baidu.com/geocoder/v2/',
                qs: {
                  ak: 'xlbBFeF4xY3v9wbLNSPRqMFYvggSU7Mu',
                  output: 'json',
                  city: child.children[i]['name'],
                  address: counties[j]['name']
                },
                json: true,
              };
              const county = await request(countyOptions);
              if (county['result'] && county['result']['location']) {
                counties[j]['lng'] = county['result']['location']['lng'];
                counties[j]['lat'] = county['result']['location']['lat'];
              }
            }
          }
        }
      }
      write(name, JSON.stringify(aa));
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}

function write(fileName, txt) {
  fs.writeFile(`data/${fileName}.json`, txt, function (err) {
    if (err) {
      return console.error(err);
    }
  });
}

// 广西省/新疆/内蒙古/山西省/台湾省/香港

let provinceList = [
  {"name": "北京市"},
  {"name": "天津市"},
  {"name": "河北省"},
  {"name": "山西省"},
  {"name": "内蒙古"},
  {"name": "辽宁省"},
  {"name": "吉林省"},
  {"name": "黑龙江省"},
  {"name": "上海市"},
  {"name": "江苏省"},
  {"name": "浙江省"},
  {"name": "安徽省"},
  {"name": "福建省"},
  {"name": "江西省"},
  {"name": "山东省"},
  {"name": "河南省"},
  {"name": "湖北省"},
  {"name": "湖南省"},
  {"name": "广东省"},
  {"name": "广西省"},
  {"name": "海南省"},
  {"name": "重庆市"},
  {"name": "四川省"},
  {"name": "贵州省"},
  {"name": "云南省"},
  {"name": "西藏"},
  {"name": "陕西省"},
  {"name": "甘肃省"},
  {"name": "青海省"},
  {"name": "宁夏"},
  {"name": "新疆"},
  { "name": "台湾省"},
  { "name": "香港"},
  { "name": "澳门"}
];

for (let i = 0; i < provinceList.length; i++) {
  getData(provinceList[i]['name']);
}
