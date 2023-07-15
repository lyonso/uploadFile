/**
 * websocket client
 */
import { EventEmitter } from 'events'
import WebSocket from 'websocket'
import _ from 'lodash'
import { WSS_SERVER_URL, PINGINTERVAL } from '@/config'

const WebSocketClient = WebSocket.w3cwebsocket

class Client extends EventEmitter {

  constructor() {
    super()
    this.ws = null
    this.isConnected = false
    this.lockReconnect = false
    this.tt = null
    this.heartTimer = null
  }

  open() {
    if (this.ws) {
      this.emit('open')
      return false
    }

    this.createWs(WSS_SERVER_URL)
  }

  close() {
    if (this.ws) this.ws.close()
  }

  send(data) {
    if (!_.isString(data)) data = JSON.stringify(data)
    if (this.ws) this.ws.send(data)
  }

  readyState() {
    return this.ws.readyState
  }

  createWs = url => {
    try {
      this.ws = new WebSocketClient(url)
      this.wsInit()//初始化webSocket连接函数
    } catch (e) {
      console.log('catch')
      this.wsReconnect(url)//重连函数
    }
  }

  wsInit = () => {
    this.ws.onerror = () => {
      console.log('Connection Error')
      this.emit('error')
      this.wsReconnect(WSS_SERVER_URL)
    }

    this.ws.onopen = () => {
      console.log('WebSocket Client Connected')
      this.isConnected = true
      this.emit('open')
      this.heartStart(WSS_SERVER_URL)
    }

    this.ws.onclose = e => {
      console.log('echo-protocol Client Closed', JSON.stringify(e))
      this.emit('close')
      this.wsReconnect(WSS_SERVER_URL)
    }

    this.ws.onmessage = e => {
      // console.log(e)
      if (typeof e.data === 'string') {
        // console.log('Received: \'' + e.data + '\'')
        if (e.data !== 'pong') this.emit('message', e.data)
      }
      this.heartReset()
    }
  }

  wsReconnect = url => {
    console.log("socket 连接断开，正在尝试重新建立连接")
    if (this.lockReconnect) return
    this.lockReconnect = true
    // 没连接上会一直重连，设置延迟，避免请求过多
    this.tt && clearTimeout(this.tt)
    this.tt = setTimeout(() => this.createWs(url),4000)
  }

  heartStart = () => {
    this.heartTimer = setTimeout(() => this.send(JSON.stringify({
      name: "ping",
      breathe: true
    })), PINGINTERVAL)
  }

  heartReset = () => {
    // 重置倒计时
    clearTimeout(this.heartTimer)
    this.heartStart()
  }

}

let client = new Client()

export default client
