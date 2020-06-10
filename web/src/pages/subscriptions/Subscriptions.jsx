import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Dropdown from 'react-bootstrap/lib/Dropdown'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Modal from 'react-bootstrap/lib/Modal'
import ListGroup from 'react-bootstrap/lib/ListGroup'
import Header from 'components/Header'
import './Subscriptions.css'
import { actions } from 'reducers/feeds'
import Scrollable from 'pages/_common/Scrollable'

class Subscriptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unsubscribeModal: {
        show: false,
        id: null,
        title: null,
      }
    }
  }

  render() {
    const { feeds } = this.props;
    return (
      <div>
        <Header title="Subscriptions" showSidebar={this.props.showSidebar}>
          <Dropdown.Menu>
            <MenuItem onClick={this._handleAddFeedClick}>Add feed</MenuItem>
            <MenuItem divider />
            <MenuItem onClick={this._handleImportFeedsClick}>Import feeds</MenuItem>
            <MenuItem disabled>Export feeds</MenuItem>
          </Dropdown.Menu>
        </Header>
        <Scrollable className="Subscriptions">
          { feeds.length === 0
            ? <div className="centered">
                <div className="options">
                  <p>You can subscribe to your first feed using this button</p>
                  <br/>
                  <ButtonGroup>
                    <Button bsStyle="primary" onClick={this._handleAddFeedClick}>Add feed</Button>
                  </ButtonGroup>
                  <div className="spacer"/>
                  <p>If you are moving from another rss/feed reader, you can also upload your subscriptions in standard OPML format</p>
                  <br/>
                  <ButtonGroup>
                    <Button bsStyle="success" onClick={this._handleImportFeedsClick}>Import feeds</Button>
                  </ButtonGroup>
                </div>
              </div>
            : null }
          <ListGroup>
            { feeds.map((feed) =>
              <li key={feed.id} className="list-group-item">
                <h4 className="list-group-item-heading">
                  <NavLink key={feed.id} to={`/feeds/${feed.id}`}>
                    {feed.title}
                  </NavLink>
                </h4>
                <p className="list-group-item-text"><a href={feed.feed_url} target="_blank" rel="noopener noreferrer">{feed.feed_url}</a></p>
                <ButtonGroup>
                  <Button bsStyle="danger" onClick={() => this._showUnsubscribeModal(feed)}><Glyphicon glyph="trash" /></Button>
                </ButtonGroup>
              </li>
            )}
          </ListGroup>
        </Scrollable>


        <Modal show={this.state.unsubscribeModal.show} onHide={this._hideUnsubscribeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Unsubscribe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to unsubscribe from the feed <strong>{this.state.unsubscribeModal.title}</strong>?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this._hideUnsubscribeModal}>Cancel</Button>
            <Button bsStyle="danger" onClick={this._handleUnsubscribeConfirmation}>Yes, unsubscribe</Button>
          </Modal.Footer>
        </Modal>

      </div>
    )
  }

  // --

  _handleAddFeedClick = () => {
    this.props.history.push("/subscriptions/new");
  };

  _handleImportFeedsClick = () => {
    this.props.history.push("/subscriptions/import");
  };

  _showUnsubscribeModal = (feed) => {
    this.setState({
      unsubscribeModal: {
        show: true,
        id: feed.id,
        title: feed.title,
      }
    });
  };

  _hideUnsubscribeModal = () => {
    this.setState({
      unsubscribeModal: {
        show: false,
        id: null,
        title: null,
      }
    });
  };

  _handleUnsubscribeConfirmation = () => {
    this.props.dispatch(actions.removeFeed(this.state.unsubscribeModal.id));
    this._hideUnsubscribeModal();
  };

}

const mapStateToProps = (state) => ({
  feeds: state.feeds.items
});

export default connect(mapStateToProps)(Subscriptions);