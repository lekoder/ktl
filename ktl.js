/*
 * KLT uses tags:
 * 
 * {{ var }} - property of passed object
 * {{ _ }}   - verbatim passed object
 * {{# array }} {{ _ }} {{#}} - array iteration
 * {{? condition}} data {{?}} - conditional
 */

function makeCondition(tag, arg, content) {
    return "\"+(typeof("+arg+")!==\"undefined\"&&"+arg+"?(\""+content+"\"):\"\")+\"";
}

function makeIterator(tag, iterateOver, withTempate) {
    var parser = ktl(JSON.parse("\""+withTempate+"\"")); // template is already escaped
    return "\"+("
        + "typeof("+iterateOver+")!==\"undefined\" &&"
        + iterateOver + ".map && "    // iterate only over arrays
        + iterateOver + ".map("
        + parser.toString()             // parser for subtemplate
        + ").join(\"\") || \"\")+\"";    // default to empty string
}

function escape(str) {
    var e=JSON.stringify(str);
    return e.substring(1, e.length-1);

}

function ktl(template) {
    var body = "with(_ instanceof Object ? _ : {}) return \"" +
            template
            .replace(/[^{}]+({{|$)/g,escape)
            .replace(/\{\{\#([^}]+)\}\}(.*)\{\{\#\}\}/g, makeIterator) // create a iterator {{# }}    
            .replace(/\{\{\?([^}]+)\}\}(.*)\{\{\?\}\}/g, makeCondition) // create a condition {{? }}
            .replace(/\{\{([^#?][^}]*)\}\}/g, "\"+(typeof($1)!=\"undefined\"?$1:\"\")+\"")   // parse {{ tag }}
                
        + "\";";

    try {
        var parser = new Function("_,$", "{ " + body + " }");
    }
    catch (e) {
        console.error("Could not compile template: " + e);
        console.trace(body);
    }

    return parser;
}

module.exports = ktl;