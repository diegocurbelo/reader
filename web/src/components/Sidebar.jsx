import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import Badge from 'react-bootstrap/lib/Badge'
import Dropdown from 'react-bootstrap/lib/Dropdown'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import Scrollable from 'pages/_common/Scrollable'
import Image from 'react-bootstrap/lib/Image'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Navbar from 'react-bootstrap/lib/Navbar'
import Loading from './Loading'
import { actions as sessionActions } from 'reducers/session'
import { selectors as feedsSelectors } from 'reducers/feeds'
import './Sidebar.css';
import logo from 'logo.svg'

class Sidebar extends React.Component {

  render() {
    const { session, loading, feeds } = this.props;
    return (
      <div className="Sidebar">
        <Navbar collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <img src={logo} alt="reader"/>
            </Navbar.Brand>
            <Dropdown id="user-settings-menu" pullRight rootCloseEvent="click">
              <Dropdown.Toggle noCaret>
                <Glyphicon glyph="option-vertical" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <li>
                  <div className="user-info">
                    <Image src={`https://graph.facebook.com/${session.user.facebookId}/picture?type=square&height=48`} circle />
                    <div className="user-info-title">Signed in as</div>
                    <span className="user-info-name">{session.user.name}</span>
                  </div>
                </li>
                <MenuItem divider />
                <MenuItem disabled>Preferences</MenuItem>
                <MenuItem onClick={() => this._handleMenuItemClick('/subscriptions')}>Manage subscriptions</MenuItem>
                <MenuItem divider />
                <MenuItem onClick={this._handleSignOutClick}>Logout</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Header>
        </Navbar>
        <Scrollable>
          <div className="feed-list">
            { !feeds.length && loading
              ? <Loading />
              : <ul>
                  <li>
                    <NavLink exact to={`/feeds`} onClick={this._handleFeedItemClick}>
                      <span className="feed-title">Dashboard</span>
                    </NavLink>
                  </li>
                  {feeds.map((feed) =>
                    <li key={feed.id}>
                      <NavLink key={feed.id} to={`/feeds/${feed.id}`} onClick={this._handleFeedItemClick}>
                        {feed.unread_count ? <Badge>{feed.unread_count}</Badge> : ''}
                        <span className="feed-title">{feed.title}</span>
                      </NavLink>
                    </li>
                  )}
                </ul> }
          </div>
        </Scrollable>
      </div>
    )
  }

  // --

  _handleSignOutClick = (e) => {
    e.preventDefault();
    this.props.dispatch(sessionActions.logout());
  };

  _handleMenuItemClick = (path) => {
    this.props.history.push(path);
    this.props.showSidebar(false);
  };

  _handleFeedItemClick = () => {
    this.props.showSidebar(false);
  }

}

const mapStateToProps = (state) => ({
  session: state.session,
  loading: feedsSelectors.isLoading(state),
  feeds: feedsSelectors.unreadFeeds(state)
});

export default withRouter(connect(mapStateToProps)(Sidebar));
