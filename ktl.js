/*
 * KLT uses tags:
 * 
 * {{ var }} - property of passed object
 * {{ _ }}   - verbatim passed object
 * {{# array }} {{ _ }} {{#}} - array iteration
 */

function makeIterator(tag, iterateOver, withTempate) {
    var parser = ktl(withTempate);
    return "'+("
        + iterateOver + ".map && "    // iterate only over arrays
        + iterateOver + ".map("
        + parser.toString()             // parser for subtemplate
            .replace(/\\\\/g, "\\")      // parser is already escaped by toString() 
        + ").join('') || '')+'";    // default to empty string
}

function escape(str) {
    return str
            .replace(/\\/g, '\\\\')                  // escape \
            .replace(/'/g, "\\'")                    // escape '
            .replace(/\n/g, "\\n")                   // escape \n
            .replace(/\r/g, "\\r")                   // escape \r
            
}

function ktl(template) {



    var body = "with(_ instanceof Object ? _ : {}) return '" +
        escape(template)
            .replace(/\{\{\#([^}]+)\}\}(.*)\{\{#\}\}/g, makeIterator) // create a iterator    
            .replace(/\{\{([^#?][^}]*)\}\}/g, "'+(typeof($1)!='undefined'?$1:'')+'")   // parse {{ tag }}
                
        + "';";
        
    //console.log("parser={",body,"}")

    try {
        var parser = new Function('_', "{ " + body + " }");
    }
    catch (e) {
        console.error("Could not compile template: " + e);
        console.trace(body);
    }

    return parser;
}

module.exports = ktl;