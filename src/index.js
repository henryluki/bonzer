import parse from './parser/index'
import tokenize from './tokenizer/index'

const compile = (astTree, data) => astTree.compile(data)

export default (tpl) => {
  const tokens = tokenize(tpl)
  const astTree = parse(tokens)

  return {
    render: (data) => compile(astTree, data)
  }
}