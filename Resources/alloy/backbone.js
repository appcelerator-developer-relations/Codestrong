(function() {
    var root = this, previousBackbone = root.Backbone, slice = Array.prototype.slice, splice = Array.prototype.splice, Backbone;
    typeof exports != "undefined" ? Backbone = exports : Backbone = root.Backbone = {}, Backbone.VERSION = "0.9.2";
    var _ = root._;
    !_ && typeof require != "undefined" && (_ = require("alloy/underscore"));
    var $ = root.jQuery || root.Zepto || root.ender;
    Backbone.setDomLibrary = function(lib) {
        $ = lib;
    }, Backbone.noConflict = function() {
        return root.Backbone = previousBackbone, this;
    }, Backbone.emulateHTTP = !1, Backbone.emulateJSON = !1;
    var eventSplitter = /\s+/, Events = Backbone.Events = {
        on: function(events, callback, context) {
            var calls, event, node, tail, list;
            if (!callback) return this;
            events = events.split(eventSplitter), calls = this._callbacks || (this._callbacks = {});
            while (event = events.shift()) list = calls[event], node = list ? list.tail : {}, node.next = tail = {}, node.context = context, node.callback = callback, calls[event] = {
                tail: tail,
                next: list ? list.next : node
            };
            return this;
        },
        off: function(events, callback, context) {
            var event, calls, node, tail, cb, ctx;
            if (!(calls = this._callbacks)) return;
            if (!(events || callback || context)) return delete this._callbacks, this;
            events = events ? events.split(eventSplitter) : _.keys(calls);
            while (event = events.shift()) {
                node = calls[event], delete calls[event];
                if (!node || !callback && !context) continue;
                tail = node.tail;
                while ((node = node.next) !== tail) cb = node.callback, ctx = node.context, (callback && cb !== callback || context && ctx !== context) && this.on(event, cb, ctx);
            }
            return this;
        },
        trigger: function(events) {
            var event, node, calls, tail, args, all, rest;
            if (!(calls = this._callbacks)) return this;
            all = calls.all, events = events.split(eventSplitter), rest = slice.call(arguments, 1);
            while (event = events.shift()) {
                if (node = calls[event]) {
                    tail = node.tail;
                    while ((node = node.next) !== tail) node.callback.apply(node.context || this, rest);
                }
                if (node = all) {
                    tail = node.tail, args = [ event ].concat(rest);
                    while ((node = node.next) !== tail) node.callback.apply(node.context || this, args);
                }
            }
            return this;
        }
    };
    Events.bind = Events.on, Events.unbind = Events.off;
    var Model = Backbone.Model = function(attributes, options) {
        var defaults;
        attributes || (attributes = {}), options && options.parse && (attributes = this.parse(attributes));
        if (defaults = getValue(this, "defaults")) attributes = _.extend({}, defaults, attributes);
        options && options.collection && (this.collection = options.collection), this.attributes = {}, this._escapedAttributes = {}, this.cid = _.uniqueId("c"), this.changed = {}, this._silent = {}, this._pending = {}, this.set(attributes, {
            silent: !0
        }), this.changed = {}, this._silent = {}, this._pending = {}, this._previousAttributes = _.clone(this.attributes), this.initialize.apply(this, arguments);
    };
    _.extend(Model.prototype, Events, {
        changed: null,
        _silent: null,
        _pending: null,
        idAttribute: "id",
        initialize: function() {},
        toJSON: function(options) {
            return _.clone(this.attributes);
        },
        get: function(attr) {
            return this.attributes[attr];
        },
        escape: function(attr) {
            var html;
            if (html = this._escapedAttributes[attr]) return html;
            var val = this.get(attr);
            return this._escapedAttributes[attr] = _.escape(val == null ? "" : "" + val);
        },
        has: function(attr) {
            return this.get(attr) != null;
        },
        set: function(key, value, options) {
            var attrs, attr, val;
            _.isObject(key) || key == null ? (attrs = key, options = value) : (attrs = {}, attrs[key] = value), options || (options = {});
            if (!attrs) return this;
            attrs instanceof Model && (attrs = attrs.attributes);
            if (options.unset) for (attr in attrs) attrs[attr] = void 0;
            if (!this._validate(attrs, options)) return !1;
            this.idAttribute in attrs && (this.id = attrs[this.idAttribute]);
            var changes = options.changes = {}, now = this.attributes, escaped = this._escapedAttributes, prev = this._previousAttributes || {};
            for (attr in attrs) {
                val = attrs[attr];
                if (!_.isEqual(now[attr], val) || options.unset && _.has(now, attr)) delete escaped[attr], (options.silent ? this._silent : changes)[attr] = !0;
                options.unset ? delete now[attr] : now[attr] = val, !_.isEqual(prev[attr], val) || _.has(now, attr) != _.has(prev, attr) ? (this.changed[attr] = val, options.silent || (this._pending[attr] = !0)) : (delete this.changed[attr], delete this._pending[attr]);
            }
            return options.silent || this.change(options), this;
        },
        unset: function(attr, options) {
            return (options || (options = {})).unset = !0, this.set(attr, null, options);
        },
        clear: function(options) {
            return (options || (options = {})).unset = !0, this.set(_.clone(this.attributes), options);
        },
        fetch: function(options) {
            options = options ? _.clone(options) : {};
            var model = this, success = options.success;
            return options.success = function(resp, status, xhr) {
                if (!model.set(model.parse(resp, xhr), options)) return !1;
                success && success(model, resp);
            }, options.error = Backbone.wrapError(options.error, model, options), (this.sync || Backbone.sync).call(this, "read", this, options);
        },
        save: function(key, value, options) {
            var attrs, current;
            _.isObject(key) || key == null ? (attrs = key, options = value) : (attrs = {}, attrs[key] = value), options = options ? _.clone(options) : {};
            if (options.wait) {
                if (!this._validate(attrs, options)) return !1;
                current = _.clone(this.attributes);
            }
            var silentOptions = _.extend({}, options, {
                silent: !0
            });
            if (attrs && !this.set(attrs, options.wait ? silentOptions : options)) return !1;
            var model = this, success = options.success;
            options.success = function(resp, status, xhr) {
                var serverAttrs = model.parse(resp, xhr);
                options.wait && (delete options.wait, serverAttrs = _.extend(attrs || {}, serverAttrs));
                if (!model.set(serverAttrs, options)) return !1;
                success ? success(model, resp) : model.trigger("sync", model, resp, options);
            }, options.error = Backbone.wrapError(options.error, model, options);
            var method = this.isNew() ? "create" : "update", xhr = (this.sync || Backbone.sync).call(this, method, this, options);
            return options.wait && this.set(current, silentOptions), xhr;
        },
        destroy: function(options) {
            options = options ? _.clone(options) : {};
            var model = this, success = options.success, triggerDestroy = function() {
                model.trigger("destroy", model, model.collection, options);
            };
            if (this.isNew()) return triggerDestroy(), !1;
            options.success = function(resp) {
                options.wait && triggerDestroy(), success ? success(model, resp) : model.trigger("sync", model, resp, options);
            }, options.error = Backbone.wrapError(options.error, model, options);
            var xhr = (this.sync || Backbone.sync).call(this, "delete", this, options);
            return options.wait || triggerDestroy(), xhr;
        },
        url: function() {
            var base = getValue(this, "urlRoot") || getValue(this.collection, "url") || urlError();
            return this.isNew() ? base : base + (base.charAt(base.length - 1) == "/" ? "" : "/") + encodeURIComponent(this.id);
        },
        parse: function(resp, xhr) {
            return resp;
        },
        clone: function() {
            return new this.constructor(this.attributes);
        },
        isNew: function() {
            return this.id == null;
        },
        change: function(options) {
            options || (options = {});
            var changing = this._changing;
            this._changing = !0;
            for (var attr in this._silent) this._pending[attr] = !0;
            var changes = _.extend({}, options.changes, this._silent);
            this._silent = {};
            for (var attr in changes) this.trigger("change:" + attr, this, this.get(attr), options);
            if (changing) return this;
            while (!_.isEmpty(this._pending)) {
                this._pending = {}, this.trigger("change", this, options);
                for (var attr in this.changed) {
                    if (this._pending[attr] || this._silent[attr]) continue;
                    delete this.changed[attr];
                }
                this._previousAttributes = _.clone(this.attributes);
            }
            return this._changing = !1, this;
        },
        hasChanged: function(attr) {
            return arguments.length ? _.has(this.changed, attr) : !_.isEmpty(this.changed);
        },
        changedAttributes: function(diff) {
            if (!diff) return this.hasChanged() ? _.clone(this.changed) : !1;
            var val, changed = !1, old = this._previousAttributes;
            for (var attr in diff) {
                if (_.isEqual(old[attr], val = diff[attr])) continue;
                (changed || (changed = {}))[attr] = val;
            }
            return changed;
        },
        previous: function(attr) {
            return !arguments.length || !this._previousAttributes ? null : this._previousAttributes[attr];
        },
        previousAttributes: function() {
            return _.clone(this._previousAttributes);
        },
        isValid: function() {
            return !this.validate(this.attributes);
        },
        _validate: function(attrs, options) {
            if (options.silent || !this.validate) return !0;
            attrs = _.extend({}, this.attributes, attrs);
            var error = this.validate(attrs, options);
            return error ? (options && options.error ? options.error(this, error, options) : this.trigger("error", this, error, options), !1) : !0;
        }
    });
    var Collection = Backbone.Collection = function(models, options) {
        options || (options = {}), options.model && (this.model = options.model), options.comparator && (this.comparator = options.comparator), this._reset(), this.initialize.apply(this, arguments), models && this.reset(models, {
            silent: !0,
            parse: options.parse
        });
    };
    _.extend(Collection.prototype, Events, {
        model: Model,
        initialize: function() {},
        toJSON: function(options) {
            return this.map(function(model) {
                return model.toJSON(options);
            });
        },
        add: function(models, options) {
            var i, index, length, model, cid, id, cids = {}, ids = {}, dups = [];
            options || (options = {}), models = _.isArray(models) ? models.slice() : [ models ];
            for (i = 0, length = models.length; i < length; i++) {
                if (!(model = models[i] = this._prepareModel(models[i], options))) throw new Error("Can't add an invalid model to a collection");
                cid = model.cid, id = model.id;
                if (cids[cid] || this._byCid[cid] || id != null && (ids[id] || this._byId[id])) {
                    dups.push(i);
                    continue;
                }
                cids[cid] = ids[id] = model;
            }
            i = dups.length;
            while (i--) models.splice(dups[i], 1);
            for (i = 0, length = models.length; i < length; i++) (model = models[i]).on("all", this._onModelEvent, this), this._byCid[model.cid] = model, model.id != null && (this._byId[model.id] = model);
            this.length += length, index = options.at != null ? options.at : this.models.length, splice.apply(this.models, [ index, 0 ].concat(models)), this.comparator && this.sort({
                silent: !0
            });
            if (options.silent) return this;
            for (i = 0, length = this.models.length; i < length; i++) {
                if (!cids[(model = this.models[i]).cid]) continue;
                options.index = i, model.trigger("add", model, this, options);
            }
            return this;
        },
        remove: function(models, options) {
            var i, l, index, model;
            options || (options = {}), models = _.isArray(models) ? models.slice() : [ models ];
            for (i = 0, l = models.length; i < l; i++) {
                model = this.getByCid(models[i]) || this.get(models[i]);
                if (!model) continue;
                delete this._byId[model.id], delete this._byCid[model.cid], index = this.indexOf(model), this.models.splice(index, 1), this.length--, options.silent || (options.index = index, model.trigger("remove", model, this, options)), this._removeReference(model);
            }
            return this;
        },
        push: function(model, options) {
            return model = this._prepareModel(model, options), this.add(model, options), model;
        },
        pop: function(options) {
            var model = this.at(this.length - 1);
            return this.remove(model, options), model;
        },
        unshift: function(model, options) {
            return model = this._prepareModel(model, options), this.add(model, _.extend({
                at: 0
            }, options)), model;
        },
        shift: function(options) {
            var model = this.at(0);
            return this.remove(model, options), model;
        },
        get: function(id) {
            return id == null ? void 0 : this._byId[id.id != null ? id.id : id];
        },
        getByCid: function(cid) {
            return cid && this._byCid[cid.cid || cid];
        },
        at: function(index) {
            return this.models[index];
        },
        where: function(attrs) {
            return _.isEmpty(attrs) ? [] : this.filter(function(model) {
                for (var key in attrs) if (attrs[key] !== model.get(key)) return !1;
                return !0;
            });
        },
        sort: function(options) {
            options || (options = {});
            if (!this.comparator) throw new Error("Cannot sort a set without a comparator");
            var boundComparator = _.bind(this.comparator, this);
            return this.comparator.length == 1 ? this.models = this.sortBy(boundComparator) : this.models.sort(boundComparator), options.silent || this.trigger("reset", this, options), this;
        },
        pluck: function(attr) {
            return _.map(this.models, function(model) {
                return model.get(attr);
            });
        },
        reset: function(models, options) {
            models || (models = []), options || (options = {});
            for (var i = 0, l = this.models.length; i < l; i++) this._removeReference(this.models[i]);
            return this._reset(), this.add(models, _.extend({
                silent: !0
            }, options)), options.silent || this.trigger("reset", this, options), this;
        },
        fetch: function(options) {
            options = options ? _.clone(options) : {}, options.parse === undefined && (options.parse = !0);
            var collection = this, success = options.success;
            return options.success = function(resp, status, xhr) {
                collection[options.add ? "add" : "reset"](collection.parse(resp, xhr), options), success && success(collection, resp);
            }, options.error = Backbone.wrapError(options.error, collection, options), (this.sync || Backbone.sync).call(this, "read", this, options);
        },
        create: function(model, options) {
            var coll = this;
            options = options ? _.clone(options) : {}, model = this._prepareModel(model, options);
            if (!model) return !1;
            options.wait || coll.add(model, options);
            var success = options.success;
            return options.success = function(nextModel, resp, xhr) {
                options.wait && coll.add(nextModel, options), success ? success(nextModel, resp) : nextModel.trigger("sync", model, resp, options);
            }, model.save(null, options), model;
        },
        parse: function(resp, xhr) {
            return resp;
        },
        chain: function() {
            return _(this.models).chain();
        },
        _reset: function(options) {
            this.length = 0, this.models = [], this._byId = {}, this._byCid = {};
        },
        _prepareModel: function(model, options) {
            options || (options = {});
            if (model instanceof Model) model.collection || (model.collection = this); else {
                var attrs = model;
                options.collection = this, model = new this.model(attrs, options), model._validate(model.attributes, options) || (model = !1);
            }
            return model;
        },
        _removeReference: function(model) {
            this == model.collection && delete model.collection, model.off("all", this._onModelEvent, this);
        },
        _onModelEvent: function(event, model, collection, options) {
            if ((event == "add" || event == "remove") && collection != this) return;
            event == "destroy" && this.remove(model, options), model && event === "change:" + model.idAttribute && (delete this._byId[model.previous(model.idAttribute)], this._byId[model.id] = model), this.trigger.apply(this, arguments);
        }
    });
    var methods = [ "forEach", "each", "map", "reduce", "reduceRight", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "sortBy", "sortedIndex", "toArray", "size", "first", "initial", "rest", "last", "without", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "groupBy" ];
    _.each(methods, function(method) {
        Collection.prototype[method] = function() {
            return _[method].apply(_, [ this.models ].concat(_.toArray(arguments)));
        };
    });
    var Router = Backbone.Router = function(options) {
        options || (options = {}), options.routes && (this.routes = options.routes), this._bindRoutes(), this.initialize.apply(this, arguments);
    }, namedParam = /:\w+/g, splatParam = /\*\w+/g, escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;
    _.extend(Router.prototype, Events, {
        initialize: function() {},
        route: function(route, name, callback) {
            return Backbone.history || (Backbone.history = new History), _.isRegExp(route) || (route = this._routeToRegExp(route)), callback || (callback = this[name]), Backbone.history.route(route, _.bind(function(fragment) {
                var args = this._extractParameters(route, fragment);
                callback && callback.apply(this, args), this.trigger.apply(this, [ "route:" + name ].concat(args)), Backbone.history.trigger("route", this, name, args);
            }, this)), this;
        },
        navigate: function(fragment, options) {
            Backbone.history.navigate(fragment, options);
        },
        _bindRoutes: function() {
            if (!this.routes) return;
            var routes = [];
            for (var route in this.routes) routes.unshift([ route, this.routes[route] ]);
            for (var i = 0, l = routes.length; i < l; i++) this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
        },
        _routeToRegExp: function(route) {
            return route = route.replace(escapeRegExp, "\\$&").replace(namedParam, "([^/]+)").replace(splatParam, "(.*?)"), new RegExp("^" + route + "$");
        },
        _extractParameters: function(route, fragment) {
            return route.exec(fragment).slice(1);
        }
    });
    var History = Backbone.History = function() {
        this.handlers = [], _.bindAll(this, "checkUrl");
    }, routeStripper = /^[#\/]/, isExplorer = /msie [\w.]+/;
    History.started = !1, _.extend(History.prototype, Events, {
        interval: 50,
        getHash: function(windowOverride) {
            var loc = windowOverride ? windowOverride.location : window.location, match = loc.href.match(/#(.*)$/);
            return match ? match[1] : "";
        },
        getFragment: function(fragment, forcePushState) {
            if (fragment == null) if (this._hasPushState || forcePushState) {
                fragment = window.location.pathname;
                var search = window.location.search;
                search && (fragment += search);
            } else fragment = this.getHash();
            return fragment.indexOf(this.options.root) || (fragment = fragment.substr(this.options.root.length)), fragment.replace(routeStripper, "");
        },
        start: function(options) {
            if (History.started) throw new Error("Backbone.history has already been started");
            History.started = !0, this.options = _.extend({}, {
                root: "/"
            }, this.options, options), this._wantsHashChange = this.options.hashChange !== !1, this._wantsPushState = !!this.options.pushState, this._hasPushState = !!(this.options.pushState && window.history && window.history.pushState);
            var fragment = this.getFragment(), docMode = document.documentMode, oldIE = isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7);
            oldIE && (this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, this.navigate(fragment)), this._hasPushState ? $(window).bind("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !oldIE ? $(window).bind("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.fragment = fragment;
            var loc = window.location, atRoot = loc.pathname == this.options.root;
            if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) return this.fragment = this.getFragment(null, !0), window.location.replace(this.options.root + "#" + this.fragment), !0;
            this._wantsPushState && this._hasPushState && atRoot && loc.hash && (this.fragment = this.getHash().replace(routeStripper, ""), window.history.replaceState({}, document.title, loc.protocol + "//" + loc.host + this.options.root + this.fragment));
            if (!this.options.silent) return this.loadUrl();
        },
        stop: function() {
            $(window).unbind("popstate", this.checkUrl).unbind("hashchange", this.checkUrl), clearInterval(this._checkUrlInterval), History.started = !1;
        },
        route: function(route, callback) {
            this.handlers.unshift({
                route: route,
                callback: callback
            });
        },
        checkUrl: function(e) {
            var current = this.getFragment();
            current == this.fragment && this.iframe && (current = this.getFragment(this.getHash(this.iframe)));
            if (current == this.fragment) return !1;
            this.iframe && this.navigate(current), this.loadUrl() || this.loadUrl(this.getHash());
        },
        loadUrl: function(fragmentOverride) {
            var fragment = this.fragment = this.getFragment(fragmentOverride), matched = _.any(this.handlers, function(handler) {
                if (handler.route.test(fragment)) return handler.callback(fragment), !0;
            });
            return matched;
        },
        navigate: function(fragment, options) {
            if (!History.started) return !1;
            if (!options || options === !0) options = {
                trigger: options
            };
            var frag = (fragment || "").replace(routeStripper, "");
            if (this.fragment == frag) return;
            this._hasPushState ? (frag.indexOf(this.options.root) != 0 && (frag = this.options.root + frag), this.fragment = frag, window.history[options.replace ? "replaceState" : "pushState"]({}, document.title, frag)) : this._wantsHashChange ? (this.fragment = frag, this._updateHash(window.location, frag, options.replace), this.iframe && frag != this.getFragment(this.getHash(this.iframe)) && (options.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, frag, options.replace))) : window.location.assign(this.options.root + fragment), options.trigger && this.loadUrl(fragment);
        },
        _updateHash: function(location, fragment, replace) {
            replace ? location.replace(location.toString().replace(/(javascript:|#).*$/, "") + "#" + fragment) : location.hash = fragment;
        }
    });
    var View = Backbone.View = function(options) {
        this.cid = _.uniqueId("view"), this._configure(options || {}), this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents();
    }, delegateEventSplitter = /^(\S+)\s*(.*)$/, viewOptions = [ "model", "collection", "el", "id", "attributes", "className", "tagName" ];
    _.extend(View.prototype, Events, {
        tagName: "div",
        $: function(selector) {
            return this.$el.find(selector);
        },
        initialize: function() {},
        render: function() {
            return this;
        },
        remove: function() {
            return this.$el.remove(), this;
        },
        make: function(tagName, attributes, content) {
            var el = document.createElement(tagName);
            return attributes && $(el).attr(attributes), content && $(el).html(content), el;
        },
        setElement: function(element, delegate) {
            return this.$el && this.undelegateEvents(), this.$el = element instanceof $ ? element : $(element), this.el = this.$el[0], delegate !== !1 && this.delegateEvents(), this;
        },
        delegateEvents: function(events) {
            if (!events && !(events = getValue(this, "events"))) return;
            this.undelegateEvents();
            for (var key in events) {
                var method = events[key];
                _.isFunction(method) || (method = this[events[key]]);
                if (!method) throw new Error('Method "' + events[key] + '" does not exist');
                var match = key.match(delegateEventSplitter), eventName = match[1], selector = match[2];
                method = _.bind(method, this), eventName += ".delegateEvents" + this.cid, selector === "" ? this.$el.bind(eventName, method) : this.$el.delegate(selector, eventName, method);
            }
        },
        undelegateEvents: function() {
            this.$el.unbind(".delegateEvents" + this.cid);
        },
        _configure: function(options) {
            this.options && (options = _.extend({}, this.options, options));
            for (var i = 0, l = viewOptions.length; i < l; i++) {
                var attr = viewOptions[i];
                options[attr] && (this[attr] = options[attr]);
            }
            this.options = options;
        },
        _ensureElement: function() {
            if (!this.el) {
                var attrs = getValue(this, "attributes") || {};
                this.id && (attrs.id = this.id), this.className && (attrs["class"] = this.className), this.setElement(this.make(this.tagName, attrs), !1);
            } else this.setElement(this.el, !1);
        }
    });
    var extend = function(protoProps, classProps) {
        var child = inherits(this, protoProps, classProps);
        return child.extend = this.extend, child;
    };
    Model.extend = Collection.extend = Router.extend = View.extend = extend;
    var methodMap = {
        create: "POST",
        update: "PUT",
        "delete": "DELETE",
        read: "GET"
    };
    Backbone.sync = function(method, model, options) {
        var type = methodMap[method];
        options || (options = {});
        var params = {
            type: type,
            dataType: "json"
        };
        return options.url || (params.url = getValue(model, "url") || urlError()), !options.data && model && (method == "create" || method == "update") && (params.contentType = "application/json", params.data = JSON.stringify(model.toJSON())), Backbone.emulateJSON && (params.contentType = "application/x-www-form-urlencoded", params.data = params.data ? {
            model: params.data
        } : {}), Backbone.emulateHTTP && (type === "PUT" || type === "DELETE") && (Backbone.emulateJSON && (params.data._method = type), params.type = "POST", params.beforeSend = function(xhr) {
            xhr.setRequestHeader("X-HTTP-Method-Override", type);
        }), params.type !== "GET" && !Backbone.emulateJSON && (params.processData = !1), $.ajax(_.extend(params, options));
    }, Backbone.wrapError = function(onError, originalModel, options) {
        return function(model, resp) {
            resp = model === originalModel ? resp : model, onError ? onError(originalModel, resp, options) : originalModel.trigger("error", originalModel, resp, options);
        };
    };
    var ctor = function() {}, inherits = function(parent, protoProps, staticProps) {
        var child;
        return protoProps && protoProps.hasOwnProperty("constructor") ? child = protoProps.constructor : child = function() {
            parent.apply(this, arguments);
        }, _.extend(child, parent), ctor.prototype = parent.prototype, child.prototype = new ctor, protoProps && _.extend(child.prototype, protoProps), staticProps && _.extend(child, staticProps), child.prototype.constructor = child, child.__super__ = parent.prototype, child;
    }, getValue = function(object, prop) {
        return !object || !object[prop] ? null : _.isFunction(object[prop]) ? object[prop]() : object[prop];
    }, urlError = function() {
        throw new Error('A "url" property or function must be specified');
    };
}).call(this);