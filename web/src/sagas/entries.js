import { call, select, takeEvery, takeLatest } from 'redux-saga/effects'
import entries from 'reducers/entries'
import * as WS from 'services/socket'


const sagas = [
  takeLatest(entries.types.FETCH_REQUEST, loadEntries),
  takeEvery(entries.types.MARK_AS_READ_REQUEST, markEntryAsRead),
  takeEvery(entries.types.CATCH_UP_REQUEST, catchUp),
];
export default sagas;


function * loadEntries({ feedId }) {
  const channel = yield select((state) => state.session.channel)
  yield call(WS.send, channel, 'entries', { feedId })
}

function * markEntryAsRead({ feedId, entryId }) {
  const channel = yield select((state) => state.session.channel)
  yield call(WS.send, channel, 'read_entry', { feedId, entryId })
}

function * catchUp({ feedId, keep }) {
  const channel = yield select((state) => state.session.channel)
  yield call(WS.send, channel, 'catch_up', { feedId, keep: keep ? 10 : 0 })
}
