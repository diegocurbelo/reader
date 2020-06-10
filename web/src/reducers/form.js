import feeds from './feeds'

export const types = {
  RESET: 'form/RESET',
}

// --

export const INITIAL_STATE = {
  submitting: false,
  code: null,
  message: null,
}

// Reducer
export const reducer = (state = INITIAL_STATE, action = {}) => {
  switch (action.type) {
    case types.RESET:
      return INITIAL_STATE

    case feeds.types.ADD_REQUEST:
      return { ...state, submitting: true }

    case feeds.types.ADD_SUCCESS:
    case feeds.types.ADD_FAILURE:
      return { ...state, submitting: false, code: action.code, message: action.message }

    default:
      return state
  }
}

// Action creators
export const actions = {
  resetForm: () => ({
    type: types.RESET
  }),
}

// Selectors
export const selectors = {
}

// -- 

export default {
  types,
  reducer,
  actions,
  selectors,
}