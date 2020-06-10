import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

class AuthenticatedRoute extends React.Component {

  render() {
    if (!this.props.session.user) {
      return <Redirect to={{ pathname: '/login', state: { from: this.props.location } }}/>
    }

    const { component: Component, session, ...rest } = this.props;
    return (
      <Route {...rest} render={props => (
        <Component {...props}/>
      )} />
    )
  }
}

const mapStateToProps = (state) => ({
  session: state.session
});

export default connect(mapStateToProps)(AuthenticatedRoute);