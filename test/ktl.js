var should = require("should"),
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
    
    it("allows ' in template", function() {
        var template = "test 'string'";
        ktl(template)().should.be.equal(template);
    });
    
    it("allows \\ in template", function() {
        var template = "test \\ string \\";
        ktl(template)().should.be.equal(template);
    });
    
    it("allows newline in template", function() {
        var template = "line\nline\nline";
        ktl(template)().should.be.equal(template);
    });
    
    it("allows tab in template", function() {
        var template = "tab\ttab\ttab\t";
        ktl(template)().should.be.equal(template);
    });

    it("allows \\r in template", function() {
        var template = "r \r r \r r \r";
        ktl(template)().should.be.equal(template);
    });

});