var config = {
  VERSION: process.env.REACT_APP_VERSION,
  // API_URL_REST: 'http://192.168.1.225:4000/api',
  // API_URL_WSS: 'ws://192.168.1.225:4000/socket',
  API_URL_REST: 'http://localhost:4000/api',
  API_URL_WSS: 'ws://localhost:4000/socket',
  GOOGLE_CLIENT_ID: '908582204989-niato8ei389rd07k8daj5rhk2td6ki4t.apps.googleusercontent.com',
  FACEBOOK_APP_ID: '598968276975335'
};

if (process.env.NODE_ENV === 'production') {
  config.API_URL_REST = 'https://api.reader.uy/api'
  config.API_URL_WSS = 'wss://api.reader.uy/socket'
  config.GOOGLE_CLIENT_ID = '908582204989-smhev5ignsea27fna3ri96hp58bdrt3b.apps.googleusercontent.com'
  config.FACEBOOK_APP_ID = '322674367938062'
}

export default config;
