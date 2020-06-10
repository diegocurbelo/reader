export const types = {
  ADD_NOTIFICATION: 'notifications/add',
  REMOVE_NOTIFICATION: 'notifications/remove'
}

// --

export const INITIAL_STATE = {
  items: []
}

export const reducer = (state = INITIAL_STATE, action = {}) => {
  switch (action.type) {
    case types.ADD_NOTIFICATION:
      return { ...state, items: [ ...state.items, { id: action.notificationId, text: action.notificationBody } ] }

    case types.REMOVE_NOTIFICATION:
        return { ...state, items: state.items.filter(n => n.id !== action.notificationId) }

    default:
      return state
  }
}

// --

export const actions = {
  addNotification: (id, text) => ({
    type: types.ADD_NOTIFICATION,
    notificationId: id,
    notificationBody: text
  }),
  removeNotification: (id) => ({
    type: types.REMOVE_NOTIFICATION,
    notificationId: id
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
