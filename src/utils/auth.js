/*
 * @Author: 陈亚东
 * @Date: 2020-11-05 09:45:01
 * @LastEditors: 凌江海
 * @LastEditTime: 2021-03-22 15:39:29
 * @Description:
 */
import Cookies from 'js-cookie'
const USERID = 'USERID'

export const TokenKey = 'X-Auth-Token'
// const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserId() {
  return Cookies.get(USERID)
}
export function setUserId(userId) {
  return Cookies.set(USERID, userId)
}
export function set(key, val) {
  return Cookies.set(key, val)
}

export function get(key) {
  return Cookies.get(key)
}
/**
 * 销毁localStorage所有值
 */
export function removeAll() {
  return window.localStorage.clear()
}
export function clearAllCookie() {
  var date = new Date()
  date.setTime(date.getTime() - 10000)
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (var i = keys.length; i--;) {
      document.cookie = `${keys[i]}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
  }
}

/**
 * 销毁检索条件
 * @param {*} key
 */
export const removeKey = (key) => {
  return window.localStorage.removeItem(key)
}
