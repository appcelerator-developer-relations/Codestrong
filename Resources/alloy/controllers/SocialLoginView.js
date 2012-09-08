function Controller() {
    function loginHandler(e) {
        e.success ? ($.scroller.scrollToView(0), Ti.App.Properties.setString("sessionId", Cloud.sessionId), Ti.App.fireEvent("app:login.success")) : alert("Login Error: " + e.message);
    }
    function fbLogin() {
        Ti.Facebook.loggedIn && Cloud.SocialIntegrations.externalAccountLogin({
            type: "facebook",
            token: Ti.Facebook.accessToken
        }, loginHandler);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    var $ = this, exports = {};
    $.__views.wrapper = A$(Ti.UI.createView({
        height: Ti.UI.SIZE,
        id: "wrapper"
    }), "View", null), $.addTopLevelView($.__views.wrapper);
    var __alloyId1 = [];
    $.__views.social = A$(Ti.UI.createView({
        layout: "vertical",
        height: Ti.UI.SIZE,
        id: "social"
    }), "View", null), __alloyId1.push($.__views.social), $.__views.fb = A$(Ti.UI.createButton({
        top: 20,
        height: 22,
        width: 150,
        backgroundImage: "/img/facebook_up.png",
        backgroundSelectedImage: "/img/facebook_down.png",
        id: "fb"
    }), "Button", $.__views.social), $.__views.social.add($.__views.fb), $.__views.twitter = A$(Ti.UI.createButton({
        top: 20,
        height: 22,
        width: 150,
        backgroundImage: "/img/twitter_up.png",
        backgroundSelectedImage: "/img/twitter_down.png",
        id: "twitter"
    }), "Button", $.__views.social), $.__views.social.add($.__views.twitter), $.__views.uhwhat = A$(Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: 44,
        color: "#0b72b6",
        textAlign: "center",
        font: {
            fontSize: "12dip"
        },
        top: 15,
        id: "uhwhat",
        textid: "uhwhat"
    }), "Label", $.__views.social), $.__views.social.add($.__views.uhwhat), $.__views.alreadyDid = A$(Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: 44,
        color: "#0b72b6",
        textAlign: "center",
        font: {
            fontSize: "12dip"
        },
        top: 0,
        id: "alreadyDid",
        textid: "alreadyDid"
    }), "Label", $.__views.social), $.__views.social.add($.__views.alreadyDid), $.__views.form = A$(Ti.UI.createView({
        layout: "vertical",
        height: Ti.UI.SIZE,
        id: "form"
    }), "View", null), __alloyId1.push($.__views.form), $.__views.header = A$(Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#0b72b6",
        textAlign: "center",
        font: {
            fontSize: "12dip"
        },
        id: "header",
        textid: "thatscool"
    }), "Label", $.__views.form), $.__views.form.add($.__views.header), $.__views.email = A$(Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        top: 10,
        left: 10,
        right: 10,
        height: 44,
        id: "email"
    }), "TextField", $.__views.form), $.__views.form.add($.__views.email), $.__views.password = A$(Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        top: 10,
        left: 10,
        right: 10,
        height: 44,
        id: "password",
        passwordMask: "true"
    }), "TextField", $.__views.form), $.__views.form.add($.__views.password), $.__views.__alloyId2 = A$(Ti.UI.createView({
        id: "__alloyId2"
    }), "View", $.__views.form), $.__views.form.add($.__views.__alloyId2), $.__views.action = A$(Ti.UI.createButton({
        id: "action",
        titleid: "signup",
        width: "130",
        height: "44",
        left: "10"
    }), "Button", $.__views.__alloyId2), $.__views.__alloyId2.add($.__views.action), $.__views.cancel = A$(Ti.UI.createButton({
        id: "cancel",
        titleid: "cancel",
        width: "130",
        height: "44",
        right: "10"
    }), "Button", $.__views.__alloyId2), $.__views.__alloyId2.add($.__views.cancel), $.__views.scroller = A$(Ti.UI.createScrollableView({
        top: 10,
        height: 200,
        views: __alloyId1,
        id: "scroller",
        scrollingEnabled: "false"
    }), "ScrollableView", $.__views.wrapper), $.__views.wrapper.add($.__views.scroller), $.__views.loading = A$(Ti.UI.createView({
        backgroundColor: "#cdcdcd",
        visible: !1,
        height: 80,
        width: 120,
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 5,
        id: "loading"
    }), "View", $.__views.wrapper), $.__views.wrapper.add($.__views.loading), $.__views.__alloyId3 = A$(Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#0b72b6",
        textAlign: "center",
        font: {
            fontSize: "12dip"
        },
        textid: "working",
        id: "__alloyId3"
    }), "Label", $.__views.loading), $.__views.loading.add($.__views.__alloyId3), _.extend($, $.__views);
    var social = require("alloy/social"), Cloud = require("ti.cloud");
    $.email.hintText = L("email"), $.password.hintText = L("password");
    var selectedAction = 0;
    Ti.Facebook.addEventListener("login", fbLogin), $.fb.on("click", function() {
        Ti.Facebook.authorize();
    }), $.twitter.on("click", function() {
        alert("removed twitter login for now");
    }), $.uhwhat.on("touchend", function() {
        selectedAction = 0, $.action.title = L("signup"), $.header.text = L("thatscool"), $.scroller.scrollToView(1);
    }), $.alreadyDid.on("touchend", function() {
        selectedAction = 1, $.action.title = L("login"), $.header.text = L("ohnice"), $.scroller.scrollToView(1);
    }), $.cancel.on("touchend", function() {
        $.scroller.scrollToView(0);
    }), $.action.on("touchend", function() {
        $.loading.visible = !0, selectedAction === 0 ? Cloud.Users.create({
            email: $.email.value,
            first_name: "Codestrong",
            last_name: "User",
            password: $.password.value,
            password_confirmation: $.password.value
        }, loginHandler) : Cloud.Users.login({
            login: $.email.value,
            password: $.password.value
        }, loginHandler);
    }), _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A;

module.exports = Controller;