function isTabletFallback() {
    return !(Math.min(Ti.Platform.displayCaps.platformHeight, Ti.Platform.displayCaps.platformWidth) < 700);
}

var _ = require("alloy/underscore")._, Backbone = require("alloy/backbone"), STR = require("alloy/string");

exports._ = _, exports.Backbone = Backbone, Backbone.sync = function(method, model, opts) {
    var m = model.config || {}, type = (m.adapter ? m.adapter.type : null) || "sql";
    require("alloy/sync/" + type).sync(model, method, opts);
}, exports.M = function(name, config, modelFn, migrations) {
    var type = (config.adapter ? config.adapter.type : null) || "sql", adapter = require("alloy/sync/" + type), extendObj = {
        defaults: config.defaults,
        validate: function(attrs) {
            if (typeof __validate != "undefined" && _.isFunction(__validate)) for (var k in attrs) {
                var t = __validate(k, attrs[k]);
                if (!t) return "validation failed for: " + k;
            }
        }
    }, extendClass = {};
    migrations && (extendClass.migrations = migrations), _.isFunction(adapter.beforeModelCreate) && (config = adapter.beforeModelCreate(config) || config);
    var Model = Backbone.Model.extend(extendObj, extendClass);
    return Model.prototype.config = config, _.isFunction(adapter.afterModelCreate) && adapter.afterModelCreate(Model), Model = modelFn(Model) || Model, Model;
}, exports.A = function(t, type, parent) {
    return _.extend(t, Backbone.Events), function() {
        var al = t.addEventListener, rl = t.removeEventListener, oo = t.on, of = t.off, tg = t.trigger, cbs = [], ctx = {};
        t.on = function(e, cb, context) {
            var wcb = function(evt) {
                try {
                    _.bind(tg, ctx, e, evt)();
                } catch (E) {
                    Ti.API.error("Error triggering '" + e + "' event: " + E);
                }
            };
            cbs[cb] = wcb, al(e, wcb), _.bind(oo, ctx, e, cb, context)();
        }, t.off = function(e, cb, context) {
            var f = cbs[cb];
            f && (_.bind(of, ctx, e, cb, context)(), rl(e, f), delete cbs[cb], f = null);
        };
    }(), t;
}, exports.getWidget = function(id, name, args) {
    return new (require("alloy/widgets/" + id + "/controllers/" + (name || "widget")))(args);
}, exports.createWidget = function(id, name, args) {
    return new (require("alloy/widgets/" + id + "/controllers/" + (name || "widget")))(args);
}, exports.getController = function(name, args) {
    return new (require("alloy/controllers/" + name))(args);
}, exports.createController = function(name, args) {
    return new (require("alloy/controllers/" + name))(args);
}, exports.getModel = function(name, args) {
    return new (require("alloy/models/" + STR.ucfirst(name)).Model)(args);
}, exports.createModel = function(name, args) {
    return new (require("alloy/models/" + STR.ucfirst(name)).Model)(args);
}, exports.getCollection = function(name, args) {
    return new (require("alloy/models/" + STR.ucfirst(name)).Collection)(args);
}, exports.createCollection = function(name, args) {
    return new (require("alloy/models/" + STR.ucfirst(name)).Collection)(args);
}, exports.isTablet = function() {
    return Ti.Platform.osname === "ipad";
}(), exports.isHandheld = !exports.isTablet;