"use strict";

exports.__esModule = true;
exports.drawingMode = exports.defaultTriangleOptions = exports.defaultRectOptions = exports.defaultLineOptions = exports.defaultEllipseOptions = void 0;
var drawingMode = exports.drawingMode = {
  RECTANGLE: 'RECTANGLE',
  ELLIPSE: 'ELLIPSE',
  TRIANGLE: 'TRIANGLE',
  LINE: 'LINE',
  ERASER: 'ERASER'
};
var defaultRectOptions = exports.defaultRectOptions = {
  strokeWidth: 2,
  stroke: 'black',
  fill: 'transparent',
  strokeUniform: true,
  noScaleCache: false,
  objectCaching: false
};
var defaultEllipseOptions = exports.defaultEllipseOptions = {
  strokeWidth: 2,
  stroke: 'black',
  fill: 'black',
  strokeUniform: true,
  noScaleCache: false
};
var defaultTriangleOptions = exports.defaultTriangleOptions = {
  strokeWidth: 2,
  stroke: 'black',
  fill: 'black',
  strokeUniform: true,
  noScaleCache: false
};
var defaultLineOptions = exports.defaultLineOptions = {
  strokeWidth: 2,
  stroke: 'black',
  fill: 'black',
  strokeUniform: true,
  noScaleCache: false
};