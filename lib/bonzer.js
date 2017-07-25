'use strict';

// global
const GLOBAL_DATA_NAME = "data";
const LOOP_DATA_NAME = "item";

// types
const VARIABLE = "variable";
const TEXT = "text";
const CONDITION = "condition";
const LOOP = "loop";

// token
const CONDITION_START_TOKEN = "CONDITION_START";
const CONDITION_END_TOKEN = "CONDITION_END";
const LOOP_START_TOKEN = "LOOP_START";
const LOOP_END_TOKEN = "LOOP_END";
const VARIABLE_TOKEN = "VARIABLE";
const TEXT_TOKEN = "TEXT";

// syntax
const CONDITION_START = "{if";
const CONDITION_END = "{/if";
const VARIABLE_START =  "{{";
const VARIABLE_END = "}}";
const LOOP_START = "{each";
const LOOP_END = "{/each";
const STATEMENT_START = "{";
const STATEMENT_END = "}";

const STATEMENT_END_LENGTH = STATEMENT_END.length;
const VARIABLE_END_LENGTH = VARIABLE_END.length;

// regex
const GLOBAL_DATA_REGEX = `^${GLOBAL_DATA_NAME}\.([-A-Za-z0-9_]+)|(${GLOBAL_DATA_NAME})`;
const LOOP_DATA_REGEX = `^${LOOP_DATA_NAME}\.([-A-Za-z0-9_]+)|(${LOOP_DATA_NAME})`;

const VARIABLE_REGEX = new RegExp(`${GLOBAL_DATA_REGEX}|${LOOP_DATA_REGEX}`, 'i');

class Leaf {
  constructor(name){
    this.type = "leaf";
    this.name = name;
  }

  getVariable(data){
    if (!this.variable) return
    const variable = this.variable;
    const matches = variable.match(VARIABLE_REGEX);

    if (matches) {
      return (matches[4] || matches[2]) ? data : data[matches[3] || matches[1]]
    } else {
      console.error("Invalid variable:", variable);
    }
  }
}

class Node extends Leaf {
  constructor(name, variable){
    super(name);
    this.type = "node";
    this.variable = variable;
    this.children = [];
  }

  addChild(child){
    this.children.push(child);
  }
}

class NodeCollection {
  constructor(node){
    this.nodes = [].concat(node);
  }

  parent(){
    const nodes = this.nodes;
    return nodes[nodes.length - 2]
  }

  last(){
    const nodes = this.nodes;
    return nodes[nodes.length - 1]
  }

  append(node){
    this.nodes.push(node);
  }

  pop(){
    return this.nodes.pop()
  }
}

class RootNode extends Node {
  constructor(){
    super("root", null);
  }

  compile(data){
    if (!data) return ""
    return this.children.reduce((acc, child) => acc.concat(child.compile(data)), []).join('')
  }
}

class ConditionNode extends Node {
  constructor(variable){
    super(CONDITION, variable);
  }

  compile(data){
    if (!this.getVariable(data)) return ""
    return this.children.reduce((acc, child) => acc.concat(child.compile(data)), []).join('')
  }
}

class LoopNode extends Node {
  constructor(variable){
    super(LOOP, variable);
  }

  compileItem(item) {
    return this.children.reduce((acc, child) => acc.concat(child.compile(item)), []).join('')
  }

  compile(data){
    const items = this.getVariable(data);
    if (!items || !items.length || !this.children.length) return ""
    return items.reduce((acc, item) => acc.concat(this.compileItem(item)), []).join('')
  }
}

class TextLeaf extends Leaf {
  constructor(text){
    super(TEXT);
    this.text = text;
  }

  compile(){
    return this.text
  }
}

class VariableLeaf extends Leaf {
  constructor(variable){
    super(VARIABLE);
    this.variable = variable;
  }

  compile(data){
    return this.getVariable(data)
  }
}

