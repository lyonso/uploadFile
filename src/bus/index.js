/**
 * 全局事件
 * @date 2019-04-02
 * @summary
 *
 * - 关于Bus在窗口进程监听事件
 * 经过测试,窗口中监听的事件,当窗口关闭后,下次触发该事件会自动清除监听,
 *
 */

import { EventEmitter } from 'events'

class Bus extends EventEmitter {
  constructor() {
    super()
  }
}

let bus = new Bus()

/** default is 10 */
bus.setMaxListeners(100)

export default bus
