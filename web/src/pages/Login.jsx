import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { parse } from 'qs'
import config from 'config'
import Loading from 'components/Loading'
import Version from 'components/Version'
import logo_google from 'logo_google.svg'
import logo_facebook from 'logo_facebook.png'
import './Login.css'
import session from 'reducers/session'

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = { redirecting: false };
  }

  componentWillMount() {
    const query = parse(this.props.location.search.substr(1));
    if (query.code) {
      this.setState({ redirecting: true });
      console.log('>>>', window.location.pathname)

      if (window.location.pathname === '/login/google') {
        this.props.dispatch(session.actions.login('google', query.code));
      } else {
        this.props.dispatch(session.actions.login('facebook', query.code));
      }
    }
  }

  render() {
    const { session, location } = this.props;
    if (session.user !== null) {
      const { from } = location.state || { from: { pathname: '/' } };
      return <Redirect to={ from } />
    }

    if (session.loading || this.state.redirecting) {
      return (
        <div className="Login">
          <Loading />
        </div>
      )
    }

    return (
      <div className="Login">
          <div className="centered">
            <div className="login-logo">
              <svg className="login-logo-svg" viewBox="0 0 400 88"><path d="M1.201 0.855 C -0.706 2.064,-0.023 15.036,2.000 16.024 C 2.825 16.428,7.550 17.506,12.500 18.422 C 41.689 23.819,69.000 52.957,69.000 78.700 C 69.000 85.572,70.555 87.000,78.038 87.000 C 87.109 87.000,87.563 86.363,86.068 75.758 C 81.940 46.486,63.851 21.410,37.500 8.428 C 25.689 2.610,5.180 -1.669,1.201 0.855 M292.000 18.908 L 292.000 30.817 281.250 30.668 C 261.079 30.388,253.650 40.128,255.330 64.648 C 256.706 84.729,268.375 92.790,286.239 86.001 C 292.520 83.613,292.000 83.659,292.000 85.500 C 292.000 86.583,293.111 87.000,296.000 87.000 L 300.000 87.000 300.000 47.000 L 300.000 7.000 296.000 7.000 L 292.000 7.000 292.000 18.908 M130.836 32.016 C 127.721 33.089,123.558 34.918,121.586 36.082 L 118.000 38.198 118.000 34.599 C 118.000 31.000,118.000 31.000,113.500 31.000 L 109.000 31.000 109.000 59.000 L 109.000 87.000 113.500 87.000 L 118.000 87.000 118.000 66.593 L 118.000 46.187 125.250 43.219 C 129.238 41.587,133.738 39.961,135.250 39.606 C 137.745 39.022,138.000 38.546,138.000 34.481 C 138.000 29.346,138.298 29.448,130.836 32.016 M161.500 30.885 C 149.670 33.964,145.000 42.204,145.000 60.000 C 145.000 84.512,152.909 90.383,181.853 87.358 L 188.000 86.715 188.000 83.358 L 188.000 80.000 175.450 80.000 C 158.259 80.000,155.676 78.435,153.581 66.750 L 152.909 63.000 171.591 63.000 L 190.273 63.000 189.782 53.629 C 188.852 35.843,177.506 26.719,161.500 30.885 M212.235 30.979 C 203.188 31.998,202.000 32.452,202.000 34.887 C 202.000 39.422,202.402 39.554,213.365 38.605 C 224.969 37.601,228.041 38.054,230.972 41.201 C 233.330 43.732,233.939 52.981,231.750 53.026 C 210.227 53.470,200.927 57.634,199.449 67.490 C 196.919 84.361,208.805 92.148,227.902 86.132 C 234.257 84.130,234.333 84.129,238.113 86.057 C 246.678 90.427,253.310 84.528,245.089 79.851 L 242.191 78.202 241.845 59.351 C 241.334 31.460,237.823 28.096,212.235 30.979 M329.564 31.073 C 317.334 34.097,311.213 48.351,313.990 67.343 C 316.404 83.850,321.359 88.061,338.218 87.926 C 353.710 87.802,356.441 87.116,356.813 83.250 L 357.127 80.000 343.786 80.000 C 326.841 80.000,324.350 78.499,322.627 67.250 L 321.976 63.000 340.488 63.000 L 359.000 63.000 359.000 56.115 C 359.000 36.812,347.145 26.726,329.564 31.073 M393.500 31.886 C 390.750 32.884,386.700 34.674,384.500 35.865 L 380.500 38.031 380.190 34.516 C 379.885 31.069,379.792 31.000,375.440 31.000 L 371.000 31.000 371.000 59.000 L 371.000 87.000 375.500 87.000 L 380.000 87.000 380.000 66.623 L 380.000 46.246 384.750 44.241 C 388.937 42.474,395.011 40.370,398.750 39.390 C 400.091 39.039,400.576 29.972,399.250 30.036 C 398.837 30.056,396.250 30.888,393.500 31.886 M1.250 32.133 C -0.413 33.819,-0.413 45.439,1.250 46.712 C 1.937 47.239,5.010 48.209,8.077 48.868 C 22.907 52.054,34.264 63.648,38.084 79.500 C 39.838 86.780,45.627 89.383,53.418 86.393 C 59.415 84.092,50.514 59.325,39.689 48.192 C 29.327 37.536,5.670 27.652,1.250 32.133 M175.128 39.566 C 178.686 41.406,181.000 46.294,181.000 51.968 L 181.000 56.000 166.912 56.000 L 152.824 56.000 153.530 51.750 C 155.455 40.168,165.421 34.546,175.128 39.566 M288.250 38.642 L 292.000 39.262 292.000 57.682 L 292.000 76.102 288.250 77.730 C 271.798 84.873,262.480 76.266,264.392 55.695 C 265.826 40.264,271.881 35.936,288.250 38.642 M343.926 39.462 C 347.162 41.135,350.000 47.236,350.000 52.520 L 350.000 56.000 335.875 56.000 L 321.750 56.000 322.375 52.875 C 322.719 51.156,323.000 48.941,323.000 47.952 C 323.000 40.742,336.114 35.422,343.926 39.462 M233.000 68.465 C 233.000 78.364,232.768 78.617,222.339 80.094 C 212.022 81.555,208.000 78.907,208.000 70.651 C 208.000 63.334,213.424 60.514,228.250 60.125 L 233.000 60.000 233.000 68.465 M5.893 64.497 C 0.073 67.660,-1.809 75.736,1.946 81.433 C 10.254 94.035,28.963 83.262,22.484 69.607 C 19.668 63.674,11.843 61.263,5.893 64.497 " stroke="none" fill="#3b8dbd" fillRule="evenodd"></path></svg>
            </div>
            <div className="login-form">
              <div className="login-form-title">
                <span>welcome</span>
              </div>
              <div className="social-buttons">
                <a onClick={this._handleLoginWithGoogleClick} className="button-google">
                  <img src={logo_google} alt="google" height="35px"/>
                  <span>Login with Google</span>
                </a>
                <a onClick={this._handleLoginWithFacebookClick} className="button-facebook">
                  <img src={logo_facebook} alt="facebook" height="30px"/>
                  <span>Login with Facebook</span>
                </a>
              </div>
            </div>
          </div>
          <Version/>
        </div>
    )
  }

  // --

  _handleLoginWithFacebookClick = (e) => {
    e.preventDefault();
    this.setState({ redirecting: true });
    window.location = 'https://www.facebook.com/dialog/oauth?client_id=' + config.FACEBOOK_APP_ID
      + '&scope=public_profile,email&redirect_uri=' + window.location.origin + window.location.pathname + '/facebook';
  }

  _handleLoginWithGoogleClick = (e) => {
    e.preventDefault();
    this.setState({ redirecting: true });
    window.location = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + config.GOOGLE_CLIENT_ID
      + '&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
      + '&access_type=offline&include_granted_scopes=true&response_type=code'
      // + '&state=state_parameter_passthrough_value'
      + '&redirect_uri=' + window.location.origin + '/login/google';

    // window.location = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + config.GOOGLE_CLIENT_ID
    //   + '&response_type=code&scope=openid%20email&redirect_uri=' + window.location.origin + '/login/google'
    //   + '&state=security_token%3D138r5719ru3e1%26url%3Dhttps://oauth2-login-demo.example.com/myHome'
    //   + '&login_hint=jsmith@example.com';
  }

}

const mapStateToProps = (state) => ({
  session: state.session
});

export default connect(mapStateToProps)(Login);
