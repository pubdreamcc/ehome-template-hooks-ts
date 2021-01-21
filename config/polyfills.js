/* eslint-disable */


require('es6-set');
Object.assign = require('object-assign');
window.FastClick.prototype.focus = function (targetElement) {
	/**
   * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
   *
   * @type boolean
   */
	var deviceIsWindowsPhone = navigator.userAgent.indexOf('Windows Phone') >= 0;
	/**
   * iOS requires exceptions.
   *
   * @type boolean
   */
	var deviceIsIOS =
    /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;

	var length;

	/**
   * Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange.
   * These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError.
   * Just check the type instead. Filed as Apple bug #15122724.
   */
	if (
		deviceIsIOS &&
    targetElement.setSelectionRange &&
    targetElement.type.indexOf('date') !== 0 &&
    targetElement.type !== 'time' &&
    targetElement.type !== 'month' &&
    targetElement.type !== 'number'
	) {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
	} else {
		targetElement.focus();
	}
};

if (!Array.prototype.find) {
	Object.defineProperty(Array.prototype, 'find', {
		value: function (predicate) {
			// 1. Let O be ? ToObject(this value).
			if (this == null) {
				throw new TypeError('"this" is null or not defined');
			}

			var o = Object(this);

			// 2. Let len be ? ToLength(? Get(O, "length")).
			var len = o.length >>> 0;

			// 3. If IsCallable(predicate) is false, throw a TypeError exception.
			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}

			// 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
			var thisArg = arguments[1];

			// 5. Let k be 0.
			var k = 0;

			// 6. Repeat, while k < len
			while (k < len) {
				// a. Let Pk be ! ToString(k).
				// b. Let kValue be ? Get(O, Pk).
				// c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
				// d. If testResult is true, return kValue.
				var kValue = o[k];
				if (predicate.call(thisArg, kValue, k, o)) {
					return kValue;
				}
				// e. Increase k by 1.
				k++;
			}

			// 7. Return undefined.
			return undefined;
		},
	});
}

if (!String.prototype.includes) {
	String.prototype.includes = function (search, start) {
		if (typeof start !== 'number') {
			start = 0;
		}

		if (start + search.length > this.length) {
			return false;
		}
		return this.indexOf(search, start) !== -1;
	};
}
if (!String.prototype.startsWith) {
	String.prototype.startsWith = function (searchString, position) {
		return this.substr(position || 0, searchString.length) === searchString;
	};
}

if (!Promise.prototype.finally) {
	Promise.prototype.finally = function (callback) {
		var P = this.constructor;
		return this.then(
			function (value) {
				return P.resolve(callback()).then(function () {
					return value;
				});
			},
			function (reason) {
				return P.resolve(callback()).then(function () {
					throw reason;
				});
			}
		);
	};
}
