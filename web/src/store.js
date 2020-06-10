import { createStore, compose, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createBrowserHistory from 'history/createBrowserHistory'
import createHashHistory from 'history/createHashHistory'
import createSagaMiddleware, { END } from 'redux-saga'
// import throttle from 'lodash/throttle'

import reducers from './reducers'
import rootSaga from './sagas'

// import * as API from 'middleware/api'
import session from 'reducers/session'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const history = window.cordova ? createHashHistory() : createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const middleware = [routerMiddleware(history), sagaMiddleware]

const createStoreWithMiddleware = () => {
  if (process.env.NODE_ENV === 'production') {
    return createStore(reducers, {}, applyMiddleware(...middleware))
  }
  return createStore(reducers, {}, composeEnhancers(applyMiddleware(...middleware)))
}

const store = createStoreWithMiddleware()

// export function configureStore() {
//   if (process.env.NODE_ENV === 'production') {
//     return createStore(
//       reducers,
//       loadState(),
//       applyMiddleware(...middleware)
//     );
//   }

//   return createStore(
//     reducers,
//     loadState(),
//     composeEnhancers(applyMiddleware(...middleware))
//   );
// };
// const store = configureStore();

	// const middleware = [routerMiddleware(history)];
	// const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);
	// const store = createStoreWithMiddleware(reducers);


// store.subscribe(throttle(() => {
//   saveState(store.getState())
// }, 1000));

sagaMiddleware.run(rootSaga).done.catch((e) => {
  console.error('[Run Root Saga]', e.message)
})
store.close = () => store.dispatch(END);

export { store, history }

const loadState = () => {
  try {
    const data = localStorage.getItem('reader.uy-state');
    if (data === null || data === undefined) {
      return undefined;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading state from local storage.');
    return undefined;
  }
}

export const saveState = (state) => {
  try {
    const data = JSON.stringify(state);
    localStorage.setItem('reader.uy-state', data);
  } catch (err) {
    console.error('Error saving state to local storage', err);
  }
}

// Restore use session, and reconnect to server channel
const state = loadState()
if (state) {
  store.dispatch(session.actions.connect(state));
}
