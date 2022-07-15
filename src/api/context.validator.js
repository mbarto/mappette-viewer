"use strict";
export const Validator = validate10;
const schema11 = {"$id":"context","$schema":"http://json-schema.org/draft-07/schema#","properties":{"customVariablesEnabled":{"type":"boolean"},"mapConfig":{"properties":{"map":{"properties":{"center":{"properties":{"crs":{"type":"string"},"x":{"type":"number"},"y":{"type":"number"}},"type":"object"},"groups":{"items":{"properties":{"expanded":{"type":"boolean"},"id":{"type":"string"},"title":{"type":"string"}},"type":"object"},"type":"array"},"layers":{"items":{"properties":{"group":{"type":"string"},"id":{"type":"string"},"name":{"type":"string"},"opacity":{"type":"number"},"source":{"type":"string"},"title":{"anyOf":[{"additionalProperties":{"type":"string"},"type":"object"},{"type":"string"}]},"type":{"type":"string"},"visibility":{"type":"boolean"}},"type":"object"},"type":"array"},"mapOptions":{"additionalProperties":{"type":["string","number"]},"type":"object"},"maxExtent":{"items":[{"type":"number"},{"type":"number"},{"type":"number"},{"type":"number"}],"maxItems":4,"minItems":4,"type":"array"},"projection":{"type":"string"},"sources":{"additionalProperties":{},"type":"object"},"zoom":{"type":"number"}},"type":"object"},"version":{"type":"number"}},"type":"object"},"plugins":{"additionalProperties":{"items":{"anyOf":[{"properties":{"cfg":{},"name":{"type":"string"},"override":{}},"type":"object"},{"type":"string"}]},"type":"array"},"type":"object"},"userPlugins":{"items":{"anyOf":[{"properties":{"cfg":{},"name":{"type":"string"},"override":{}},"type":"object"},{"type":"string"}]},"type":"array"},"windowTitle":{"type":"string"}},"type":"object"};

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="context" */;
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.customVariablesEnabled !== undefined){
const _errs1 = errors;
if(typeof data.customVariablesEnabled !== "boolean"){
validate10.errors = [{instancePath:instancePath+"/customVariablesEnabled",schemaPath:"#/properties/customVariablesEnabled/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.mapConfig !== undefined){
let data1 = data.mapConfig;
const _errs3 = errors;
if(errors === _errs3){
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
if(data1.map !== undefined){
let data2 = data1.map;
const _errs5 = errors;
if(errors === _errs5){
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
if(data2.center !== undefined){
let data3 = data2.center;
const _errs7 = errors;
if(errors === _errs7){
if(data3 && typeof data3 == "object" && !Array.isArray(data3)){
if(data3.crs !== undefined){
const _errs9 = errors;
if(typeof data3.crs !== "string"){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/center/crs",schemaPath:"#/properties/mapConfig/properties/map/properties/center/properties/crs/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid3 = _errs9 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data3.x !== undefined){
let data5 = data3.x;
const _errs11 = errors;
if(!((typeof data5 == "number") && (isFinite(data5)))){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/center/x",schemaPath:"#/properties/mapConfig/properties/map/properties/center/properties/x/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid3 = _errs11 === errors;
}
else {
var valid3 = true;
}
if(valid3){
if(data3.y !== undefined){
let data6 = data3.y;
const _errs13 = errors;
if(!((typeof data6 == "number") && (isFinite(data6)))){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/center/y",schemaPath:"#/properties/mapConfig/properties/map/properties/center/properties/y/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid3 = _errs13 === errors;
}
else {
var valid3 = true;
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/center",schemaPath:"#/properties/mapConfig/properties/map/properties/center/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid2 = _errs7 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.groups !== undefined){
let data7 = data2.groups;
const _errs15 = errors;
if(errors === _errs15){
if(Array.isArray(data7)){
var valid4 = true;
const len0 = data7.length;
for(let i0=0; i0<len0; i0++){
let data8 = data7[i0];
const _errs17 = errors;
if(errors === _errs17){
if(data8 && typeof data8 == "object" && !Array.isArray(data8)){
if(data8.expanded !== undefined){
const _errs19 = errors;
if(typeof data8.expanded !== "boolean"){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/groups/" + i0+"/expanded",schemaPath:"#/properties/mapConfig/properties/map/properties/groups/items/properties/expanded/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid5 = _errs19 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data8.id !== undefined){
const _errs21 = errors;
if(typeof data8.id !== "string"){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/groups/" + i0+"/id",schemaPath:"#/properties/mapConfig/properties/map/properties/groups/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid5 = _errs21 === errors;
}
else {
var valid5 = true;
}
if(valid5){
if(data8.title !== undefined){
const _errs23 = errors;
if(typeof data8.title !== "string"){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/groups/" + i0+"/title",schemaPath:"#/properties/mapConfig/properties/map/properties/groups/items/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid5 = _errs23 === errors;
}
else {
var valid5 = true;
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/groups/" + i0,schemaPath:"#/properties/mapConfig/properties/map/properties/groups/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid4 = _errs17 === errors;
if(!valid4){
break;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/groups",schemaPath:"#/properties/mapConfig/properties/map/properties/groups/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid2 = _errs15 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.layers !== undefined){
let data12 = data2.layers;
const _errs25 = errors;
if(errors === _errs25){
if(Array.isArray(data12)){
var valid6 = true;
const len1 = data12.length;
for(let i1=0; i1<len1; i1++){
let data13 = data12[i1];
const _errs27 = errors;
if(errors === _errs27){
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
if(data13.group !== undefined){
const _errs29 = errors;
if(typeof data13.group !== "string"){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/layers/" + i1+"/group",schemaPath:"#/properties/mapConfig/properties/map/properties/layers/items/properties/group/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid7 = _errs29 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data13.id !== undefined){
const _errs31 = errors;
if(typeof data13.id !== "string"){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/layers/" + i1+"/id",schemaPath:"#/properties/mapConfig/properties/map/properties/layers/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid7 = _errs31 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data13.name !== undefined){
const _errs33 = errors;
if(typeof data13.name !== "string"){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/layers/" + i1+"/name",schemaPath:"#/properties/mapConfig/properties/map/properties/layers/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid7 = _errs33 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data13.opacity !== undefined){
let data17 = data13.opacity;
const _errs35 = errors;
if(!((typeof data17 == "number") && (isFinite(data17)))){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/layers/" + i1+"/opacity",schemaPath:"#/properties/mapConfig/properties/map/properties/layers/items/properties/opacity/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid7 = _errs35 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data13.source !== undefined){
const _errs37 = errors;
if(typeof data13.source !== "string"){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/layers/" + i1+"/source",schemaPath:"#/properties/mapConfig/properties/map/properties/layers/items/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid7 = _errs37 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data13.title !== undefined){
let data19 = data13.title;
const _errs39 = errors;
const _errs40 = errors;
let valid8 = false;
const _errs41 = errors;
if(errors === _errs41){
if(data19 && typeof data19 == "object" && !Array.isArray(data19)){
for(const key0 in data19){
const _errs44 = errors;
if(typeof data19[key0] !== "string"){
const err0 = {instancePath:instancePath+"/mapConfig/map/layers/" + i1+"/title/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/mapConfig/properties/map/properties/layers/items/properties/title/anyOf/0/additionalProperties/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
var valid9 = _errs44 === errors;
if(!valid9){
break;
}
}
}
else {
const err1 = {instancePath:instancePath+"/mapConfig/map/layers/" + i1+"/title",schemaPath:"#/properties/mapConfig/properties/map/properties/layers/items/properties/title/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs41 === errors;
valid8 = valid8 || _valid0;
if(!valid8){
const _errs46 = errors;
if(typeof data19 !== "string"){
const err2 = {instancePath:instancePath+"/mapConfig/map/layers/" + i1+"/title",schemaPath:"#/properties/mapConfig/properties/map/properties/layers/items/properties/title/anyOf/1/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs46 === errors;
valid8 = valid8 || _valid0;
}
if(!valid8){
const err3 = {instancePath:instancePath+"/mapConfig/map/layers/" + i1+"/title",schemaPath:"#/properties/mapConfig/properties/map/properties/layers/items/properties/title/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
validate10.errors = vErrors;
return false;
}
else {
errors = _errs40;
if(vErrors !== null){
if(_errs40){
vErrors.length = _errs40;
}
else {
vErrors = null;
}
}
}
var valid7 = _errs39 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data13.type !== undefined){
const _errs48 = errors;
if(typeof data13.type !== "string"){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/layers/" + i1+"/type",schemaPath:"#/properties/mapConfig/properties/map/properties/layers/items/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid7 = _errs48 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data13.visibility !== undefined){
const _errs50 = errors;
if(typeof data13.visibility !== "boolean"){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/layers/" + i1+"/visibility",schemaPath:"#/properties/mapConfig/properties/map/properties/layers/items/properties/visibility/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
var valid7 = _errs50 === errors;
}
else {
var valid7 = true;
}
}
}
}
}
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/layers/" + i1,schemaPath:"#/properties/mapConfig/properties/map/properties/layers/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid6 = _errs27 === errors;
if(!valid6){
break;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/layers",schemaPath:"#/properties/mapConfig/properties/map/properties/layers/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid2 = _errs25 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.mapOptions !== undefined){
let data23 = data2.mapOptions;
const _errs52 = errors;
if(errors === _errs52){
if(data23 && typeof data23 == "object" && !Array.isArray(data23)){
for(const key1 in data23){
let data24 = data23[key1];
const _errs55 = errors;
if((typeof data24 !== "string") && (!((typeof data24 == "number") && (isFinite(data24))))){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/mapOptions/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/mapConfig/properties/map/properties/mapOptions/additionalProperties/type",keyword:"type",params:{type: schema11.properties.mapConfig.properties.map.properties.mapOptions.additionalProperties.type},message:"must be string,number"}];
return false;
}
var valid10 = _errs55 === errors;
if(!valid10){
break;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/mapOptions",schemaPath:"#/properties/mapConfig/properties/map/properties/mapOptions/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid2 = _errs52 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.maxExtent !== undefined){
let data25 = data2.maxExtent;
const _errs57 = errors;
if(errors === _errs57){
if(Array.isArray(data25)){
if(data25.length > 4){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/maxExtent",schemaPath:"#/properties/mapConfig/properties/map/properties/maxExtent/maxItems",keyword:"maxItems",params:{limit: 4},message:"must NOT have more than 4 items"}];
return false;
}
else {
if(data25.length < 4){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/maxExtent",schemaPath:"#/properties/mapConfig/properties/map/properties/maxExtent/minItems",keyword:"minItems",params:{limit: 4},message:"must NOT have fewer than 4 items"}];
return false;
}
else {
const len2 = data25.length;
if(len2 > 0){
let data26 = data25[0];
const _errs59 = errors;
if(!((typeof data26 == "number") && (isFinite(data26)))){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/maxExtent/0",schemaPath:"#/properties/mapConfig/properties/map/properties/maxExtent/items/0/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid11 = _errs59 === errors;
}
if(valid11){
if(len2 > 1){
let data27 = data25[1];
const _errs61 = errors;
if(!((typeof data27 == "number") && (isFinite(data27)))){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/maxExtent/1",schemaPath:"#/properties/mapConfig/properties/map/properties/maxExtent/items/1/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid11 = _errs61 === errors;
}
if(valid11){
if(len2 > 2){
let data28 = data25[2];
const _errs63 = errors;
if(!((typeof data28 == "number") && (isFinite(data28)))){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/maxExtent/2",schemaPath:"#/properties/mapConfig/properties/map/properties/maxExtent/items/2/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid11 = _errs63 === errors;
}
if(valid11){
if(len2 > 3){
let data29 = data25[3];
const _errs65 = errors;
if(!((typeof data29 == "number") && (isFinite(data29)))){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/maxExtent/3",schemaPath:"#/properties/mapConfig/properties/map/properties/maxExtent/items/3/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid11 = _errs65 === errors;
}
}
}
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/maxExtent",schemaPath:"#/properties/mapConfig/properties/map/properties/maxExtent/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid2 = _errs57 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.projection !== undefined){
const _errs67 = errors;
if(typeof data2.projection !== "string"){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/projection",schemaPath:"#/properties/mapConfig/properties/map/properties/projection/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid2 = _errs67 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.sources !== undefined){
let data31 = data2.sources;
const _errs69 = errors;
if(errors === _errs69){
if(data31 && typeof data31 == "object" && !Array.isArray(data31)){
}
else {
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/sources",schemaPath:"#/properties/mapConfig/properties/map/properties/sources/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid2 = _errs69 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data2.zoom !== undefined){
let data32 = data2.zoom;
const _errs72 = errors;
if(!((typeof data32 == "number") && (isFinite(data32)))){
validate10.errors = [{instancePath:instancePath+"/mapConfig/map/zoom",schemaPath:"#/properties/mapConfig/properties/map/properties/zoom/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid2 = _errs72 === errors;
}
else {
var valid2 = true;
}
}
}
}
}
}
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/mapConfig/map",schemaPath:"#/properties/mapConfig/properties/map/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid1 = _errs5 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data1.version !== undefined){
let data33 = data1.version;
const _errs74 = errors;
if(!((typeof data33 == "number") && (isFinite(data33)))){
validate10.errors = [{instancePath:instancePath+"/mapConfig/version",schemaPath:"#/properties/mapConfig/properties/version/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid1 = _errs74 === errors;
}
else {
var valid1 = true;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/mapConfig",schemaPath:"#/properties/mapConfig/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.plugins !== undefined){
let data34 = data.plugins;
const _errs76 = errors;
if(errors === _errs76){
if(data34 && typeof data34 == "object" && !Array.isArray(data34)){
for(const key2 in data34){
let data35 = data34[key2];
const _errs79 = errors;
if(errors === _errs79){
if(Array.isArray(data35)){
var valid13 = true;
const len3 = data35.length;
for(let i2=0; i2<len3; i2++){
let data36 = data35[i2];
const _errs81 = errors;
const _errs82 = errors;
let valid14 = false;
const _errs83 = errors;
if(errors === _errs83){
if(data36 && typeof data36 == "object" && !Array.isArray(data36)){
if(data36.name !== undefined){
if(typeof data36.name !== "string"){
const err4 = {instancePath:instancePath+"/plugins/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i2+"/name",schemaPath:"#/properties/plugins/additionalProperties/items/anyOf/0/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
else {
const err5 = {instancePath:instancePath+"/plugins/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i2,schemaPath:"#/properties/plugins/additionalProperties/items/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
var _valid1 = _errs83 === errors;
valid14 = valid14 || _valid1;
if(!valid14){
const _errs87 = errors;
if(typeof data36 !== "string"){
const err6 = {instancePath:instancePath+"/plugins/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i2,schemaPath:"#/properties/plugins/additionalProperties/items/anyOf/1/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var _valid1 = _errs87 === errors;
valid14 = valid14 || _valid1;
}
if(!valid14){
const err7 = {instancePath:instancePath+"/plugins/" + key2.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i2,schemaPath:"#/properties/plugins/additionalProperties/items/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
validate10.errors = vErrors;
return false;
}
else {
errors = _errs82;
if(vErrors !== null){
if(_errs82){
vErrors.length = _errs82;
}
else {
vErrors = null;
}
}
}
var valid13 = _errs81 === errors;
if(!valid13){
break;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/plugins/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/plugins/additionalProperties/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid12 = _errs79 === errors;
if(!valid12){
break;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/plugins",schemaPath:"#/properties/plugins/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid0 = _errs76 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.userPlugins !== undefined){
let data38 = data.userPlugins;
const _errs89 = errors;
if(errors === _errs89){
if(Array.isArray(data38)){
var valid16 = true;
const len4 = data38.length;
for(let i3=0; i3<len4; i3++){
let data39 = data38[i3];
const _errs91 = errors;
const _errs92 = errors;
let valid17 = false;
const _errs93 = errors;
if(errors === _errs93){
if(data39 && typeof data39 == "object" && !Array.isArray(data39)){
if(data39.name !== undefined){
if(typeof data39.name !== "string"){
const err8 = {instancePath:instancePath+"/userPlugins/" + i3+"/name",schemaPath:"#/properties/userPlugins/items/anyOf/0/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
}
else {
const err9 = {instancePath:instancePath+"/userPlugins/" + i3,schemaPath:"#/properties/userPlugins/items/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
var _valid2 = _errs93 === errors;
valid17 = valid17 || _valid2;
if(!valid17){
const _errs97 = errors;
if(typeof data39 !== "string"){
const err10 = {instancePath:instancePath+"/userPlugins/" + i3,schemaPath:"#/properties/userPlugins/items/anyOf/1/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
var _valid2 = _errs97 === errors;
valid17 = valid17 || _valid2;
}
if(!valid17){
const err11 = {instancePath:instancePath+"/userPlugins/" + i3,schemaPath:"#/properties/userPlugins/items/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
validate10.errors = vErrors;
return false;
}
else {
errors = _errs92;
if(vErrors !== null){
if(_errs92){
vErrors.length = _errs92;
}
else {
vErrors = null;
}
}
}
var valid16 = _errs91 === errors;
if(!valid16){
break;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/userPlugins",schemaPath:"#/properties/userPlugins/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs89 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.windowTitle !== undefined){
const _errs99 = errors;
if(typeof data.windowTitle !== "string"){
validate10.errors = [{instancePath:instancePath+"/windowTitle",schemaPath:"#/properties/windowTitle/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs99 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate10.errors = vErrors;
return errors === 0;
}
