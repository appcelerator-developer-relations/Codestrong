function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    var $ = this, exports = {};
    $.__views.container = A$(Ti.UI.createView({
        layout: "vertical",
        width: 310,
        height: Ti.UI.SIZE,
        id: "container"
    }), "View", null), $.addTopLevelView($.__views.container), $.__views.logo = A$(Ti.UI.createImageView({
        top: 10,
        left: 10,
        right: 10,
        image: "/img/codestrong-logo.png",
        id: "logo"
    }), "ImageView", $.__views.container), $.__views.container.add($.__views.logo), $.__views.social = Alloy.createController("SocialLoginView", {
        id: "social"
    }), $.__views.social.setParent($.__views.container), _.extend($, $.__views), _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A;

module.exports = Controller;