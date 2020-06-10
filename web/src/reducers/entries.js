import { types as feedsTypes } from './feeds'

export const types = {
  FETCH_REQUEST: 'entries/fetch.request',
  FETCH_SUCCESS: 'entries/fetch.success',
  FETCH_FAILURE: 'entries/fetch.failure',
  MARK_AS_READ_REQUEST: 'entries/MARK_AS_READ_REQUEST',
  MARK_AS_READ_SUCCESS: 'entries/MARK_AS_READ_SUCCESS',
  MARK_AS_READ_FAILURE: 'entries/MARK_AS_READ_FAILURE',
  CATCH_UP_REQUEST: 'entries/CATCH_UP_REQUEST',
  CATCH_UP_SUCCESS: 'entries/CATCH_UP_SUCCESS',
  CATCH_UP_FAILURE: 'entries/CATCH_UP_FAILURE',
}

// --

export const INITIAL_STATE = {
  loading: false,
  items: []
}

export const reducer = (state = INITIAL_STATE, action = {}) => {
  switch (action.type) {
    case feedsTypes.SET_CURRENT:
      return { ...state, loading: false, items: [] }

    case types.FETCH_REQUEST:
      return { ...state, loading: true }

    case types.FETCH_SUCCESS:
      return { ...state, loading: false, items: addNewEntries(state.items, action.items) }

    case types.FETCH_FAILURE:
      return { ...state, loading: false, items: [] }

    case types.MARK_AS_READ_REQUEST:
      return { ...state, items: state.items.map(e => e.id === action.entryId ? { ...e, read: true } : e )}

    case types.CATCH_UP_REQUEST:
      return { ...state, loading: true, items: [] }

    case types.CATCH_UP_FAILURE:
      return { ...state, loading: false }

    default:
      return state
  }
}

// --

export const actions = {
  loadEntries: (feedId) => ({
    type: types.FETCH_REQUEST,
    feedId
  }),
  markEntryAsRead: (feedId, entryId) => ({
    type: types.MARK_AS_READ_REQUEST,
    feedId,
    entryId
  }),
  catchUp: (feedId, keep) => ({
    type: types.CATCH_UP_REQUEST,
    feedId,
    keep,
  })
}

// --

export const selectors = {
}

// -- 

export default {
  types,
  reducer,
  actions,
  selectors,
}

// --

const addNewEntries = (entries, newEntries) => {
  if (entries.length === 0) {
    return newEntries;
  }
  const lastEntryId = entries[entries.length-1].id;
  return entries.concat(newEntries.filter((entry) => entry.id > lastEntryId))
}
