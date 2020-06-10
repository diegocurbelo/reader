import entries from './entries'

export const types = {
  UPDATE: 'feeds/update',
  SET_CURRENT: 'feeds/set_current',

  ADD_REQUEST: 'feeds/ADD_REQUEST',
  ADD_SUCCESS: 'feeds/ADD_SUCCESS',
  ADD_FAILURE: 'feeds/ADD_FAILURE',
  REMOVE_REQUEST: 'feeds/REMOVE_REQUEST',
  REMOVE_SUCCESS: 'feeds/REMOVE_SUCCESS',
  REMOVE_FAILURE: 'feeds/REMOVE_FAILURE',
  
  IMPORT_REQUEST: 'feeds/IMPORT_REQUEST',
  IMPORT_SUCCESS: 'feeds/IMPORT_SUCCESS',
  IMPORT_FAILURE: 'feeds/IMPORT_FAILURE',
  IMPORT_RESET: 'feeds/IMPORT_RESET',
}

// --

export const INITIAL_STATE = {
  loading: true,
  items: [],
  current: null,
  feedsToImport: []
}

export const reducer = (state = INITIAL_STATE, action = {}) => {
  switch (action.type) {
    case types.UPDATE:
      return { ...state, loading: false, items: action.items }

    case types.SET_CURRENT:
      return { ...state, current: Number(action.feedId) }

    case entries.types.MARK_AS_READ_REQUEST:
      return { ...state, items: state.items.map(f => feedReducer(f, action)) }

    case entries.types.CATCH_UP_SUCCESS:
      return { ...state, items: state.items.map(f => f.id !== action.feedId ? f : { ...f, unread_count: action.unread_count }) }

    case types.ADD_SUCCESS:
      return { ...state, loading: false, items: addAndSortArray(state.items, action.feed) }

    case types.REMOVE_SUCCESS:
      return { ...state, loading: false, items: state.items.filter(f => f.id !== action.feedId) }

    case types.IMPORT_RESET:
      return { ...state, feedsToImport: [] }

    case types.IMPORT_REQUEST:
      return { ...state, feedsToImport: action.feeds.map(f => ({ ...f, status: null })) }

    case types.IMPORT_SUCCESS:
    case types.IMPORT_FAILURE:
      return { ...state, feedsToImport: state.feedsToImport.map(f => importReducer(f, action)) }

    default:
      return state
  }
}

// --

export const actions = {
  setCurrentFeed: (id) => ({
    type: types.SET_CURRENT,
    feedId: id
  }),
  addFeed: (feedUrl) => ({
    type: types.ADD_REQUEST,
    feedUrl: feedUrl
  }),
  removeFeed: (feedId) => ({
    type: types.REMOVE_REQUEST,
    feedId: feedId
  }),
  importReset: () => ({
    type: types.IMPORT_RESET
  }),
  importFeeds: (feeds) => ({
    type: types.IMPORT_REQUEST,
    feeds: feeds
  }),
}

// --

export const selectors = {
  isLoading: (state) => state.feeds.loading,
  unreadFeeds: (state) => state.feeds.items.filter(f => f.unread_count > 0),
  getCurrentFeed: (state) => {
    const feed = state.feeds.items.filter(f => f.id === state.feeds.current);
    return (feed && feed.constructor === Array) ? feed[0] : null;
  },
  getImportFeedsStatus: (state) => ({
    progress: state.feeds.feedsToImport.filter(f => f.status !== null).length * 100 / state.feeds.feedsToImport.length,
    errors: state.feeds.feedsToImport.filter(f => f.status !== 'ok' && f.status !== null),
  }),
}

// -- 

export default {
  types,
  reducer,
  actions,
  selectors,
}

// --

const addAndSortArray = (arr, val) => {
  arr.push(val);
  for (let i = arr.length - 1; i > 0 && arr[i].title < arr[i-1].title; i--) {
      var tmp = arr[i];
      arr[i] = arr[i-1];
      arr[i-1] = tmp;
  }
  return arr;
}

const feedReducer = (feed, action) => {
  if (feed.id !== action.feedId) {
    return feed;
  }
  return { ...feed, unread_count: feed.unread_count - 1 }
}

const importReducer = (feed, action) => {
  if (feed.url === action.feedUrl) {
    if (action.code) {
      return { ...feed, status: action.code }
    }
    return { ...feed, status: 'ok' }
  }
  return feed;
}