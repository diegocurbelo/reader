import { all, call, select, takeLatest } from 'redux-saga/effects'
import feeds from 'reducers/feeds'
import * as WS from 'services/socket'


const sagas = [
  takeLatest(feeds.types.ADD_REQUEST, addFeed),
  takeLatest(feeds.types.REMOVE_REQUEST, removeFeed),
  takeLatest(feeds.types.IMPORT_REQUEST, importFeeds),
];
export default sagas;


function * addFeed({ feedUrl }) {
  const channel = yield select((state) => state.session.channel)
  yield call(WS.send, channel, 'add_feed', { feedUrl })
}

function * removeFeed({ feedId }) {
  const channel = yield select((state) => state.session.channel)
  yield call(WS.send, channel, 'remove_feed', { feedId })
}

function * importFeeds({ feeds }) {
  const channel = yield select((state) => state.session.channel)
  yield all(feeds.map(function * (feed) {
  	yield call(WS.send, channel, 'import_feed', { feed_url: feed.url })
  }))
}
