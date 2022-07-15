"use strict";
export const Validator = validate10;
const schema11 = {"$id":"resource","$schema":"http://json-schema.org/draft-07/schema#","properties":{"Resource":{"properties":{"Attributes":{"anyOf":[{"properties":{"attribute":{"properties":{"@type":{"type":"string"},"name":{"type":"string"},"value":{"type":["string","number"]}},"type":"object"}},"type":"object"},{"items":{"properties":{"attribute":{"properties":{"@type":{"type":"string"},"name":{"type":"string"},"value":{"type":["string","number"]}},"type":"object"}},"type":"object"},"type":"array"},{"enum":[""],"type":"string"}]},"category":{"properties":{"id":{"type":"number"},"name":{"type":"string"}},"type":"object"},"creation":{"type":"string"},"data":{"properties":{"data":{"type":"string"}},"type":"object"},"description":{"type":"string"},"id":{"type":"number"},"lastUpdate":{"type":"string"},"metadata":{"type":"string"},"name":{"type":["string","number"]}},"type":"object"}},"type":"object"};

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="resource" */;
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.Resource !== undefined){
let data0 = data.Resource;
const _errs1 = errors;
if(errors === _errs1){
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.Attributes !== undefined){
let data1 = data0.Attributes;
const _errs3 = errors;
const _errs4 = errors;
let valid2 = false;
const _errs5 = errors;
if(errors === _errs5){
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
if(data1.attribute !== undefined){
let data2 = data1.attribute;
const _errs7 = errors;
if(errors === _errs7){
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
if(data2["@type"] !== undefined){
const _errs9 = errors;
if(typeof data2["@type"] !== "string"){
const err0 = {instancePath:instancePath+"/Resource/Attributes/attribute/@type",schemaPath:"#/properties/Resource/properties/Attributes/anyOf/0/properties/attribute/properties/%40type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
var valid4 = _errs9 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data2.name !== undefined){
const _errs11 = errors;
if(typeof data2.name !== "string"){
const err1 = {instancePath:instancePath+"/Resource/Attributes/attribute/name",schemaPath:"#/properties/Resource/properties/Attributes/anyOf/0/properties/attribute/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
var valid4 = _errs11 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data2.value !== undefined){
let data5 = data2.value;
const _errs13 = errors;
if((typeof data5 !== "string") && (!((typeof data5 == "number") && (isFinite(data5))))){
const err2 = {instancePath:instancePath+"/Resource/Attributes/attribute/value",schemaPath:"#/properties/Resource/properties/Attributes/anyOf/0/properties/attribute/properties/value/type",keyword:"type",params:{type: schema11.properties.Resource.properties.Attributes.anyOf[0].properties.attribute.properties.value.type},message:"must be string,number"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var valid4 = _errs13 === errors;
}
else {
var valid4 = true;
}
}
}
}
else {
const err3 = {instancePath:instancePath+"/Resource/Attributes/attribute",schemaPath:"#/properties/Resource/properties/Attributes/anyOf/0/properties/attribute/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
}
else {
const err4 = {instancePath:instancePath+"/Resource/Attributes",schemaPath:"#/properties/Resource/properties/Attributes/anyOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
var _valid0 = _errs5 === errors;
valid2 = valid2 || _valid0;
if(!valid2){
const _errs15 = errors;
if(errors === _errs15){
if(Array.isArray(data1)){
var valid5 = true;
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
let data6 = data1[i0];
const _errs17 = errors;
if(errors === _errs17){
if(data6 && typeof data6 == "object" && !Array.isArray(data6)){
if(data6.attribute !== undefined){
let data7 = data6.attribute;
const _errs19 = errors;
if(errors === _errs19){
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
if(data7["@type"] !== undefined){
const _errs21 = errors;
if(typeof data7["@type"] !== "string"){
const err5 = {instancePath:instancePath+"/Resource/Attributes/" + i0+"/attribute/@type",schemaPath:"#/properties/Resource/properties/Attributes/anyOf/1/items/properties/attribute/properties/%40type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
var valid7 = _errs21 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data7.name !== undefined){
const _errs23 = errors;
if(typeof data7.name !== "string"){
const err6 = {instancePath:instancePath+"/Resource/Attributes/" + i0+"/attribute/name",schemaPath:"#/properties/Resource/properties/Attributes/anyOf/1/items/properties/attribute/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var valid7 = _errs23 === errors;
}
else {
var valid7 = true;
}
if(valid7){
if(data7.value !== undefined){
let data10 = data7.value;
const _errs25 = errors;
if((typeof data10 !== "string") && (!((typeof data10 == "number") && (isFinite(data10))))){
const err7 = {instancePath:instancePath+"/Resource/Attributes/" + i0+"/attribute/value",schemaPath:"#/properties/Resource/properties/Attributes/anyOf/1/items/properties/attribute/properties/value/type",keyword:"type",params:{type: schema11.properties.Resource.properties.Attributes.anyOf[1].items.properties.attribute.properties.value.type},message:"must be string,number"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
var valid7 = _errs25 === errors;
}
else {
var valid7 = true;
}
}
}
}
else {
const err8 = {instancePath:instancePath+"/Resource/Attributes/" + i0+"/attribute",schemaPath:"#/properties/Resource/properties/Attributes/anyOf/1/items/properties/attribute/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
}
else {
const err9 = {instancePath:instancePath+"/Resource/Attributes/" + i0,schemaPath:"#/properties/Resource/properties/Attributes/anyOf/1/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
var valid5 = _errs17 === errors;
if(!valid5){
break;
}
}
}
else {
const err10 = {instancePath:instancePath+"/Resource/Attributes",schemaPath:"#/properties/Resource/properties/Attributes/anyOf/1/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
var _valid0 = _errs15 === errors;
valid2 = valid2 || _valid0;
if(!valid2){
const _errs27 = errors;
if(typeof data1 !== "string"){
const err11 = {instancePath:instancePath+"/Resource/Attributes",schemaPath:"#/properties/Resource/properties/Attributes/anyOf/2/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(!(data1 === "")){
const err12 = {instancePath:instancePath+"/Resource/Attributes",schemaPath:"#/properties/Resource/properties/Attributes/anyOf/2/enum",keyword:"enum",params:{allowedValues: schema11.properties.Resource.properties.Attributes.anyOf[2].enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
var _valid0 = _errs27 === errors;
valid2 = valid2 || _valid0;
}
}
if(!valid2){
const err13 = {instancePath:instancePath+"/Resource/Attributes",schemaPath:"#/properties/Resource/properties/Attributes/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
validate10.errors = vErrors;
return false;
}
else {
errors = _errs4;
if(vErrors !== null){
if(_errs4){
vErrors.length = _errs4;
}
else {
vErrors = null;
}
}
}
var valid1 = _errs3 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.category !== undefined){
let data11 = data0.category;
const _errs29 = errors;
if(errors === _errs29){
if(data11 && typeof data11 == "object" && !Array.isArray(data11)){
if(data11.id !== undefined){
let data12 = data11.id;
const _errs31 = errors;
if(!((typeof data12 == "number") && (isFinite(data12)))){
validate10.errors = [{instancePath:instancePath+"/Resource/category/id",schemaPath:"#/properties/Resource/properties/category/properties/id/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid8 = _errs31 === errors;
}
else {
var valid8 = true;
}
if(valid8){
if(data11.name !== undefined){
const _errs33 = errors;
if(typeof data11.name !== "string"){
validate10.errors = [{instancePath:instancePath+"/Resource/category/name",schemaPath:"#/properties/Resource/properties/category/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid8 = _errs33 === errors;
}
else {
var valid8 = true;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/Resource/category",schemaPath:"#/properties/Resource/properties/category/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid1 = _errs29 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.creation !== undefined){
const _errs35 = errors;
if(typeof data0.creation !== "string"){
validate10.errors = [{instancePath:instancePath+"/Resource/creation",schemaPath:"#/properties/Resource/properties/creation/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid1 = _errs35 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.data !== undefined){
let data15 = data0.data;
const _errs37 = errors;
if(errors === _errs37){
if(data15 && typeof data15 == "object" && !Array.isArray(data15)){
if(data15.data !== undefined){
if(typeof data15.data !== "string"){
validate10.errors = [{instancePath:instancePath+"/Resource/data/data",schemaPath:"#/properties/Resource/properties/data/properties/data/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
else {
validate10.errors = [{instancePath:instancePath+"/Resource/data",schemaPath:"#/properties/Resource/properties/data/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
var valid1 = _errs37 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.description !== undefined){
const _errs41 = errors;
if(typeof data0.description !== "string"){
validate10.errors = [{instancePath:instancePath+"/Resource/description",schemaPath:"#/properties/Resource/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid1 = _errs41 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.id !== undefined){
let data18 = data0.id;
const _errs43 = errors;
if(!((typeof data18 == "number") && (isFinite(data18)))){
validate10.errors = [{instancePath:instancePath+"/Resource/id",schemaPath:"#/properties/Resource/properties/id/type",keyword:"type",params:{type: "number"},message:"must be number"}];
return false;
}
var valid1 = _errs43 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.lastUpdate !== undefined){
const _errs45 = errors;
if(typeof data0.lastUpdate !== "string"){
validate10.errors = [{instancePath:instancePath+"/Resource/lastUpdate",schemaPath:"#/properties/Resource/properties/lastUpdate/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid1 = _errs45 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.metadata !== undefined){
const _errs47 = errors;
if(typeof data0.metadata !== "string"){
validate10.errors = [{instancePath:instancePath+"/Resource/metadata",schemaPath:"#/properties/Resource/properties/metadata/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid1 = _errs47 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data0.name !== undefined){
let data21 = data0.name;
const _errs49 = errors;
if((typeof data21 !== "string") && (!((typeof data21 == "number") && (isFinite(data21))))){
validate10.errors = [{instancePath:instancePath+"/Resource/name",schemaPath:"#/properties/Resource/properties/name/type",keyword:"type",params:{type: schema11.properties.Resource.properties.name.type},message:"must be string,number"}];
return false;
}
var valid1 = _errs49 === errors;
}
else {
var valid1 = true;
}
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
validate10.errors = [{instancePath:instancePath+"/Resource",schemaPath:"#/properties/Resource/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
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
