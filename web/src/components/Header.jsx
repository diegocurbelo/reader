import React from 'react'
import { connect } from 'react-redux'
import Dropdown from 'react-bootstrap/lib/Dropdown'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import Navbar from 'react-bootstrap/lib/Navbar'
import PageHeader from 'react-bootstrap/lib/PageHeader'
import ProgressBar from 'react-bootstrap/lib/ProgressBar'
import './Header.css'

class Header extends React.Component {

  render() {
    const { title, progress, children, onCloseRoute } = this.props;
    return (
      <Navbar className="Header" collapseOnSelect>
        <Navbar.Header>
          <a className="sidebar-toggle" onClick={this._handleToggleSidebarClick}>
            <span className="sidebar-toggle-icon"></span>
          </a>
          <PageHeader>{title ? title : 'Loading...'}</PageHeader>
          { children
            ? <Dropdown id="feed-settings-menu" pullRight>
                <Dropdown.Toggle noCaret>
                  <Glyphicon glyph="option-vertical" />
                </Dropdown.Toggle>
                {children}
              </Dropdown>
            : null }

          { onCloseRoute
            ? <button type="button" className="close" onClick={() => this.props.history.push(onCloseRoute)}>
                <span aria-hidden="true">×</span>
              </button>
            : null }
        </Navbar.Header>
        { onCloseRoute
          ? null
          : <ProgressBar className="read-progress" now={progress} /> }
      </Navbar>
    )
  }

  // --

  _handleToggleSidebarClick = (e) => {
    e.preventDefault();
    this.props.showSidebar(true);
  };

}

export default connect()(Header);
