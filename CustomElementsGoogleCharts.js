// Initialization
var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var phantomProxy = require('phantom-proxy');
var fs = require('fs');
var util = require('util');
var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var CR = String.fromCharCode(13);

// Set the port number
// router.listen(8095);
//Router usage: Log to the console time any http protocol gets used ( Get, Put , Post Delete )
router.use( (req,res,next) => {
    console.log('Time: ' , Date.now());
      
    next();
  });

router.get("/", function(req, res) {
res.send("<button>");
});

router.get("/api/about", function(req, res) {
logInfo("About");
res.send("Google Visualizations");
});

router.get("/api/formats", function(req, res) {
logInfo("Start Format");
var format = {"formats": ["text/html", "image/png"]};
res.setHeader('Content-Type', 'routerlication/json');
res.send(JSON.stringify(format));
logInfo("Stop Format");
});

router.get("/api/visualizations", function(req, res) {
logInfo("Start Visualizations");
res.setHeader('Content-Type', 'routerlication/json');
res.send(JSON.stringify(factory));
logInfo("Stop Visualizations");
});

router.get("/api/visualizations/:vizid/feeds", function(req, res) {
logInfo("Start feeds");
var viz = factory.getViz(req.params.vizid);
logInfo(" Viz ID => " + viz.name);

var feedArray = [];
if (!(viz.categoryAxisMin == 0 && viz.categoryAxisMax == 0)) {
feedArray.push(
{
"id": "category-axis",
"name": viz.categoryAxisName,
"description": viz.categoryAxisDesc,
"axis": "0",
"type": "dimension",
"min": ""+viz.categoryAxisMin+"",
"max": ""+viz.categoryAxisMax+""
}
);
}
if (!(viz.regionColorMin == 0 && viz.regionColorMax == 0)) {
feedArray.push(
{
"id": "region-color",
"name": viz.regionColorName,
"description": viz.regionColorDesc,
"axis": "1",
"type": "dimension",
"min": ""+viz.regionColorMin+"",
"max": ""+viz.regionColorMax+""
}
);
}
if (!(viz.primaryValueMin == 0 && viz.primaryValueMax == 0)) {
feedArray.push(
{
"id": "primary-values",
"name": viz.primaryValueName,
"description": viz.primaryValueDesc,
"type": "measure",
"min": ""+viz.primaryValueMin+"",
"max": ""+viz.primaryValueMax+""
}
);
}
var feeds = {
"feeds": feedArray
};
res.setHeader('Content-Type', 'routerlication/json');
logInfo(feeds.feeds);
res.send(JSON.stringify(feeds));
logInfo("Stop feeds");
});

router.post("/api/visualizations/:vizid/render", function(req, res) {
logInfo("Start Render");
var viz = factory.getViz(req.params.vizid);
var html = viz.generate(req);
var height = req.body.height;
var width = req.body.width;
var format = req.headers.accept;
logInfo(" Viz ID => "+viz);

// Bitmap generation
if(format == "image/png") {
var self = this;
var randomnumber=Math.floor(Math.random()*101)
var path = 'html_page_'+randomnumber+'.html';
fs.writeFileSync(path, "html");
phantomProxy.create(function(proxy) {
proxy.page.open(path, function (result) {
proxy.page.set('viewportSize', { width: width, height: height });
proxy.page.set('clipRect', { top: 0, left: 0, width: width, height: height });
proxy.page.waitForSelector("#chart", function (result){
proxy.page.renderBase64('PNG', function(result){
var bitmap = new Buffer(result, 'base64');
res.writeHead(200, {'Content-Type': 'image/png' });
res.end(bitmap, 'binary');
phantomProxy.end();
fs.unlinkSync(path); // Delete temp file
});
});
});
});
}

// HTML generation
else {
res.writeHead(200, {'Content-Type': 'text/html' });
res.end(html);
}
logInfo("Stop Render");
});

var VizFactory = function() {
this.visualizations = [];
this.getViz = function(id) {
for (var index = 0 ; index < this.visualizations.length ; index++) {
if (this.visualizations[index].id === id) return this.visualizations[index];
}
};
};

var Visualization = function(id, name, catMin, catMax, regMin, regMax, valMin, valMax, catName, catDesc, regName, regDesc, valName, valDesc) {
this.id = id;
this.name = name;
this.categoryAxisMin = catMin;
this.categoryAxisMax = catMax;
this.categoryAxisName = catName;
this.categoryAxisDesc = catDesc;
this.regionColorMin = regMin;
this.regionColorMax = regMax;
this.regionColorName = regName;
this.regionColorDesc = regDesc;
this.primaryValueMin = valMin;
this.primaryValueMax = valMax;
this.primaryValueName = valName;
this.primaryValueDesc = valDesc;
};

