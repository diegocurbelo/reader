export const types = {
  LOGIN_REQUEST: 'session/login.request',
  LOGIN_SUCCESS: 'session/login.success',
  LOGIN_FAILURE: 'session/login.failure',
  CONNECT: 'session/connect',
  SOCKET_CONNECTED: 'session/socket_connected',
  SESSION_EXPIRED: 'session/expired',
  LOGOUT: 'session/logout',
}

// --

export const INITIAL_STATE = {
  loading: false,
  token: null,
  user: null,
  channel: null,
}

export const reducer = (state = INITIAL_STATE, action = {}) => {
  switch (action.type) {
    case types.LOGIN_REQUEST:
      return { ...state, loading: true }

    case types.LOGIN_SUCCESS:
    case types.CONNECT:
      return { ...state, loading: false, token: action.token, user: action.user }

    case types.SOCKET_CONNECTED:
      return { ...state, channel: action.channel }

    case types.LOGIN_FAILURE:
    case types.SESSION_EXPIRED:
    case types.LOGOUT:
      return INITIAL_STATE

    default:
      return state
  }
}

// --

export const actions = {
  login: (provider, code) => ({
    type: types.LOGIN_REQUEST,
    provider,
    code
  }),
  logout: () => ({
    type: types.LOGOUT
  }),
  connect: ({ token, user }) => ({
    type: types.CONNECT,
    token,
    user
  }),
}

// --

export const selectors = {
  getLoggedClient: (state) => state.session.user
}

// --

export default {
  types,
  reducer,
  actions,
  selectors,
}
