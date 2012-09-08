function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    var $ = this, exports = {};
    $.__views.container = A$(Ti.UI.createView({
        id: "container"
    }), "View", null), $.addTopLevelView($.__views.container), $.__views.logout = A$(Ti.UI.createButton({
        id: "logout",
        titleid: "logout"
    }), "Button", $.__views.container), $.__views.container.add($.__views.logout), _.extend($, $.__views);
    var Cloud = require("ti.cloud");
    $.logout.on("click", function() {
        Cloud.Users.logout(function(e) {
            e.success && (Ti.App.Properties.removeProperty("sessionId"), Ti.App.fireEvent("app:logout"));
        });
    }), _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A;

module.exports = Controller;