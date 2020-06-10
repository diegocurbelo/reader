import React from 'react'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import FormControl from 'react-bootstrap/lib/FormControl'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import HelpBlock from 'react-bootstrap/lib/HelpBlock'
import Header from 'components/Header'
import Loading from 'components/Loading'
import Scrollable from 'pages/_common/Scrollable'
import feeds from 'reducers/feeds'
// import { actions as actionsForm } from 'reducers/form'


class New extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      validation: null,
    }
  }

  componentWillMount() {
    // this.props.dispatch(actionsForm.resetForm());
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      validation: (nextProps.form.code && !nextProps.form.submitting) ? 'error' : null
    });
  }

  componentWillUnmount() {
  }

  render() {
    const { submitting, code } = this.props.form;

    const msgs = {
      invalid_url: "No feeds found at that address",
      feed_already_added: "The user is already subscribed to this feed",
    }

    return (
      <div className="New">
        <Header title="New subscription" showSidebar={this.props.showSidebar} history={this.props.history} onCloseRoute="/subscriptions" />
        <Scrollable>
          <div className="card">
            <form>
              <FormGroup controlId="url" validationState={this.state.validation}>
                <ControlLabel>Enter a webpage or feed URL</ControlLabel>
                <FormControl type="text" value={this.state.url} placeholder="URL" onChange={this._handleChangeFeedUrl} disabled={submitting}/>
                { this.state.validation ? <HelpBlock>{msgs[code]}</HelpBlock> : null }
              </FormGroup>
              <ButtonGroup>
                <Button bsStyle="primary" onClick={this._handleAddClick} disabled={submitting}>
                  { submitting ? <Loading /> : '' }
                  Add feed
                </Button>
              </ButtonGroup>
            </form>
          </div>
        </Scrollable>
      </div>
    )
  }

  // --

  _handleChangeFeedUrl = (e) => {
    this.setState({
      url: e.target.value,
      validation: null
    });
  };

  _handleAddClick = (e) => {
    e.preventDefault();
    this.props.dispatch(feeds.actions.addFeed(this.state.url));
  };

}

const mapStateToProps = (state) => ({
  feeds: state.feeds.items,
  form: state.form
});

export default connect(mapStateToProps)(New);