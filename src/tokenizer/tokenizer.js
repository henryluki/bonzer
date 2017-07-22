import * as constants from '../constants'
import {
  getIndexOf,
  getInlineStr,
  getSubstring,
  getStatementIndexEnd,
  getVariableIndexEnd
} from './utils'

export const tokenizeConditionStart = (tpl, tokens) => {
  const indexEnd = getStatementIndexEnd(tpl)
  const variable = getInlineStr(tpl, constants.CONDITION_START, indexEnd)

  tokens.push({
    type: constants.CONDITION_START_TOKEN,
    variable
  })
  return getSubstring(tpl, indexEnd + constants.STATEMENT_END_LENGTH)
}

export const tokenizeConditionEnd = (tpl, tokens) => {
  tokens.push({
    type: constants.CONDITION_END_TOKEN,
  })
  return getSubstring(tpl, getStatementIndexEnd(tpl) + constants.STATEMENT_END_LENGTH)
}

export const tokenizeVariableStart = (tpl, tokens) => {
  const indexEnd = getVariableIndexEnd(tpl)
  const variable = getInlineStr(tpl, constants.VARIABLE_START, indexEnd)

  tokens.push({
    type: constants.VARIABLE_TOKEN,
    variable
  })
  return getSubstring(tpl, indexEnd + constants.VARIABLE_END_LENGTH)
}

export const tokenizeLoopStart = (tpl, tokens) => {
  const indexEnd = getStatementIndexEnd(tpl)
  const variable = getInlineStr(tpl, constants.LOOP_START, indexEnd)

  tokens.push({
    type: constants.LOOP_START_TOKEN,
    variable
  })
  return getSubstring(tpl, indexEnd + constants.STATEMENT_END_LENGTH)
}

export const tokenizeLoopEnd = (tpl, tokens) => {
  tokens.push({
    type: constants.LOOP_END_TOKEN,
  })
  return getSubstring(tpl, getStatementIndexEnd(tpl) + constants.STATEMENT_END_LENGTH)
}

export const tokenizeText = (tpl, tokens) => {
  const index = getIndexOf(tpl, constants.STATEMENT_START)
  const text = index < 0 ? tpl : getSubstring(tpl, 0, index)

  tokens.push({
    type: constants.TEXT_TOKEN,
    text
  })
  return index < 0 ? "" : getSubstring(tpl, index)
}