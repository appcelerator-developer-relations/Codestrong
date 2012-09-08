function getUniqueId(id) {
    if (!id || _.contains(idList, id)) id = getUniqueId(uniqueIdCounter++);
    return idList.push(id), id;
}

function Sync(model, method, opts) {
    var prefix = model.config.adapter.prefix ? model.config.adapter.prefix : "default", regex = new RegExp("^(" + prefix + ")\\-(\\d+)$");
    if (method === "read") if (opts.parse) {
        var list = [];
        _.each(TAP.listProperties(), function(prop) {
            var match = prop.match(regex);
            match !== null && list.push(TAP.getObject(prop));
        }), model.reset(list);
        var maxId = _.max(_.pluck(list, "id"));
        model.maxId = (_.isFinite(maxId) ? maxId : 0) + 1;
    } else {
        var obj = TAP.getObject(prefix + "-" + model.get("id"));
        model.set(obj);
    } else method === "create" || method === "update" ? TAP.setObject(prefix + "-" + model.get("id"), model.toJSON() || {}) : method === "delete" && (TAP.removeProperty(prefix + "-" + model.get("id")), model.clear());
}

var Alloy = require("alloy"), _ = require("alloy/underscore")._, TAP = Ti.App.Properties, idList = [], uniqueIdCounter = 1;

module.exports.sync = Sync, module.exports.beforeModelCreate = function(config) {
    return config = config || {}, config.columns = config.columns || {}, config.defaults = config.defaults || {}, config.columns.id = "Int", config.defaults.id = getUniqueId(), config;
};