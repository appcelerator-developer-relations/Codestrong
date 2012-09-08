exports.trim = function(e) {
    return String(e).replace(/^\s\s*/, "").replace(/\s\s*$/, "");
}, exports.trimZeros = function(e) {
    var t = new String(e || "0");
    return t.indexOf(".") == -1 ? t : t.replace(/\.?0*$/, "");
}, exports.ucfirst = function(e) {
    return e ? e[0].toUpperCase() + e.substr(1) : e;
}, exports.lcfirst = function(e) {
    return e ? e[0].toLowerCase() + e.substr(1) : e;
}, exports.formatCurrency = String.formatCurrency, exports.urlDecode = function(e) {
    return e ? e.replace(/%[a-fA-F0-9]{2}/ig, function(e) {
        return String.fromCharCode(parseInt(e.replace("%", ""), 16));
    }) : "";
}, exports.urlToJson = function(e) {
    var t = {}, n = e.split("?"), r = {}, i = n[1].split("&");
    for (var s = 0; s < i.length; ++s) {
        var o = i[s];
        if (o == "") continue;
        var u = o.indexOf("="), a, f;
        u < 0 ? (a = o, f = null) : (a = o.substring(0, u), f = o.substring(u + 1)), r[a] = f;
    }
    return t.url = n[0], t.query = r, t;
};