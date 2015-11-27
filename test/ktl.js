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
    
    it("replaces {{ tag }} with value", function() {
       ktl("string {{ tag }} string")
          ({tag:'asd'}).should.be.equal(
              "string asd string"
          );
    });
    it("replaces more than one tag", function() {
       ktl("string {{ tag }} string {{ bong }}")
          ({tag:'asd',bong:'wtf'}).should.be.equal(
              "string asd string wtf"
          );
    });
    
    it("replaces {{ tag.subtag }} with value", function() {
       ktl("string {{ tag.subtag }} string")
          ({tag:{subtag:'asd'}}).should.be.equal(
              "string asd string"
          );
    });
    
    it("replaces missing values with empty strings", function() {
       ktl("string {{ tag }} string")
          ({}).should.be.equal(
              "string  string"
          );
    });
    
    
    
    it("iterates over {{# array }} / {{#}} tag", function() {
        var template = "array:{{# a }}v:{{ val }};{{#}}";
        var data = [{val:1},{val:2}];
        var expect = "array:v:1;v:2;";
        
        ktl(template)(data).should.be.equal(expect);
    });
    

});