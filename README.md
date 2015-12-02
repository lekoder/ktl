# Koder's Template Language
[![Build Status](https://travis-ci.org/lekoder/ktl.svg?branch=master)](https://travis-ci.org/lekoder/ktl)
## KTL is a parser factory.

String templating system inspired by [doT](https://github.com/olado/doT/). It parses template
string into javascript function, which in turn can be called with data to return parsed string.

It returns verbatim string (no escaping, etc) makin it useful for generation of configuration files.

It should be augumented with HTML escaper when using on web. Escaping is not implemented by design. 

## Usage
```javascript
var output = ktl(template)(data);
```

## Supported tags:
### Evaluation
All values support complete JavaScript notation. You can freely use operators, methods, global scope
objects (ie. Math), etc.

|Tag                        | Meaning
|---------------------------|--------------------------------------------------------------
|`{{ prop }}`               | Selected property of object passed to parser
|`{{ prop.sub }}`           | Subproperties can be accessed with dot notation
|`{{ method() }}`           | Methods can be called
|`{{ value.toFixed(2) }}`   | Methods of properties can allso be called
|`{{ prop ? prop : '-' }}`  | All operators are available (in this case: default to `'-'`)
|`{{ _ }}`                  | Verbatim object passed to parser, cast to string. Usefull in iterations. 
|`{{ _.toFixed(4) }}`       | Methods can also be called on verbatim objects

### Iteration
Iteration starts with `{{# <array> }}` and ends with `{{#}}`. Iterations can be nested. String
between `{{# <array> }}` and `{{#}}` is treated as new template. Verbatim evaluation (`{{ _ }}`) is
usefull for arrays of primitives. `$` is available as index inside iteration.

|Tag                        | Meaning
|---------------------------|--------------------------------------------------------------
|`{{# array }}`             | Iterate over array passed as `{array:[]}` to parser
|`{{# _ }}`                 | Verbatim iteration (when passing `[]` to parser)

## Examples:

Template:
```ktl
Hi {{ name }}! You have {{ messages.length || 'no' }} new messages.
{{# messages }}
    {{ title.toUppercase() }}: from {{ from }}
{{#}} 
```
Data:
```json
{
    "name":"koder",
    "messages": [
        { "title": "message 1", "from": "koder" },
        { "title": "message 2", "from": "dekoder" }       
    ]
}   

```
Output
```
Hi koder! You have 2 new messages.

MESSAGE 1: from koder

MESSAGE 2: from dekoder
```

## Why KTL?

Most templating languages are web-centric. I required a templating language which works on strings
without assuming what those strings will be used for.

### Design choices

* KTL gives you parser for a string, which you can call with an object to get something of it.
* It has no dependencies.
* It does not care what do you use this string for.
* It returns verbatim string if there is no data.
* Template caching is out of it's scope. You can cache parsers if you like.
* Escaping string is also out of it's scope. 

## Alternatives

* [doT](https://github.com/olado/doT/) is an excellent templating language with blazing-fast
implementation and it was inspiration to write KTL. It is however www-centric and `it` notation
is not that useful.

* [mustache](https://mustache.github.io/) is another brilliant templating language, but it still
requires specific `{{{ tag }}}` to avoid escaping.
