var ktl = function (template) {

    var body = "{ return '" + template + "'; }";
    try {
        var parser = new Function('obj', body);
    } catch (e) {
        console.err("Could not compile template: " + e);
    }

    return parser;
}

module.exports = ktl;