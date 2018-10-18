;(function (name, context, factory) {
    // Supports UMD. AMD, CommonJS/Node.js and browser context
    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        context[name] = factory();
    }
})('HashMap', DT = {}, function () {
    'use strict';

    var hashMap = function () {
        this.size = 0;
        this.array = [];
        this.entry = {};
        this.type = 'HashMap';
    };

    hashMap.prototype = {
        put: function (key, value) {
            if (!this.containsKey(key)) {
                this.size++;
            }
            this.entry[key] = value;
        },
        add: function (value) {
            this.array.push(value);
        },
        get: function (key) {
            return this.containsKey(key) ? this.entry[key] : null;
        },
        remove: function (key) {
            if (this.containsKey(key) && (delete this.entry[key])) {
                this.size--;
            }
        },
        containsKey: function (key) {
            return (key in this.entry);
        },
        containsValue: function (value) {
            for (var prop in this.entry) {
                if (this.entry[prop] == value) {
                    return true;
                }
            }
            return false;
        },
        update:function(key,overlay){
            this.entry[key] = overlay;
        },
        getSize: function () {
            return this.size;
        },
        clear: function () {
            this.size = 0;
            this.entry = {};
        },
        keys: function () {
            var keys = [];
            for (var prop in this.entry) {
                keys.push(prop);
            }
            return keys;
        },
        values: function () {
            var values = [];
            for (var prop in this.entry) {
                values.push(this.entry[prop]);
            }
            return values;
        },
        getArray: function () {
            return this.array;
        },
        clearArray: function () {
            this.array = [];
        }
    };
    return hashMap;
});
