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