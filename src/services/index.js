import callbackCache from './callback-cache'
import client from '../client'

export function sendMsg(data) {
  return new Promise((resolve, reject) => {
    if (!client.isConnected) return reject()
    callbackCache.push('sendMsg', resolve, reject)
    client.send(data)
  })
}

export default {
  sendMsg
}
