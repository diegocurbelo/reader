import React from 'react'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/lib/Button'
import Checkbox from 'pages/_common/Checkbox'
import Dropdown from 'react-bootstrap/lib/Dropdown'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Waypoint from 'react-waypoint'
import Scrollable from 'pages/_common/Scrollable';
import Header from 'components/Header'
import Loading from 'components/Loading'
import EntryDetail from './EntryDetail'
import LoadingMoreEntries from './LoadingMoreEntries'
import NoEntries from './NoEntries'
import Modal from 'react-bootstrap/lib/Modal'
import feeds from 'reducers/feeds'
import entries from 'reducers/entries'


class FeedDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      keepLastItemsUnread: true,
      activeEntryIndex: 0
    }
  }

  componentWillMount() {
    this.props.dispatch(feeds.actions.setCurrentFeed(this.props.match.params.id));
    this.props.dispatch(entries.actions.loadEntries(this.props.match.params.id));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      this.props.dispatch(feeds.actions.setCurrentFeed(nextProps.match.params.id));
      this.props.dispatch(entries.actions.loadEntries(nextProps.match.params.id));
    }
  }

  render() {
    const { feed, entries } = this.props;
    const progress = !feed ? 0 : this.state.activeEntryIndex * 100 / entries.items.length;

    return (
      <div>
        <Header title={feed ? feed.title : 'Loading...'} showSidebar={this.props.showSidebar} progress={progress}>
          <Dropdown.Menu>
            <MenuItem disabled>Edit feed</MenuItem>
            <MenuItem divider />
            <MenuItem onClick={this._showModal}>Mark all as read</MenuItem>
          </Dropdown.Menu>
        </Header>
        <Scrollable>
          { !feed || this.props.match.params.id !== String(feed.id) || (entries.items.length === 0 && entries.loading)
            ? <Loading />
            : this.renderEntryList() }
        </Scrollable>

        <Modal show={this.state.showModal} onHide={this._hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Catch up</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            { this.props.feed
              ? <span>
                  <p>Are you sure you want to catch up with feed <strong>{this.props.feed.title}</strong>?</p>
                  { this.props.feed && this.props.feed.unread_count > 10
                    ? <span>
                        <p>Doing this will mark {this.props.feed.unread_count - (this.state.keepLastItemsUnread ? 10 : 0)} entries as read.</p>
                        <br/>
                        <Checkbox
                          name='keepLastItemsUnread'
                          title='Keep the last 10 items as unread'
                          checked={this.state.keepLastItemsUnread}
                          onChange={(e) => this.setState({ keepLastItemsUnread: e.target.checked })}
                        />
                      </span>
                    : null }
                </span>
              : null }
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this._hideModal}>Cancel</Button>
            <Button bsStyle="success" onClick={this._handleModalConfirmation}>Yes, catch up</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }

  // --

  renderEntryList = () => {
    const { feed, entries } = this.props;
    let unreadItems = 0;

    const content = entries.items.map((entry, index) => {
      if (!entry.read) {
        unreadItems ++;
      }

      return (
        <div key={entry.id}>
          <Waypoint
            onEnter={(direction) => { this._entryOnEnter(direction, index, feed.id, entry) }}
            onLeave={(direction) => { this._entryOnLeave(direction, index, feed.id, entry) }} />
          <EntryDetail entry={entry} />
        </div>
      )
    });

    return (
      <div>
        { content }
        { entries.loading
          ? <LoadingMoreEntries />
          : unreadItems >= feed.unread_count
            ? <NoEntries />
            : null }
      </div>
    )
  };

  // --

  _handleSidebarToggleClick = (e) => {
    e.preventDefault();
    this.props.showSidebar(true);
  };

  _entryOnEnter = (direction, index, feedId, entry) => {
    const { previousPosition } = direction;
    if (previousPosition === 'above') {
      this.setState({ activeEntryIndex: index });
    }
  };

  _entryOnLeave = (direction, index, feedId, entry) => {
    const { currentPosition } = direction;
    if (currentPosition === 'above') {
      this.setState({ activeEntryIndex: index + 1 });
      if (!entry.read) {
        this.props.dispatch(entries.actions.markEntryAsRead(feedId, entry.id));
      }
    }
  };

  _showModal = (e) => {
    this.setState({ showModal: true });
  };

  _hideModal = () => {
    this.setState({ showModal: false, keepLastItemsUnread: true });
  };

  _handleModalConfirmation = () => {
    const keepItemsUnread = this.state.keepLastItemsUnread && this.props.feed.unread_count > 10;
    this._hideModal();
    this.props.dispatch(entries.actions.catchUp(this.props.feed.id, keepItemsUnread));
  };
}

const mapStateToProps = (state, { params }) => ({
  feed: feeds.selectors.getCurrentFeed(state),
  entries: state.entries,
});

export default connect(mapStateToProps)(FeedDetail);
