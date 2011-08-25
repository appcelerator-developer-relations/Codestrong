/**
 * This file is part of DrupalCon Mobile.
 *
 * DrupalCon Mobile is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DrupalCon Mobile is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DrupalCon Mobile.  If not, see <http://www.gnu.org/licenses/>.
 */

// Declaring variables to prevent implied global error in jslint
var Ti;

(function() {

  var win = Titanium.UI.currentWindow;
  var android = Ti.Platform.name == 'android';
  var data = [];

  // Items that go on the preferences page
  var titleLabel = Titanium.UI.createLabel({
      text:'Please enter your Drupal.org username and password.',
      height:50,
      width:300,
      top: 10,
      textAlign:'left',
      font:{fontSize:18}
  });

  var username = Ti.UI.createTextField({
    autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
    width:300,
    top: android ? 75 : 65,
    height: android ? 45 : 35,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    hintText:'Username'
  });

  var password = Ti.UI.createTextField({
    autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
    width:300,
    top:android ? 125 : 105,
    height:android ? 45 : 35,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    passwordMask:true,
    hintText:'Password'
  });

  var button = Titanium.UI.createButton({
    title:'Save',
    width:300,
    top:android ? 175 : 145,
    height: android ? 45 : 35
  });

  win.add(titleLabel);
  win.add(username);
  win.add(password);
  win.add(button);

  button.addEventListener('click',function(e) {
    var pass = password.value ? password.value : 'no password';
    var user = username.value ? username.value : 'no username';
    //Ti.API.info(user + ':' + pass);

    Titanium.App.Properties.setString("siteUsername",user);
    Titanium.App.Properties.setString("sitePassword",pass);
    //
    //  TAB GROUP EVENTS
    //
    var messageWin = Titanium.UI.createWindow({
      height:30,
      width:250,
      top:270,
      borderRadius:10,
      touchEnabled:false

//      orientationModes : [
//      Titanium.UI.PORTRAIT,
//      Titanium.UI.UPSIDE_PORTRAIT,
//      Titanium.UI.LANDSCAPE_LEFT,
//      Titanium.UI.LANDSCAPE_RIGHT
//      ]
    });
    var messageView = Titanium.UI.createView({
      id:'messageview',
      height:30,
      width:250,
      borderRadius:10,
      backgroundColor:'#fff',
      opacity:0.7,
      touchEnabled:false
    });

    var messageLabel = Titanium.UI.createLabel({
      id:'messagelabel',
      text:'',
      color:'#000',
      width:250,
      height:'auto',
      font:{
        fontFamily:'Helvetica Neue',
        fontSize:13
      },
      textAlign:'center'
    });
    messageWin.add(messageView);
    messageWin.add(messageLabel);

    messageLabel.text = 'Your preferences have been saved.';
    messageWin.open();
    setTimeout(function() {
      messageLabel.text = 'Your preferences have been saved.';
    }, 1000);

    setTimeout(function() {
      messageWin.close({opacity:0,duration:500});
      win.close();
    }, 2000);

  });

})();