var should = require("should"),
    ktl = require('../ktl');

describe("ktl", function () {

    it("should parse template into a function returning a string", function () {
        var template = "test string";
        ktl(template).should.be.a.Function();
        ktl(template)().should.be.a.String();
    });

    it("should parse tagless template into itself", function () {
        var template = "test string";
        ktl(template)().should.be.equal(template);
    })

});