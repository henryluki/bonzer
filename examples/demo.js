var bonzer = require('../lib/bonzer')
var fs = require('fs')

var tpl = fs.readFileSync('./demo.tpl', { encoding: "utf-8"})
var template = bonzer(tpl)

var data = {
  name: "Sam",
  sold: true,
  items: [{
    price: 10,
    name: "apple"
  }, {
    price: 20,
    name: "orange"
  }, {
    price: 30,
    name: "banana"
  }]
}

var data2 = {
  name: "ruby",
  sold: true
}

console.log(template.render(data))
console.log(template.render(data2))
