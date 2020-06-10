import { put, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import feeds from 'reducers/feeds'
import entries from 'reducers/entries'

export function * handleChannelMessage({ event, payload }) {
  if (event === 'phx_reply') {
    const { event, params, data } = payload.response
    switch (event) {
      case 'ok': // join response
      case 'feeds':
        yield put({ type: feeds.types.UPDATE, items: payload.response.feeds })    
        break;

      case 'add_feed':
        // const { data } = yield call(API.feeds.subscribe, feedUrl);
        if (!data.error) {
          yield put({ type: feeds.types.ADD_SUCCESS, feed: data });
          yield put(push({
            pathname: `/feeds/${data.id}`,
            // message: data.message
          }));

        } else {
          yield put({ type: feeds.types.ADD_FAILURE, code: data.error, message: data.message });
        }
        break;

      case 'remove_feed':
        yield put({ type: feeds.types.REMOVE_SUCCESS, feedId: params.feedId });
        break;

      case 'import_feed':
        if (!data.error) {
          yield put({ type: feeds.types.IMPORT_SUCCESS, feedUrl: params.feed_url });
        } else {
          yield put({ type: feeds.types.IMPORT_FAILURE, feedUrl: params.feed_url, code: data.error });
        }
        break;  

      case 'entries':
        yield put({ type: entries.types.FETCH_SUCCESS, items: payload.response.entries })
        break;

      case 'read_entry':
        yield put({ type: entries.types.MARK_AS_READ_SUCCESS });
        yield put({ type: entries.types.FETCH_SUCCESS, items: payload.response.entries })
        break;

      case 'catch_up':
        const feedId = yield select((state) => state.feeds.current)
        yield put({ type: entries.types.CATCH_UP_SUCCESS, feedId, unread_count: payload.response.entries.length });
        yield put({ type: entries.types.FETCH_SUCCESS, items: payload.response.entries })
        break;

      default:
        console.log('> handleChannelMessage', payload.response.event)
    }

  } else if (event === 'update') {
    yield put({ type: feeds.types.UPDATE, payload })
  
  } else {
    console.error('> Unhandler WS response', event, payload)
  }
}
