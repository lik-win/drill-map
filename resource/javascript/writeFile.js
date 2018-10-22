let https = require('https');
let http = require('http');
let fs = require('fs');

function getData(name) {
  https.get(`https://data.dituwuyou.com/biz/district/search?name=${encodeURI(name)}&level=1&sub=1&polygon=true&subPolygon=true&provinceScale=0.12&cityScale=0.12&countyScale=0.12`, (res) => {
    var resData = "";
    res.on("data",function(data){
      resData += data;
    });
    res.on("end", function() {
      write(name, resData);
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}

function write(fileName, txt) {
  fs.writeFile(`${fileName}.json`, txt, function (err) {
    if (err) {
      return console.error(err);
    }
  });
}

getData('');
