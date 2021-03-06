(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tye = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var matches = require('./utils').matches;
var partial = require('./utils').partial;
var partialR = require('./utils').partialR;
var internals = {};

internals.refs = {};
internals.updateRefs = function updateRefs(delegator, type, fn, selector) {
    internals.refs[delegator] = internals.refs[delegator] || {};
    internals.refs[delegator][type] = internals.refs[delegator][type] || {};
    internals.refs[delegator][type][selector] = internals.refs[delegator][type][selector] || [];
    return internals.refs[delegator][type][selector].push(fn);
};
internals.classFn = function classFn(e, selector, fn) {
    if (!matches(e.target, selector)) {
        return undefined;
    }
    return fn && fn.call(fn, e);
};
internals.addListener = function addListener(delegator, type, fn, selector) {
    internals.updateRefs(delegator, type, fn, selector);
    delegator.addEventListener(type, fn);
};
internals.removeListener = function removeListener(type, delegator, fn) {
    delegator.removeEventListener(type, fn);
};
internals.turnOn = function turnOn(delegator, type, selector, fn) {
    if (typeof selector === 'function') {
        return internals.addListener(delegator, type, selector);
    }
    return internals.addListener(delegator, type, partialR(internals.classFn, selector, fn), selector);
};
internals.turnOff = function turnOff(delegator, type, selector) {
    if (selector && selector in internals.refs[delegator][type]) {
        return internals.refs[delegator][type][selector].forEach(partial(internals.removeListener, type, delegator));
    }
    Object.keys(internals.refs[delegator][type]).forEach(function(key) {
        internals.refs[delegator][type][key].forEach(partial(internals.removeListener, type, delegator));
    });
};
module.exports = function tye(delegator) {
    return {
        on: function on(type, selector, fn) {
            return internals.turnOn(delegator, type, selector, fn);
        },
        off: function(type, selector) {
            return internals.turnOff(delegator, type, selector);
        }
    };
};
},{"./utils":2}],2:[function(require,module,exports){
'use strict';
exports.partial = function partial(fn) {
    var args = Array.apply(null, arguments).slice(1);
    return function() {
        var lastArgs = Array.apply(null, arguments);
        return fn.apply(this, args.concat(lastArgs));
    };
};

exports.partialR = function partialR(fn) {
    var args = Array.apply(null, arguments).slice(1);
    return function() {
        var firstArgs = Array.apply(null, arguments);
        return fn.apply(this, firstArgs.concat(args));
    };
};

exports.matches = function elementMatches(element, selector) {
    var ElementProto = Element.prototype;
    var func = ElementProto.matches ||
        ElementProto.webkitMatchesSelector ||
        ElementProto.mozMatchesSelector ||
        ElementProto.msMatchesSelector ||
        function fallbackElementMatches(selektor) {
            return Array.apply(null, document.querySelectorAll(selektor)).indexOf(this) !== -1;
        };
    return func.call(element, selector);
};
},{}]},{},[1])(1)
});