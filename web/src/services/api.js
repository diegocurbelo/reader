import axios from 'axios'
import config from 'config'

axios.defaults.headers.common['Accept'] = 'application/json';

export const login = (provider, code) =>
  axios.post(`${config.API_URL_REST}/sessions`, {
    [`${provider}_code`]: code
  })

export const logout = () =>
  axios.delete(`${config.API_URL_REST}/sessions`)
