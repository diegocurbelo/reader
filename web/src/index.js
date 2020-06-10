import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import { store, history } from './store'
import GoogleAnalytics from 'react-ga'

import 'bootstrap/dist/css/bootstrap.css'
import './index.css'

import AuthenticatedRoute from './components/AuthenticatedRoute'
import LoginPage from './pages/Login'
import ErrorPage from './pages/Error'
import MainPage from './pages/Main'
import Notifications from 'components/Notifications'

import registerServiceWorker from './sw'

import notifications from 'reducers/notifications'

GoogleAnalytics.initialize('UA-71387615-1');

const withTracker = (WrappedComponent, options = {}) => {
  const trackPage = page => {
    GoogleAnalytics.set({ page, ...options });
    GoogleAnalytics.pageview(page);
  };

  const HOC = class extends Component {
    componentDidMount() {
      const page = this.props.location.pathname;
      trackPage(page);
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.location.pathname !== nextProps.location.pathname) {
        trackPage(nextProps.location.pathname);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  return HOC;
}

const App = () => (
  <div>
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/error" component={ErrorPage} />
      <AuthenticatedRoute path="/" component={MainPage} />
    </Switch>
    <Notifications />
  </div>
)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route component={withTracker(App)} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

const onUpdate = () => {
  store.dispatch(notifications.actions.addNotification('app-updated', 'The app has been updated! Hooray! Refresh your browser to enjoy the latest and greatest'))
}

registerServiceWorker(onUpdate);
