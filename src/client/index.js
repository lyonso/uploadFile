/**
 * 连接socket server
 */
import bus from '../bus'
import client from './client'

client.on('open', () => console.info('client: open'))
client.on('error', error => console.error('client: error', error.message))
client.on('close', () => console.warn('client: close'))

/**
 * 收到事件消息，则转交给bus
 */
client.on('message', data => {
  try {
    if (data != '连接成功') {
      data = JSON.parse(data)
      // 消息事件推送
      bus.emit(data.websocketType, data.data)
    }
  } catch (err) {
    console.error(err)
  }
})

/**
 * socket断开
 */
client.on('close', () => {

})

client.open()

export default client

if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    if (client.isConnected) return
    client.open()
  }, 1000)
}
