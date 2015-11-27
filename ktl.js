/*
 * KLT uses tags:
 * 
 * {{ var }} - variable
 * {{# array }} {{ val }} {{#}} - array/object iteration
 */

var ktl = function (template) {

    var body = "{ with(_ instanceof Object ? _ : {}) return '" + 
            template
                .replace(/\\/g,'\\\\')                  // escape \
                .replace(/'/g,"\\'")                    // escape '
                .replace(/\n/g,"\\n")                   // escape \n
                .replace(/\r/g,"\\r")                   // escape \r
                
                .replace(/\{\{([^#?]?[^}]*)\}\}/g, "'+(typeof($1)!='undefined'?$1:'')+'")   // parse {{ tag }}
                
        + "'; }";
     
    try 
    {
        var parser = new Function('_', body);
    }
    catch (e) 
    {
        console.err("Could not compile template: " + e);
    }

    return parser;
}

module.exports = ktl;