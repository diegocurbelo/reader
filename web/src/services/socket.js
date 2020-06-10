import { Socket } from 'phoenix'
import { eventChannel } from 'redux-saga'
import config from 'config'

export function connectToSocket(token) {
  const socket = new Socket(config.API_URL_WSS, {
    params: { token }
  });
  socket.connect();
  socket.onClose(() => console.log("On Close"))
  socket.onError((error) => console.log("On Error", error))
  return socket;
}

export function joinChannel(socket, channelName) {
  const channel = socket.channel(channelName, {});
  channel
  	.join()
    .receive('error', (resp) => {
      console.log('> Unable to join', resp);
    });

  return channel;
}

export const subscribeToChannel = (channel) =>
  eventChannel((emit) => {
    const handle = (event) => (payload) => emit({ event: event, payload })

    channel.on('phx_reply', handle('phx_reply'))
    channel.on('updated', handle('updated'))

    return () => {
      channel.off('phx_reply', handle('phx_reply'))
      channel.off('updated', handle('updated'))
    }
  });

export const send = (channel, event, payload) =>
  channel.push(event, payload)

export const leave = (channel) =>
  channel.leave()
