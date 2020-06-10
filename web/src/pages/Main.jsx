import React from 'react'
import { connect } from 'react-redux'
import { Switch, Redirect, Route } from 'react-router-dom'
import ReactSidebar from 'react-sidebar'
import Sidebar from 'components/Sidebar'
import Feeds from './feeds/Feeds'
import FeedDetail from './feeds/_components/FeedDetail'
import Subscriptions from './subscriptions/Subscriptions'
import NewSubscription from './subscriptions/New'
import Loading from 'components/Loading'
import ImportSubscriptions from './subscriptions/Import'
import './Main.css';

const mql = window.matchMedia(`(min-width: 800px)`);

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mql: mql,
      docked: props.docked,
      open: props.open
    }
  }

  componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
    this.setState({
      mql: mql,
      sidebarDocked: mql.matches
    });
  }

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  }

  render() {
    const { loading, items } = this.props.feeds;
    if (loading && items.length === 0) {
      return <Loading/>
    }

    var sidebarContent = <Sidebar showSidebar={this.showSidebar}/>;
    const styles = {
      sidebar: {
        zIndex: 1500,
        background: "#3C4B5B",
      },
    };

    return (
      <ReactSidebar sidebar={sidebarContent}
               open={this.state.sidebarOpen}
               docked={this.state.sidebarDocked}
               onSetOpen={this.showSidebar}
               shadow={false}
               styles={styles}
               contentClassName="Main"
               touchHandleWidth={15}>
        <Switch>
          <Redirect exact from='/' to='/feeds'/>
          <Route path="/feeds" exact render={(props) => (
            <Feeds {...props} showSidebar={this.showSidebar} />
          )}/>
          <Route path="/feeds/:id" render={(props) => (
            <FeedDetail {...props} showSidebar={this.showSidebar} />
          )}/>
          <Route path="/subscriptions" exact render={(props) => (
            <Subscriptions {...props} showSidebar={this.showSidebar} />
          )}/>
          <Route path="/subscriptions/new" exact render={(props) => (
            <NewSubscription {...props} showSidebar={this.showSidebar} />
          )}/>
          <Route path="/subscriptions/import" exact render={(props) => (
            <ImportSubscriptions {...props} showSidebar={this.showSidebar} />
          )}/>
          <Redirect to={{ pathname: '/error', code: 404, reason: '404' }} />
        </Switch>
      </ReactSidebar>
    )
  }

  // --

  mediaQueryChanged = () => {
    this.setState({sidebarDocked: this.state.mql.matches});
  };

  showSidebar = (open) => {
    this.setState({sidebarOpen: open});
  };

}

const mapStateToProps = (state) => ({
  feeds: state.feeds
});

export default connect(mapStateToProps)(Main);