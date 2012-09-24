/*
 * Big ups, Rob Griffith for the original code!
 * 
 * https://github.com/bytespider/Gravitas
 * 
 */

var GRAVATAR_URL = "https://secure.gravatar.com/avatar";

var GRAVATAR_DEFAULT_404        = "404";
var GRAVATAR_DEFAULT_OUTLINE    = "mm";
var GRAVATAR_DEFAULT_GEOMETRIC  = "identicon";
var GRAVATAR_DEFAULT_MONSTER    = "monsterid";
var GRAVATAR_DEFAULT_FACES      = "wavater";
var GRAVATAR_DEFAULT_RETRO      = "retro";
var GRAVATAR_DEFAULT_CUSTOM     = "custom";

var GRAVATAR_DEFAULT_ROBOHASH   = "robohash";
var ROBOHASH_URL                = "http://robohash.org/";

var GRAVATAR_RATING_G   = "g";
var GRAVATAR_RATING_PG  = "pg";
var GRAVATAR_RATING_R   = "r";
var GRAVATAR_RATING_X   = "x";

function createGravatar(options)
{
    var md5 = Ti.Utils.md5HexDigest(options.email),
        url = GRAVATAR_URL + "/" + md5,
        style = options.defaultStyle || GRAVATAR_DEFAULT_GEOMETRIC,
        rating = options.rating || GRAVATAR_RATING_G,
        size = options.size || 80,
        ext = ( "extention" in options && options.extention === true ) ? ".jpg" : "",
        hires = "hires" in options && options.hires === true,
        default_image = options.defaultImage || "",
        image;

    if ( style === GRAVATAR_DEFAULT_CUSTOM )
    {
        style = GRAVATAR_DEFAULT_404;
    }

    if ( style === GRAVATAR_DEFAULT_ROBOHASH )
    {
        style = Ti.Network.encodeURIComponent(ROBOHASH_URL + "/" + md5 + "?bgset=any&size=" + size + "x" + size);
    }

    url += "?d=" + style;
    url += "&r=" + rating;
    url += "&s=" + size;

    return url;
}

exports.createGravatar = createGravatar;

exports.DEFAULT_STYLE_404        = GRAVATAR_DEFAULT_404;
exports.DEFAULT_STYLE_OUTLINE    = GRAVATAR_DEFAULT_OUTLINE;
exports.DEFAULT_STYLE_GEOMETRIC  = GRAVATAR_DEFAULT_GEOMETRIC;
exports.DEFAULT_STYLE_MONSTER    = GRAVATAR_DEFAULT_MONSTER;
exports.DEFAULT_STYLE_FACES      = GRAVATAR_DEFAULT_FACES;
exports.DEFAULT_STYLE_RETRO      = GRAVATAR_DEFAULT_RETRO;
exports.DEFAULT_STYLE_CUSTOM     = GRAVATAR_DEFAULT_CUSTOM;

exports.DEFAULT_STYLE_ROBOHASH   = GRAVATAR_DEFAULT_ROBOHASH;

exports.RATING_G   = "g";
exports.RATING_PG  = "pg";
exports.RATING_R   = "r";
exports.RATING_X   = "x";