var parse = (tokens) => {
  const root = new RootNode;
  const collection = new NodeCollection(root);
  let index = 0;

  while(index < tokens.length){
    const token = tokens[index++];

    switch (token.type) {
      case CONDITION_START_TOKEN:
        collection.append(new ConditionNode(token.variable));
        break
      case CONDITION_END_TOKEN:
        collection.parent().addChild(collection.pop());
        break
      case LOOP_START_TOKEN:
        collection.append(new LoopNode(token.variable));
        break
      case LOOP_END_TOKEN:
        collection.parent().addChild(collection.pop());
        break
      case VARIABLE_TOKEN:
        collection.last().addChild(new VariableLeaf(token.variable));
        break
      case TEXT_TOKEN:
        collection.last().addChild(new TextLeaf(token.text));
        break
      default: break
    }
  }

  return root
};

const getIndexOf = (str, target) => str.indexOf(target);

const isStartWith = (str, target) => getIndexOf(str, target) === 0;

const getInlineStr = (str, type, indexEnd) => str.slice(type.length, indexEnd).trim();

const getSubstring = (str, indexStart, indexEnd) => indexEnd !== undefined ? str.substring(indexStart, indexEnd) : str.substring(indexStart);

const getStatementIndexEnd = (tpl) => getIndexOf(tpl, STATEMENT_END);

const getVariableIndexEnd = (tpl) => getIndexOf(tpl, VARIABLE_END);

const tokenizeConditionStart = (tpl, tokens) => {
  const indexEnd = getStatementIndexEnd(tpl);
  const variable = getInlineStr(tpl, CONDITION_START, indexEnd);

  tokens.push({
    type: CONDITION_START_TOKEN,
    variable
  });
  return getSubstring(tpl, indexEnd + STATEMENT_END_LENGTH)
};

const tokenizeConditionEnd = (tpl, tokens) => {
  tokens.push({
    type: CONDITION_END_TOKEN,
  });
  return getSubstring(tpl, getStatementIndexEnd(tpl) + STATEMENT_END_LENGTH)
};

const tokenizeVariableStart = (tpl, tokens) => {
  const indexEnd = getVariableIndexEnd(tpl);
  const variable = getInlineStr(tpl, VARIABLE_START, indexEnd);

  tokens.push({
    type: VARIABLE_TOKEN,
    variable
  });
  return getSubstring(tpl, indexEnd + VARIABLE_END_LENGTH)
};

const tokenizeLoopStart = (tpl, tokens) => {
  const indexEnd = getStatementIndexEnd(tpl);
  const variable = getInlineStr(tpl, LOOP_START, indexEnd);

  tokens.push({
    type: LOOP_START_TOKEN,
    variable
  });
  return getSubstring(tpl, indexEnd + STATEMENT_END_LENGTH)
};

const tokenizeLoopEnd = (tpl, tokens) => {
  tokens.push({
    type: LOOP_END_TOKEN,
  });
  return getSubstring(tpl, getStatementIndexEnd(tpl) + STATEMENT_END_LENGTH)
};

const tokenizeText = (tpl, tokens) => {
  const index = getIndexOf(tpl, STATEMENT_START);
  const text = index < 0 ? tpl : getSubstring(tpl, 0, index);

  tokens.push({
    type: TEXT_TOKEN,
    text
  });
  return index < 0 ? "" : getSubstring(tpl, index)
};

var tokenize = (tpl) => {
  const tokens = [];

  while (tpl) {
    if (isStartWith(tpl, CONDITION_START)) {
      tpl = tokenizeConditionStart(tpl, tokens);
      continue
    }
    if (isStartWith(tpl, CONDITION_END)) {
      tpl = tokenizeConditionEnd(tpl, tokens);
      continue
    }
    if (isStartWith(tpl, VARIABLE_START)) {
      tpl = tokenizeVariableStart(tpl, tokens);
      continue
    }
    if (isStartWith(tpl, LOOP_START)) {
      tpl = tokenizeLoopStart(tpl, tokens);
      continue
    }
    if (isStartWith(tpl, LOOP_END)) {
      tpl = tokenizeLoopEnd(tpl, tokens);
      continue
    }
    tpl = tokenizeText(tpl, tokens);
  }

  return tokens
};

const compile = (astTree, data) => astTree.compile(data);

var index = (tpl) => {
  const tokens = tokenize(tpl);
  const astTree = parse(tokens);

  return {
    render: (data) => compile(astTree, data)
  }
};

module.exports = index;
