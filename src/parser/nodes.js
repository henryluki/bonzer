import * as constants from '../constants'

class Leaf {
  constructor(name){
    this.type = "leaf"
    this.name = name
  }

  getVariable(data){
    if (!this.variable) return
    const variable = this.variable
    const matches = variable.match(constants.VARIABLE_REGEX)

    if (matches) {
      return (matches[4] || matches[2]) ? data : data[matches[3] || matches[1]]
    } else {
      console.error("Invalid variable:", variable)
    }
  }
}

export class Node extends Leaf {
  constructor(name, variable){
    super(name)
    this.type = "node"
    this.variable = variable
    this.children = []
  }

  addChild(child){
    this.children.push(child)
  }
}

export class NodeCollection {
  constructor(node){
    this.nodes = [].concat(node)
  }

  parent(){
    const nodes = this.nodes
    return nodes[nodes.length - 2]
  }

  last(){
    const nodes = this.nodes
    return nodes[nodes.length - 1]
  }

  append(node){
    this.nodes.push(node)
  }

  pop(){
    return this.nodes.pop()
  }
}

export class RootNode extends Node {
  constructor(){
    super("root", null)
  }

  compile(data){
    if (!data) return ""
    return this.children.reduce((acc, child) => acc.concat(child.compile(data)), []).join('')
  }
}

export class ConditionNode extends Node {
  constructor(variable){
    super(constants.CONDITION, variable)
  }

  compile(data){
    if (!this.getVariable(data)) return ""
    return this.children.reduce((acc, child) => acc.concat(child.compile(data)), []).join('')
  }
}

export class LoopNode extends Node {
  constructor(variable){
    super(constants.LOOP, variable)
  }

  compileItem(item) {
    return this.children.reduce((acc, child) => acc.concat(child.compile(item)), []).join('')
  }

  compile(data){
    const items = this.getVariable(data)
    if (!items || !items.length || !this.children.length) return ""
    return items.reduce((acc, item) => acc.concat(this.compileItem(item)), []).join('')
  }
}

export class TextLeaf extends Leaf {
  constructor(text){
    super(constants.TEXT)
    this.text = text
  }

  compile(){
    return this.text
  }
}

export class VariableLeaf extends Leaf {
  constructor(variable){
    super(constants.VARIABLE)
    this.variable = variable
  }

  compile(data){
    return this.getVariable(data)
  }
}
