var ktl = require('../ktl');

var tpl = "Hi {{ name }}! You have {{ messages.length || 'no' }} new messages.\n"+
          "{{# messages }}"+
          "{{ title.toUpperCase() }}: from {{ from }}\n"+
          "{{#}}\n";

var parser = ktl(tpl);
var data = {
    name:'koder',
    messages: [
        { title: "message 1", from: "koder" },
        { title: "message 2", from: "dekoder" }       
    ]
};

console.log(parser(data));

var data2 = {
    name:'dekoder',
    messages: []
};

console.log(parser(data2));

