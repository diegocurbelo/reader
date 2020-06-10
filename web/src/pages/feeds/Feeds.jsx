import React from 'react'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Header from 'components/Header'
import Scrollable from 'pages/_common/Scrollable'
import Loading from 'components/Loading'

class Feeds extends React.Component {
  render() {
    const { feeds } = this.props;
    const feedCount = feeds.items.length;
    const unreadEntriesCount = feeds.items.reduce((acc, item) => acc + item.unread_count, 0);

    return (
      <div>
        <Header title="Dashboard" showSidebar={this.props.showSidebar} />
        <Scrollable>
          { !feeds.items.length && feeds.loading
            ? <Loading />
            : <div className="centered">
                { feedCount
                  ? <p>You are subscribed to {feedCount} feeds,<br/> with {unreadEntriesCount} unread entries</p>
                  : <p>You don't have any subscriptions yet</p> }
                <br/>
                <ButtonGroup>
                  <Button bsStyle="primary" onClick={this._handleButtonClick}>Manage subscriptions</Button>
                </ButtonGroup>
              </div> }
        </Scrollable>
      </div>
    )
  }

  // --

  _handleButtonClick = () => {
    this.props.history.push("/subscriptions");
  };

}

const mapStateToProps = (state) => ({
  feeds: state.feeds
});

export default connect(mapStateToProps)(Feeds);