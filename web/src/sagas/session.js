import { call, fork, put, take, takeLatest } from 'redux-saga/effects'
import { handleChannelMessage } from './ws'
import session from 'reducers/session'
import { saveState } from 'store'
import * as API from 'services/api'
import * as WS from 'services/socket'


const sagas = [
  takeLatest(session.types.LOGIN_REQUEST, handleLoginRequest),
  takeLatest(session.types.LOGOUT, handleLogoutRequest),
  takeLatest(session.types.LOGIN_SUCCESS, handleConnect),
  takeLatest(session.types.CONNECT, handleConnect),
];
export default sagas;

function * handleLoginRequest({ provider, code }) {
  const { data } = yield call(API.login, provider, code);
  yield saveState(data)
  yield put({ type: session.types.LOGIN_SUCCESS, ...data });
}

function * handleLogoutRequest(action) {
  // const channel = yield select((state) => state.session.channel)
  // yield call(WS.leave, channel)
  yield saveState(undefined)
}

function * handleConnect({ token, user }) {
  const socket = yield call(WS.connectToSocket, token);
  const channel = yield call(WS.joinChannel, socket, `user:${user.id}`);

  yield put({ type: session.types.SOCKET_CONNECTED, channel });

  const subscription = yield call(WS.subscribeToChannel, channel);
  while (true) {
    const event = yield take(subscription)
    yield fork(handleChannelMessage, event)
  }
}
