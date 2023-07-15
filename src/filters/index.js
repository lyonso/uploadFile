/**
 * Vue模板 - 全局过滤器
 * author: Wang <wangh@ciqtek.com>
 * company: ubiot.cn
 * date: 2019-12-19
 */

import Vue from 'vue'

/**
 * 格式化过长文字
 * @param {string} text
 * @param {number} num
 * @returns {string}
 */
Vue.filter('tooLong', function(text, num) {
  if (!text) return '-'
  if (typeof text !== 'string') text = text.toString()
  if (text.length <= num) {
    return text
  } else {
    return text.substring(0, num) + '...'
  }
})

/**
 * 字段为空则以常规文字替换
 * @param {string} text
 * @param {string} replaceText
 * @returns {string}
 */
Vue.filter('nullReplace', function(text, replaceText) {
  if (!text || text === '') {
    if (replaceText && replaceText !== '') return replaceText
    return '-'
  } else {
    return text
  }
})

/**
 * 格式化时间值
 * @param num
 */
Vue.filter('fmtTime', function(num) {
  if (!num && num !== 0) return num
  if (parseFloat(num) < 10) return '0' + num
  return num
})

/**
 * 格式化时间
 */
Vue.filter('initTime',function(time){
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = '{y}-{m}-{d}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
})
