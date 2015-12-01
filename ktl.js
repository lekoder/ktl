/*
 * KLT uses tags:
 * 
 * {{ var }} - property of passed object
 * {{ _ }}   - verbatim passed object
 * {{# array }} {{ _ }} {{#}} - array iteration
 * {{? condition}} data {{?}} - conditional
 */

var detlimer = /{{|}}/
var nestingTokens = {
    '#': function (tokens) {
        // build an iteration
        var array = tokens[0].substring(1);
        return array + ".map(function(_,$){ try{ " + build(tokens.splice(1)) + "  } catch(e) { return \"\"}  } ).join(\"\")";

    },
    '?': function (tokens) {
        // build an condition
        console.log("condition",tokens);
        var condition = tokens[0].substring(1);
        return condition + "? (function() { "+build(tokens.splice(1))+" })() : \"\"";
    }
}

function build(tokens) {
    var body = [];
    var idx;

    for (idx = 0; idx < tokens.length; idx += 2) {
        body.push(JSON.stringify(tokens[idx]));
        var token = tokens[idx + 1];
        if (token) {
            var nesting = nestingTokens[token[0]];
            if (nesting) {
                if (token.length > 1) {
                    var depth = 1;
                    var nestor = token[0];
                    var ahead = idx + 1;

                    do {
                        ahead += 2;
                        if (ahead >= tokens.length) break;
                        if (tokens[ahead][0] == nestor) {

                            if (tokens[ahead].length === 1) {
                                depth -= 1;
                            } else {
                                depth += 1;
                            }
                        }
                    } while (depth > 0);
                    if (depth > 0) {
                        throw new SyntaxError("Missing closing " + nestor);
                    }
                    body.push("(" + nesting(tokens.slice(idx + 1, ahead)) + ")");

                    idx = ahead;
                }
                else {
                    throw new SyntaxError("Unexpeced closing tag: " + token);
                }
            }
            else {
                body.push("(typeof(" + token + ")!==\"undefined\"?" + token + ":\"\")");
            }
        }
    }


    var source = "{ with(_||{}) { return " + body.join("+") + "; } }";
    console.log(source);
    return source;
}

function compile(tokens) {
    return new Function("_,$", build(tokens));
}

function ktl(template) {

    console.log(template);
    try {
        return compile(template.split(detlimer));
    }
    catch (e) {
        console.error("Could not compile template: " + e);
    }
}

module.exports = ktl;