/*******************
* Google Pie Chart
*
* 1: ID
* 2: Name
* 3: Category feeds min = 1
* 4: Category feeds max = 1
* 5: Region feeds min = 0 (optional)
* 6: Region feeds max = 1
* 7: Value feeds min = 1
* 8: Value feeds max = 1
* 9: Category feeds name
* 10: Category feeds description
* 11: Region feeds name
* 12: Region feeds description
* 13: Value feeds name
* 14: Value feeds description
*/

var vizPie = new Visualization("googlepie", "Google Pie", 1, 1, 0, 1, 1, 1, "Sectors Dimension", "Dimension on which the pie will be splitted", "Treillis Dimension", "Dimension to repeat the pies", "Measure", "Measure values");

vizPie.generate = function(req) {
// var w = req.body.width?req.body.width:1000;
// var h = req.body.height?req.body.height:1000;
var w = 900;
var h = 900;
var hCell = h;
var dimData = getData(req, getFeedings(req, "category-axis")[0].dataId);
var regFeed = getFeedings(req, "region-color");
var mesData = getData(req, getFeedings(req, "primary-values")[0].dataId);
var count0 = 1;
var count1 = 1;
var values = [];
var value = [];

if (regFeed) {
if (regFeed.length === 1) {
var regData0 = getData(req, regFeed[0].dataId);
count0 = regData0.values.rawvalues.length;
for (var j = 0 ; j < count0 ; j++) {
value = [];
var reg = regData0.values.rawvalues[j];
for (var i = 0 ; i < dimData.values.rawvalues.length ; i++) {
var dim = dimData.values.rawvalues[i];
var mes = mesData.values.rawvalues[j][i];
if (mes == 1.7e+308) mes = 0; // 1.7e+308 = WebI overflow
value.push([dim.toString(), mes]);
}
values.push(value);
}
} else {
var regData0 = getData(req, regFeed[0].dataId);
var regData1 = getData(req, regFeed[1].dataId);
var regValues0 = distinct(regData0.values.rawvalues);
var regValues1 = distinct(regData1.values.rawvalues);
count0 = regValues0.length;
count1 = regValues1.length;
hCell = Math.floor(h/count1);
var allData = {};
for (var i = 0 ; i < mesData.values.rawvalues.length ; i++) {
if (!allData[regData0.values.rawvalues[i]]) allData[regData0.values.rawvalues[i]] = {};
allData[regData0.values.rawvalues[i]][regData1.values.rawvalues[i]] = mesData.values.rawvalues[i];
}
for (var j = 0 ; j < count1 ; j++) {
for (var i = 0 ; i < count0 ; i++) {
var k = i + count0*j;
value = [];
if (allData[regValues0[i]] && allData[regValues0[i]][regValues1[j]]) {
var m = allData[regValues0[i]][regValues1[j]];
for (var l = 0 ; l < dimData.values.rawvalues.length ; l++) {
var dim = dimData.values.rawvalues[l];
var mes = m[l];
if (mes == 1.7e+308) mes = 0;
value.push([dim.toString(), mes]);
}
}
values.push(value);
}
}
}
} else {
for (var i = 0 ; i < dimData.values.rawvalues.length ; i++) {
var dim = dimData.values.rawvalues[i];
var mes = mesData.values.rawvalues[i];
if (mes == 1.7e+308) mes = 0;
value.push([dim.toString(), mes]);
}
values.push(value);
}
var html =
'<!DOCTYPE html>' + CR +
'<html style="height:100%; display:table">' + CR +
' <head>' + CR +
' <script type="text/javascript" src="https://www.google.com/jsapi"></script>' + CR +
' <script type="text/javascript">' + CR +
' google.load("visualization", "1.0", {"packages":["corechart"]});' + CR +
' google.setOnLoadCallback(drawChart);' + CR +
' function drawChart() {' + CR +
' var data, chart;' + CR;
for (var j = 0 ; j < count1 ; j++) {
for (var i = 0 ; i < count0 ; i++) {
var k = j + count1 * i;
html +=
' data = new google.visualization.DataTable();' + CR +
' data.addColumn("string", "' + dimData.title + '");' + CR +
' data.addColumn("number", "' + mesData.title + '");' + CR +
' data.addRows(' + JSON.stringify(values[k]) + ');' + CR +
' var options = {' + CR;
if (count1 > 100) {
html += ' title: "' + regValues1[j] + ' / ' + regValues0[i] + '",' + CR;
} else if (count0 > 100) {
html += ' title: "' + regData0.values.rawvalues[k] + '",' + CR;
}
html +=
' backgroundColor: "transparent",' + CR +
' legend: "none"' + CR +
' };' + CR +
' new google.visualization.PieChart(document.getElementById("chart_cell_' + j + '_' + i + '")).draw(data, options);;' + CR;
}
}
html +=
' }' + CR +
' </script>' + CR +
' </head>' + CR +
' <body style="border:0; margin:0; padding:0; height:100%; vertical-align:middle; display:table-cell">' + CR +
' <table style="border:0; margin:0; padding:0; width:100%; height:100%; table-layout:fixed">' + CR;
for (var j = 0 ; j < count1 ; j++) {
html += ' <tr style="border:0; margin:0; padding:0″>' + CR;
for (var i = 0 ; i < count0 ; i++) {
var k = i + i*j;
html += ' <td style="border:0; margin:0; padding:0; height:' + hCell + 'px" id="chart_cell_' + j + '_' + i + '"></td>' + CR;
}
html += ' </tr>' + CR;
}
html +=
' </table>' + CR +
' </body>' + CR +
'</html>' + CR;
return html;
};

