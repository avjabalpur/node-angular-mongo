! function(t) {
    "use strict";

    function e(t, e, n, i) {
        this.scope = t, this.property = e, this.parameters = n, this._scopeBindings = i, this._ignore = [], this.logLabel = "scope" + this.scope.n + "[" + this.property + "]"
    }

    function n(t, i, r) {
        var o = {
            update: {
                method: "PUT"
            }
        };
        _.assign(o, r);
        var a = i(t, {}, o);
        Object.defineProperty(a, "uri", {
            get: function() {
                return t
            }
        });
        var s = [];
        return a.bindScope = function(t, n, i, r) {
            var o = new e(t, n, i, s);
            s.push(o), o.log("parameters", i), o.log("self.get(...)", t[n]);
            var p = function(e) {
                o.log("getThen", e), o.unWatch = t.$watch(n, angular.bind(o, o.onWatch), !0)
            };
            return o.setValue(r ? a.query(i, p) : a.get(i, p)), a
        }, a.bindScope1 = function(t, e, n) {
            return a.bindScope(t, e, n, !1)
        }, a.bindScopeN = function(t, e, n) {
            return a.bindScope(t, e, n, !0)
        }, a.map = function(e, r, o, s) {
            var p = new n(t + r, i, o);
            return Object.defineProperty(a, e, {
                value: p,
                writable: !1
            }), s && angular.bind(p, s)(p), a
        }, a.matchUri = function(e) {
            return t === e
        }, a
    }
    e.prototype.log = function() {}, e.prototype.isInterested = function(t, e) {
        return -1 === this._ignore.indexOf(t) && angular.equals(e, this.parameters) && !angular.equals(t, this.getValue())
    }, e.prototype.onWatch = function(t) {
        if (-1 === this._ignore.indexOf(t)) {
            this._ignore.push(t);
            try {
                this.log("onWatch", t);
                for (var e = 0; e < this._scopeBindings.length; e++) {
                    var n = this._scopeBindings[e];
                    if (n !== this && n.isInterested(t, this.parameters)) {
                        this.log("onWatch-update(" + n.logLabel + ")", t), n._ignore.push(t);
                        try {
                            n.setValue(t)
                        } finally {
                            n._ignore.pop()
                        }
                    }
                }
            } finally {
                this._ignore.pop()
            }
        }
    }, e.prototype.getValue = function() {
        return this.scope[this.property]
    }, e.prototype.setValue = function(t) {
        this.log("setValue", t), this.scope[this.property] = t
    }, angular.module('app').factory("api", ["$resource", "api_config", function(t, e) {
        for (var i = new n(e.api_root, t), r = [{
                apiNode: i,
                value: e.api_routes
            }]; r.length > 0;) {
            var o = r.pop();
            for (var a in o.value)
                if (o.value.hasOwnProperty(a)) {
                    var s = o.value[a],
                        p = {
                            get: {
                                method: "GET",
                                cache: !1
                            }
                        },
                        u = "";
                    "string" == typeof s || s instanceof String ? (u = s, s = void 0) : s instanceof Array && (u = s[0], s.length > 3 && (p = s[3]), s = s.length < 3 ? s[1] : s[2]), o.apiNode.map(a, u, p, function(t) {
                        r.push({
                            apiNode: t,
                            value: s
                        })
                    })
                }
        }
        return i
    }])
}(window.app);