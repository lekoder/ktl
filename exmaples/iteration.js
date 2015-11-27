var ktl = require('../ktl');

var tpl = "Hi {{ name }}! You have {{ messages.length }} new messages.\n"+
          "{{# messages }}\n"+
          "{{ title.toUpperCase() }}: from {{ from }}\n"+
          "{{#}}";

var parser = ktl(tpl);
var data = {
    name:'koder',
    messages: [
        { title: "message 1", from: "koder" },
        { title: "message 2", from: "dekoder" }       
    ]
};

console.log(parser(data));

