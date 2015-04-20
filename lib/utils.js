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