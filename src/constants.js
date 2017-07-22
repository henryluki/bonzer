// global
export const GLOBAL_DATA_NAME = "data"
export const LOOP_DATA_NAME = "item"

// types
export const VARIABLE = "variable"
export const TEXT = "text"
export const CONDITION = "condition"
export const LOOP = "loop"

// token
export const CONDITION_START_TOKEN = "CONDITION_START"
export const CONDITION_END_TOKEN = "CONDITION_END"
export const LOOP_START_TOKEN = "LOOP_START"
export const LOOP_END_TOKEN = "LOOP_END"
export const VARIABLE_TOKEN = "VARIABLE"
export const TEXT_TOKEN = "TEXT"

// syntax
export const CONDITION_START = "{if"
export const CONDITION_END = "{/if"
export const VARIABLE_START =  "{{"
export const VARIABLE_END = "}}"
export const LOOP_START = "{each"
export const LOOP_END = "{/each"
export const STATEMENT_START = "{"
export const STATEMENT_END = "}"

export const STATEMENT_END_LENGTH = STATEMENT_END.length
export const VARIABLE_END_LENGTH = VARIABLE_END.length

// regex
const GLOBAL_DATA_REGEX = `^${GLOBAL_DATA_NAME}\.([-A-Za-z0-9_]+)|(${GLOBAL_DATA_NAME})`
const LOOP_DATA_REGEX = `^${LOOP_DATA_NAME}\.([-A-Za-z0-9_]+)|(${LOOP_DATA_NAME})`

export const VARIABLE_REGEX = new RegExp(`${GLOBAL_DATA_REGEX}|${LOOP_DATA_REGEX}`, 'i')
