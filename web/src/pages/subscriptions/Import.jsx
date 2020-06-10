import React from 'react'
import { connect } from 'react-redux'

import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Dropzone from 'react-dropzone'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import Header from 'components/Header'
import Loading from 'components/Loading'
import ProgressBar from 'react-bootstrap/lib/ProgressBar'
import Scrollable from 'pages/_common/Scrollable'
import feeds from 'reducers/feeds'
import './Import.css'

class Import extends React.Component {

  reader = null;

  constructor(props) {
    super(props);
    this.state = {
      importing: false,
      file: null,
      feedsToImport: [],
      showErrorDetail: false
    };
    this.reader = new FileReader();
    this.reader.onerror = (evt) => {
      switch (evt.target.error.code) {
        case evt.target.error.NOT_FOUND_ERR:
          alert('File Not Found!');
          break;
        case evt.target.error.NOT_READABLE_ERR:
          alert('File is not readable');
          break;
        case evt.target.error.ABORT_ERR:
          break; // noop
        default:
          alert('An error occurred reading this file.');
      };
    };
    this.reader.onload = (e) => {
      this.onLoadFile(e.target.result);
    };
  }

  componentWillMount() {
    this.props.dispatch(feeds.actions.importReset());
  }

  render() {
    return (
      <div className="Import">
        <Header
          title="Import subscriptions"
          showSidebar={this.props.showSidebar}
          history={this.props.history}
          onCloseRoute="/subscriptions"
        />
        <Scrollable>
            { this.props.importStatus.progress !== 100
              ? this._renderImportForm()
              : this._renderImportResult() }
        </Scrollable>
      </div>
    )
  }

  // --

  _renderImportForm = () => {
    return (
      <div className="card">
        <Dropzone
          className="file-selector"
          activeClassName="file-selector-active"
          rejectClassName="file-selector-reject"
          disablePreview={true}
          multiple={false}
          maxSize={1024*500}
          accept=" , application/xml, text/xml, text/x-opml, .opml"
          onDrop={this.onDropFile}
        >
          { !this.state.feedsToImport.length
            ? <p>You can drop your OPML file here,<br/> or click to open the file dialog and find it</p>
            : <p>Found <strong>{this.state.feedsToImport.length}</strong> feeds in the file <em>{this.state.title}</em></p> }
        </Dropzone>

        { this.state.importing ? <ProgressBar now={this.props.importStatus.progress} /> : null }

        <form>
          <ButtonGroup>
            <Button bsStyle="success" onClick={this._handleImportClick} disabled={this.state.importing}>
              { this.state.importing ? <Loading /> : '' }
              Import feeds
            </Button>
          </ButtonGroup>
        </form>
      </div>
    )
  };

  _renderImportResult = () => {
    const feedsAlreadyAdded = this.props.importStatus.errors.filter(f => f.status === 'feed_already_added');
    const invalidFeeds = this.props.importStatus.errors.filter(f =>
      f.status === 'invalid_url' ||
      f.status === 'empty_url' ||
      f.status === 'fetch_error' ||
      f.status === 'invalid_xml' ||
      f.status === 'unknown_feed_format'
    );

    return (
      <div className="card result">
        <p>Processing of file <strong>{this.state.title}</strong> completed:</p>

        <div>
          <Glyphicon glyph="ok" className="blue"/>
          <strong>{this.state.feedsToImport.length - this.props.importStatus.errors.length}</strong> feeds were imported
          { feedsAlreadyAdded.length
            ? <span>, and <em>{feedsAlreadyAdded.length}</em> were already there</span>
            : null }
        </div>
        { invalidFeeds.length
          ? <div><Glyphicon glyph="remove" className="red"/><strong>{invalidFeeds.length}</strong> were not valid
              { this.state.showErrorDetail
                ? <ul>{ invalidFeeds.map(f => <li key={f.url}><Glyphicon glyph="chevron-right"/>{f.name || f.url}</li> : null)}</ul>
                : <span> (<a href="#showdetail" onClick={() => this.setState({showErrorDetail: true })}>show details</a>)</span> }
            </div>
          : null }
      </div>
    )
  };

  onDropFile = (accepted, rejected) => {
    if (accepted.length) {
      this.setState({ file: accepted[0] });
      this.reader.readAsText(accepted[0]);
    } else {
      this.setState({ file: null });
    }
  };

  onLoadFile = (content) => {
// // code for IE
// if (window.ActiveXObject) {
//     doc = new ActiveXObject("Microsoft.XMLDOM");
//     doc.async = false;
//     doc.loadXML(opml);
// }
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/xml');

    let title = this.state.file.name;
    let node = doc.getElementsByTagName('head');
    if (node.length) {
      node = node[0].getElementsByTagName('title');
      if (node.length) {
        title = node[0].textContent;
      }
    }

    const outlines = doc.getElementsByTagName('outline');
    let feedsToImport = [];
    for (let i=0; i < outlines.length; i++) {
      const url = outlines[i].getAttribute('xmlUrl');
      if (url !== null) {
        feedsToImport.push({ title: outlines[i].getAttribute('title'), url });
      }
    }

    this.setState({ title, feedsToImport });
  };

  _handleImportClick = (e) => {
    if (this.state.feedsToImport.length) {
      this.setState({ importing: true });
      this.props.dispatch(feeds.actions.importFeeds(this.state.feedsToImport));
    }
  };

}

const mapStateToProps = (state) => ({
  feeds: state.feeds,
  importStatus: feeds.selectors.getImportFeedsStatus(state),
});

export default connect(mapStateToProps)(Import);