/*********************
* Google Gauge Chart
*
* 1: ID
* 2: Name
* 3: Category feeds min = 1
* 4: Category feeds max = 1
* 5: Region feeds min = 0 (unused)
* 6: Region feeds max = 0 (unused)
* 7: Value feeds min = 1
* 8: Value feeds max = 1
* 9: Category feeds name
* 10: Category feeds description
* 11: Region feeds name
* 12: Region feeds description
* 13: Value feeds name
* 14: Value feeds description
*/
var vizGauge = new Visualization("googlegauge", "Google Gauge", 1, 1, 0, 0, 1, 1, "Gauge Dimension", "Dimension values to repeat the gauges", "N/A", "N/A", "Measure", "Gauge value (should be 1 to 100)")

vizGauge.generate = function(req) {
var w = req.body.width?req.body.width:800;
var h = req.body.height?req.body.height:800;
var dimData = getData(req, getFeedings(req, "category-axis")[0].dataId);
var mesData = getData(req, getFeedings(req, "primary-values")[0].dataId);
var values = [['Label', 'Value']];
var RenderingValues = [];

for (var i = 0 ; i < dimData.values.rawvalues.length ; i++) {
values.push([dimData.values.rawvalues[i], 0]);
RenderingValues.push(mesData.values.rawvalues[i]);
}
var html =
'<!DOCTYPE html>' + CR +
'<html style="height:100%; margin:auto; display:table">' + CR +
' <head>' + CR +
' <script type="text/javascript" src="https://www.google.com/jsapi"></script>' + CR +
' <script type="text/javascript">' + CR +
' google.load("visualization", "1", {packages:["gauge"]});' + CR +
' google.setOnLoadCallback(drawChart);' + CR +
' function drawChart() {' + CR +
' var data = google.visualization.arrayToDataTable(' + CR +
' ' + JSON.stringify(values) + CR +
' );' + CR +
' var options = {' + CR +
' width:' + w + ',' + CR +
' height:' + h + ',' + CR +
' greenFrom: 0,' + CR +
' greenTo: 20,' + CR +
' redFrom: 90,' + CR +
' redTo: 100,' + CR +
' yellowFrom:75,' + CR +
' yellowTo: 90,' + CR +
' minorTicks: 5,' + CR +
' animation : {' + CR +
' duration: 2500,' + CR +
' easing: "out"' + CR +
' }' + CR +
' };' + CR +
' var chart = new google.visualization.Gauge(document.getElementById("chart_div"));' + CR +
' chart.draw(data, options);' + CR +
' setInterval(function() { '+ CR;
for(var j = 0;j < values.length-1 ; j++){
html += 'data.setValue('+j+',1,'+ RenderingValues[j] +');' + CR;
}
html +=
' chart.draw(data,options);' + CR +
' }, 1000);' + CR +
' }' + CR +
' </script>' + CR +
' </head>' + CR +
' <body style="border:0; margin:0; padding:0; height:100%; vertical-align:middle; display:table-cell">' + CR +
' <div style="border:0; margin:0; padding:0″ id="chart_div" onmouseover="drawChart();"></div>' + CR +
' </body>' + CR +
'</html>' + CR;
return html;
};

/************************
* Google Sankey Diagram
*
* 1: ID
* 2: Name
* 3: Category feeds min = 2
* 4: Category feeds max = 2
* 5: Region feeds min = 0 (unused)
* 6: Region feeds max = 0 (unused)
* 7: Value feeds min = 1
* 8: Value feeds max = 1
* 9: Category feeds name
* 10: Category feeds description
* 11: Region feeds name
* 12: Region feeds description
* 13: Value feeds name
* 14: Value feeds description
*/
var vizSankey = new Visualization("googlesankey", "Google Sankey", 2, 2, 0, 0, 1, 1, "Source & Destination Dimensions", "Source and destination dimensions", "N/A", "N/A", "Measure", "Measure values")

