import * as constants from '../constants'
import * as tokenizer from './tokenizer'
import { isStartWith } from './utils'

export default (tpl) => {
  const tokens = []

  while (tpl) {
    if (isStartWith(tpl, constants.CONDITION_START)) {
      tpl = tokenizer.tokenizeConditionStart(tpl, tokens)
      continue
    }
    if (isStartWith(tpl, constants.CONDITION_END)) {
      tpl = tokenizer.tokenizeConditionEnd(tpl, tokens)
      continue
    }
    if (isStartWith(tpl, constants.VARIABLE_START)) {
      tpl = tokenizer.tokenizeVariableStart(tpl, tokens)
      continue
    }
    if (isStartWith(tpl, constants.LOOP_START)) {
      tpl = tokenizer.tokenizeLoopStart(tpl, tokens)
      continue
    }
    if (isStartWith(tpl, constants.LOOP_END)) {
      tpl = tokenizer.tokenizeLoopEnd(tpl, tokens)
      continue
    }
    tpl = tokenizer.tokenizeText(tpl, tokens)
  }

  return tokens
}