import * as constants from '../constants'
import * as nodes from './nodes'

export default (tokens) => {
  const root = new nodes.RootNode
  const collection = new nodes.NodeCollection(root)
  let index = 0

  while(index < tokens.length){
    const token = tokens[index++]

    switch (token.type) {
      case constants.CONDITION_START_TOKEN:
        collection.append(new nodes.ConditionNode(token.variable))
        break
      case constants.CONDITION_END_TOKEN:
        collection.parent().addChild(collection.pop())
        break
      case constants.LOOP_START_TOKEN:
        collection.append(new nodes.LoopNode(token.variable))
        break
      case constants.LOOP_END_TOKEN:
        collection.parent().addChild(collection.pop())
        break
      case constants.VARIABLE_TOKEN:
        collection.last().addChild(new nodes.VariableLeaf(token.variable))
        break
      case constants.TEXT_TOKEN:
        collection.last().addChild(new nodes.TextLeaf(token.text))
        break
      default: break
    }
  }

  return root
}