import { all, call, put, spawn } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import session from './session'
import feeds from './feeds'
import entries from './entries'
import { types as sessionTypes } from 'reducers/session'
const sagas = [
  ...session,
  ...feeds,
  ...entries,
];

export default function * rootSaga() {
  yield all(sagas.map(saga =>
    spawn(function * () {
      let isSyncError = false;
      let resetSyncError = () => isSyncError = false;
      while (true) {
        isSyncError = true;
        try {
          setTimeout(resetSyncError);
          if (typeof saga === 'object') {
            // Si la saga es un takeLatest, hay que usar una wrapper
            yield call(function * () { yield saga });

          } else {
            yield call(saga);
          }
          console.error("unexpected root saga termination. The root sagas are supposed to be sagas that live during the whole app lifetime!", saga);

        } catch (error) {
          yield call(handleError, error);
        }
        if (isSyncError) {
          // Para evitar que fallas infinitas bloqueen el browser...
          console.error(saga.name, " will NOT be restarted, seems like an infinite loop.");
          yield delay(5000);
        } else {
          console.error(saga.name, " will be restarted after 1 second.");
          yield delay(1000);
        }
      }
    })
  ))
}

// -- Utility functions

export function delay(millis) {
  return new Promise(resolve => {
    setTimeout(() => resolve(true), millis)
  })
}

export function * handleError(error) {
  if (error.response) {
    // The request was made and the server responded, but with a status code of 401
    if (error.response.status === 401) {
      yield put({ type: sessionTypes.SESSION_EXPIRED });
      yield put(push({
        pathname: '/login',
        sessionExpired: true
      }));

    } else {
      console.error('[API Error Handler]:1', error.response.status, error.response.data);
      yield put(push({
        pathname: '/error',
        code: 500,
        reason: error.response.data
      }));
    }

  } else if (error.request) {
    // The request was made but no response was received
    console.error('[API Error Handler]:2', error.request);
    console.dir(error);
    yield put(push({
      pathname: '/error',
      code: 500,
      reason: error.message
    }));

  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('[API Error Handler]:3', error.message);
    yield put(push({
      pathname: '/error',
      code: 500,
      reason: error.message
    }));
  }
}
