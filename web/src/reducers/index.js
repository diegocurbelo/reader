import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import session from './session'
import feeds from './feeds'
import entries from './entries'
import form from './form'
import notifications from './notifications'

const reducer = combineReducers({
  router: routerReducer,
  session: session.reducer,
  feeds: feeds.reducer,
  entries: entries.reducer,
  form: form.reducer,
  notifications: notifications.reducer
});

export default function (state, action) {
  if (action.type === session.types.LOGOUT) {
    return reducer(undefined, action);
  }
  return reducer(state, action);
}
