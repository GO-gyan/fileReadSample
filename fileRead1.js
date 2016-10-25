var fs = require("fs");
const readline = require('readline');
var fileName = "Indicators.csv";
var dataArr = [], csvObjArr = [], jsonObjArr = [];
var asianCountryCode = ['AFG', 'ARM', 'AZE', 'BHR', 'BGD', 'BTN', 'BRN', 'KHM', 'CHN', 'CXR', 'CCK', 'IOT', 'GEO', 'HKG', 'IND', 'IDN', 'IRN', 'IRQ',
                   'ISR', 'JPN', 'JOR', 'KAZ', 'KWT', 'KGZ', 'LAO', 'LBN', 'MAC', 'MYS', 'MDV', 'MNG', 'MMR', 'NPL', 'PRK', 'OMN', 'PAK', 'PSE', 'PHL',
                   'QAT', 'SAU', 'SGP', 'KOR', 'LKA', 'SYR', 'TWN', 'TJK', 'THA', 'TUR', 'TKM', 'ARE', 'UZB', 'VNM', 'YEM'];
var indicatorCode1 = ['SP.DYN.LE00.FE.IN', 'SP.DYN.LE00.MA.IN'];

function CSVObj(countryName, countryCode, indicatorName, indicatorCode, year, values) {
  this.countryName = countryName;
  this.countryCode = countryCode;
  this.indicatorName = indicatorName;
  this.indicatorCode = indicatorCode;
  this.year = year;
  this.values = values;
};
function JSONObj(countryName, indicator, averageValue) {
  this.countryName = countryName;
  this.indicator = indicator;
  this.averageValue = averageValue;
}

const rl = readline.createInterface({
  input: fs.createReadStream(fileName),
  output: process.stdout,
  terminal: false
});
var counter = 0, count, sum, average = 0, indicator = '', countryName = '';
rl.on('line', function(line) {
  if(counter === 0){
    dataArr = line;
  }else {
    for(var j=0; j < indicatorCode1.length; j++) {
      if(line.indexOf(indicatorCode1[j]) !==-1) {
        for(var i = 0; i < asianCountryCode.length; i++) {
          if(line.indexOf(asianCountryCode[i]) !==-1) {
            var texts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            var obj = new CSVObj(texts[0], texts[1], texts[2], texts[3], texts[4], texts[5]);
            csvObjArr.push(obj);
          }
        }
      }
    }
  }
  //console.log(line[0]);
  counter++;
});
function findAverage(sum, count) {
    average = sum/count;
    //console.log('Sum::'+sum);
}
function createJSONObject(countryName, indicator, average) {
    //console.log(sum+'==>'+indicator+'==>'+countryName);
    var obj = new JSONObj(countryName, indicator, average);
    jsonObjArr.push(obj);
}
rl.on('close', function() {
  var headers = dataArr.split(',');

  for(var y=0; y < indicatorCode1.length; y++){
    for(var x=0; x < asianCountryCode.length; x++) {
      count = 0;
      sum = 0;
      for(var z=0; z < csvObjArr.length; z++) {
        if((csvObjArr[z].countryCode === asianCountryCode[x]) && (csvObjArr[z].indicatorCode === indicatorCode1[y])) {
          count++;
          sum = sum + Number.parseFloat(csvObjArr[z].values);
          countryName = csvObjArr[z].countryName;
        }
      }
      if((sum !== 0 && sum !== undefined) && (count !== 0 && count !== undefined)){
        findAverage(sum, count);
      }
      if((countryName !== null && countryName !== undefined) && (indicatorCode1[y] !== null && indicatorCode1[y] !== undefined) && (average !== 0 && average !== undefined) && (sum !== 0 && sum !== undefined) && (count !== 0 && count !== undefined)) {
        createJSONObject(countryName, indicatorCode1[y], average);
      }
    }

  }

  var json = JSON.stringify(jsonObjArr);
  fs.writeFile('jason1.json', json, 'utf-8');

});
