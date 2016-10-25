var fs = require("fs");
const readline = require('readline');
var fileName = "Indicators.csv";

var dataArr = [], csvObjArr = [], jsonObjArr = [];
function CSVObj(countryName, countryCode, indicatorName, indicatorCode, year, values) {
  this.countryName = countryName;
  this.countryCode = countryCode;
  this.indicatorName = indicatorName;
  this.indicatorCode = indicatorCode;
  this.year = year;
  this.values = values;
};

const rl = readline.createInterface({
  input: fs.createReadStream(fileName),
  output: process.stdout,
  terminal: false
});

var counter = 0;
rl.on('line', function(line) {
  if(counter === 0){
    dataArr = line;
  }else {
    if(line.indexOf('SP.DYN.LE00.IN') !==-1) {
      var texts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      var obj = new CSVObj(texts[0], texts[1], texts[2], texts[3], texts[4], texts[5]);
      csvObjArr.push(obj);
    }
  }
  counter++;
});
rl.on('close', function () {
  csvObjArr.sort(function(a, b) {
    var value1 = a['values'];
    var value2 = b['values'];
    return value2-value1;
  });
  var finalObject = csvObjArr.slice(0, 5);
  var json = JSON.stringify(finalObject);
  fs.writeFile('jason3.json', json, 'utf-8');
});
