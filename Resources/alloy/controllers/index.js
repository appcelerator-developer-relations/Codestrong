function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    var $ = this, exports = {};
    $.__views.index = A$(Ti.UI.createWindow({
        backgroundImage: "/img/bg.png",
        navBarHidden: !0,
        exitOnClose: "true",
        id: "index"
    }), "Window", null), $.addTopLevelView($.__views.index), $.__views.logo = A$(Ti.UI.createImageView({
        id: "logo",
        image: "/img/codestrong-logo.png"
    }), "ImageView", $.__views.index), $.__views.index.add($.__views.logo), _.extend($, $.__views), Ti.Facebook.appid = Ti.App.Properties.getString("ti.facebook.appid"), Ti.Facebook.permissions = [ "publish_stream" ];
    var Cloud = require("ti.cloud");
    $.dashboardView = Alloy.createController("DashboardView"), $.loginView = Alloy.createController("LoginView");
    var sessionId = Ti.App.Properties.getString("sessionId");
    Ti.API.info("stored:" + sessionId), sessionId ? (Cloud.sessionId = sessionId, $.index.remove($.logo), $.index.add($.dashboardView.getView())) : ($.index.remove($.logo), $.index.add($.loginView.getView())), Ti.App.addEventListener("app:login.success", function(e) {
        $.index.add($.dashboardView.getView()), $.index.remove($.loginView.getView());
    }), Ti.App.addEventListener("app:logout", function(e) {
        $.index.remove($.dashboardView.getView()), $.index.add($.loginView.getView());
    }), $.index.open(), _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A;

module.exports = Controller;