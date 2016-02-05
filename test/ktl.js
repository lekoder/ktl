var should = require("should"),
    fs = require("fs"),
    ktl = require('../ktl');

describe("ktl", function () {

    it("parses template into a function returning a string", function () {
        var template = "test string";
        ktl(template).should.be.a.Function();
        ktl(template)().should.be.a.String();
    });

    it("parses tagless template into itself", function () {
        var template = "test string";
        ktl(template)().should.be.equal(template);
    });

    it("allows ' in template", function () {
        var template = "test 'string'";
        ktl(template)().should.be.equal(template);
    });
    it("allows string literals in tags", function () {
        var template = "test {{ 'str\ing' }}";
        ktl(template)().should.be.equal("test string");
    });

    it("allows \\ in template", function () {
        var template = "test \\ string \\";
        ktl(template)().should.be.equal(template);
    });

    it("allows newline in template", function () {
        var template = "line\nline\nline";
        ktl(template)().should.be.equal(template);
    });

    it("allows tab in template", function () {
        var template = "tab\ttab\ttab\t";
        ktl(template)().should.be.equal(template);
    });

    it("allows \\r in template", function () {
        var template = "r \r r \r r \r";
        ktl(template)().should.be.equal(template);
    });

    it("replaces {{ tag }} with value", function () {
        ktl("string {{ tag }} string")
            ({ tag: 'asd' }).should.be.equal(
                "string asd string"
                );
    });
    it("replaces more than one tag", function () {
        ktl("string {{ tag }} string {{ bong }}")
            ({ tag: 'asd', bong: 'wtf' }).should.be.equal(
                "string asd string wtf"
                );
    });

    it("replaces {{ tag.subtag }} with value", function () {
        ktl("string {{ tag.subtag }} string")
            ({ tag: { subtag: 'asd' } }).should.be.equal(
                "string asd string"
                );
    });

    it("replaces missing values with empty strings", function () {
        ktl("string {{ tag }} string")
            ({}).should.be.equal(
                "string  string"
                );
    });

    it("replaces {{_}} with verbatim string passed to parser", function () {
        ktl("string:{{_}}")
            ("some").should.be.equal(
                "string:some"
                );
    });
    it("replaces {{_}} with toString of a number", function () {
        ktl("number:{{_}}")
            (123).should.be.equal(
                "number:123"
                );
    });
    it("iterates over {{# array }} / {{#}} tag", function () {
        var template = "array:{{# a }}v:{{ val }};{{#}}";
        var data = { a: [{ val: 1 }, { val: 2 }] };
        var expect = "array:v:1;v:2;";

        ktl(template)(data).should.be.equal(expect);
    });

    it("supports verbatim array iteration", function () {
        var template = "array:{{#_}}{{_}}{{#}}";
        var data = [1, 2, 3, 4];
        var expect = "array:1234";
        ktl(template)(data).should.be.equal(expect);
    })

    it("supports iteration over empty array", function () {
        var template = "empty:{{#_}}{{_}}{{#}}";
        var data = [];
        var expect = "empty:";
        ktl(template)(data).should.be.equal(expect);
    });

    it("supports nested iteration", function () {
        var template = "{{#_}}{{#_}}{{_}}{{#}}{{#}}";
        var data = [[1, 2], [3, 4]];
        var expect = "1234";
        ktl(template)(data).should.be.equal(expect);
    });
    it("allows to call methods", function () {
        var template = "{{ string.toUpperCase() }}";
        var data = { string: 'asd' };
        var expect = "ASD";
        ktl(template)(data).should.be.equal(expect);
    });
    it("allows to use operators", function () {
        var template = "{{ a + b }}";
        var data = { a: 5, b: 2 };
        var expect = "7";
        ktl(template)(data).should.be.equal(expect);
    });
    it("supports defaulting operator ||", function () {
        var template = "{{ len || 'no' }}";
        var data = { len: 0 };
        var expect = "no";
        ktl(template)(data).should.be.equal(expect);
    });
    it("supports nested iteration with missing values", function () {
        var template = "{{#_}}{{#_}}{{_}}{{#}}{{#}}";
        var data = [[1, 2], '123', [3, 4]];
        var expect = "1234";
        ktl(template)(data).should.be.equal(expect);
    });
    it("treats non-arrays as empty arrays when iterating", function () {
        var template = "empty:{{#_}}{{_}}{{#}}";
        var data = "test";
        var expect = "empty:";
        ktl(template)(data).should.be.equal(expect);
    });
    it("allows null iteration over unexisting property", function () {
        var template = "empty:{{#list}}{{_}}{{#}}";
        var data = {};
        var expect = "empty:";
        ktl(template)(data).should.be.equal(expect);
    });

    it("allows multi-line iteration", function () {
        var template = "{{#_}}" +
            "value:{{_}}\n" +
            "{{#}}";
        var data = ['foo', 'bar'];
        var expect = "value:foo\nvalue:bar\n";
        ktl(template)(data).should.be.equal(expect);
    });
    it("has conditionals", function () {

        ktl("empty:{{?_}}has data{{?}}")(false).should.be.equal("empty:");
        ktl("empty:{{?_}}has data{{?}}")(true).should.be.equal("empty:has data");

    });
    it("suppots operators in conditions", function () {
        ktl("more:{{?_>3}}yes{{?}}")(5).should.be.equal("more:yes");
        ktl("more:{{?_>3}}yes{{?}}")(2).should.be.equal("more:");
    });
    it("has else conditional", function() {
        ktl("bool:{{?_}}true{{:}}false{{?}}")(true).should.be.equal("bool:true");
        ktl("bool:{{?_}}true{{:}}false{{?}}")(false).should.be.equal("bool:false");
    })
    
    
    it("supports multiline conditions", function () {
        var template = "data:\n{{?_}}has data\n{{?}}";
        ktl(template)(true).should.be.equal("data:\nhas data\n");
        ktl(template)(false).should.be.equal("data:\n");
    });
    it("supports conditions in iterators", function () {
        var template = "{{#_}}{{?_>3}}{{_}}{{?}}{{#}}";
        var data = [1, 2, 3, 4, 5, 6, 7];
        ktl(template)(data).should.be.equal('4567');
    })
    it("supports tags in conditions", function () {
        var template = "{{?more}}{{value}}{{?}}";
        ktl(template)({ more: true, value: 'asd' }).should.be.equal("asd");
        ktl(template)({ more: false, value: 'asd' }).should.be.equal("");
    });
    it("supports undefined conditions", function () {
        var template = "{{?more}}{{?}}";
        ktl(template)({}).should.be.equal("");
    });

    it("has access to index in array as $", function () {
        ktl("{{#_}}{{$}}{{#}}")(['a', 'b', 'c']).should.be.equal("012");
    })
    it("allows any character inside iterator", function () {
        var template = "{{#list}}'\"\\{{_}}{{#}}";
        ktl(template)({ list: [1, 2, 3, 4] }).should.be.equal("'\"\\1'\"\\2'\"\\3'\"\\4");
    })
    it("undefined is treated as false in conditionals", function () {

        ktl("empty:{{?a==true}}has data{{?}}")({}).should.be.equal("empty:");
    });
    it("parses real-world template", function () {
        var template = fs.readFileSync("test/real/t1.ktl").toString();
        var expected = fs.readFileSync("test/real/t1.out").toString();
        var data = JSON.parse(fs.readFileSync("test/real/t1.json").toString() );
        
        var out = ktl(template)(data);
        out.should.be.equal(expected);
    });
    it("throws exception on error in template - unmatched {{?}}", function() {
       (function templateWithUnterminatedCondition() { return ktl("{{?}}unterminated condition") }).should.throw(SyntaxError);
    });
    it("throws exception on error in template - not closed {{?}}", function() {
       (function templateWithUnterminatedCondition() { return ktl("{{? val }}unterminated condition") }).should.throw(SyntaxError);
    });
    it("throws exception on error in template - unmatched {{#}}", function() {
       (function tempalteWithUnterminatedIteration() { return ktl("{{#}}unterminated iteration") }).should.throw(SyntaxError);
    });
    it("throws exception on error in template - not closed {{#}}", function() {
       (function tempalteWithUnterminatedIteration() { return ktl("{{# arr }}unterminated iteration") }).should.throw(SyntaxError);
    });
    it("throws exception on error in template - gibberish in tag", function() {
       (function tempalteWithGibberish() { return ktl("{{=!?}}gibberish") }).should.throw(SyntaxError);
    });
    it("error message contains line number", function() {
       (function tempalteWithErrorOnLine1() { return ktl("{{?}}") }).should.throw(/line 1/);
       (function tempalteWithErrorOnLine4() { return ktl("1\n2\n3\n{{?}}") }).should.throw(/line 4/);
    });
});