vizSankey.generate = function(req) {
var w = req.body.width?req.body.width:1100;
var h = req.body.height?req.body.height:900;
var dimCount = getFeedings(req,"category-axis").length;
var mesCount;
var values = [];
var V = [];
var mesData;
var FromDimId, FromDimData, ToDimId, ToDimData;

if(getFeedings(req,"primary-values")){
mesCount = getFeedings(req,"primary-values").length;
} else {
mesCount = 0;
}
for(var j = 0; j < dimCount-1; j++){
if(mesCount == 1){
mesData = getData(req, getFeedings(req, "primary-values")[0].dataId);
} else if(mesCount == dimCount-1){
mesData = getData(req, getFeedings(req, "primary-values")[j].dataId);
}
FromDimId = getFeedings(req, "category-axis")[j].dataId;
ToDimId = getFeedings(req, "category-axis")[j+1].dataId;
FromDimData = getData(req, FromDimId );
ToDimData = getData(req, ToDimId);
for (var i = 0 ; i < FromDimData.values.rawvalues.length; i++) {
var From = FromDimData.values.rawvalues[i];
var To = ToDimData.values.rawvalues[i];
if(From == To){
To += ' ' + ToDimData.title;
ToDimData.values.rawvalues[i] = To;
}
if(!V[From]){
V[From]= {};
}
if(!V[From][To]){
V[From][To]= 0;
}
if(!mesCount){
V[From][To] += 1; // =1 if no ponderation desired
} else {
V[From][To] += mesData.values.rawvalues[i];
}
}
FromDimLov = distinct(FromDimData.values.rawvalues);
ToDimLov = distinct(ToDimData.values.rawvalues);
for(var k = 0; k < FromDimLov.length;k++){
for(var l = 0; l < ToDimLov.length; l++){
if(V[FromDimLov[k]][ToDimLov[l]]){
values.push([FromDimLov[k],ToDimLov[l],V[FromDimLov[k]][ToDimLov[l]]]);
}
}
}
}
var html =
'<!DOCTYPE html>' + CR +
'<html style="height:100%; margin:auto; display:table">' + CR +
' <head>' + CR +
' <script type="text/javascript" src="https://www.google.com/jsapi"></script>' + CR +
' <script type="text/javascript">' + CR +
' google.load("visualization", "1.1", {packages:["sankey"]});' + CR +
' google.setOnLoadCallback(drawChart);' + CR +
' function drawChart() {' + CR +
' var data = new google.visualization.DataTable();' + CR +
' data.addColumn(\'string\', \'From\');' + CR +
' data.addColumn(\'string\', \'To\');' + CR +
' data.addColumn(\'number\', \'Weight\');' + CR;
for(var n = 0; n < values.length ; n++){
html +=
' data.addRows([' + CR +
' [ "'+ values[n][0] +'", "'+ values[n][1] +'", '+ values[n][2] +' ]' + CR +
' ]);' + CR;
}
html +=
' // Sets chart options.' + CR +
' var options = {' + CR +
' width: ' + w +',' + CR +
' height: ' + h + ',' + CR +
' };' + CR +
' // Instantiates and draws our chart, passing in some options.' + CR +
' var chart = new google.visualization.Sankey(document.getElementById(\'sankey_basic\'));' + CR +
' chart.draw(data, options);' + CR +
' }' + CR +
'</script>' + CR +
'</head>' + CR +
' <body style="border:0; margin:0; padding:0; height:100%; vertical-align:middle; display:table-cell">' + CR +
' <div style="border:0; margin:0; padding:0″ id="sankey_basic"></div>' + CR +
' </body>' + CR +
'</html>' + CR;
return html;
}

var factory = new VizFactory();
factory.visualizations.push(vizGauge);
factory.visualizations.push(vizPie);
factory.visualizations.push(vizSankey);

function getFeedings(req, id) {
for (var i = 0 ; i < req.body.feeding.length ; i++) {
if (req.body.feeding[i].id === id) {
return req.body.feeding[i].expressions;
}
}
};

function getData(req, id) {
for (var i = 0 ; i < req.body.data.length ; i++) {
if (req.body.data[i].id == id) {
return req.body.data[i];
}
}
};

function distinct(arr) {
var values = [];
for (var i = 0 ; i < arr.length ; i++) {
var value = arr[i];
if (values.indexOf(value) === -1) {
values.push(value);
}
}
return values;
};

function logInfo(info){
var currentdate = new Date();
console.log(currentdate.toLocaleString() + " => " + info);
};



module.exports = router;