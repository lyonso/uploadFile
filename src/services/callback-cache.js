/**
 * promise callback cache
 * 所有异步发送的消息，将callback保存起来，收到消息后执行
 */
import client from '../client'

let callbackCache = {
  cache: {
    // "action_type": [{ resolve, reject }]
  },

  push: function(actionType, resolve, reject) {
    if (!this.cache[actionType]) this.cache[actionType] = []
    // 设置超时定时器
    let timer = setTimeout(() => {
      let callback = this.shift(actionType)
      if (callback) reject(actionType + 'TIME OUT')
    }, 60 * 1000)
    this.cache[actionType].push({ resolve, reject, timer })
  },

  shift: function(actionType) {
    if (!this.cache[actionType]) return null
    let callback = this.cache[actionType].shift()
    if (!callback) return null
    // 清除定时器
    clearTimeout(callback.timer)
    return callback
  }
}

client.on('message', data => {
  try {
    data = JSON.parse(data)
    if (!callbackCache.cache[data.type]) return
    let callback = callbackCache.shift(data.type)
    if (!callback) return
    callback.resolve(data)
  } catch (err) {
    console.error(err)
  }
})

export default callbackCache
