var ktl = function (template) {

    var body = "{ with(_||{}) return '" + 
            template
                .replace(/\\/g,'\\\\')
                .replace(/'/g,"\\'")
                .replace(/\n/g,"\\n")
                .replace(/\r/g,"\\r")
        + "'; }";
    try {
        var parser = new Function('_', body);
    } catch (e) {
        console.err("Could not compile template: " + e);
    }

    return parser;
}

module.exports = ktl;