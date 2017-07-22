import * as constants from '../constants'

export const getIndexOf = (str, target) => str.indexOf(target)

export const isStartWith = (str, target) => getIndexOf(str, target) === 0

export const getInlineStr = (str, type, indexEnd) => str.slice(type.length, indexEnd).trim()

export const getSubstring = (str, indexStart, indexEnd) => indexEnd !== undefined ? str.substring(indexStart, indexEnd) : str.substring(indexStart)

export const getStatementIndexEnd = (tpl) => getIndexOf(tpl, constants.STATEMENT_END)

export const getVariableIndexEnd = (tpl) => getIndexOf(tpl, constants.VARIABLE_END)

