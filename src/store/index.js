/**
 * 状态管理入口
 * author: Wang <wangh@ciqtek.com>
 * company: ubiot.cn
 * date: 2019-10-21
 */

import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import map from './modules/map'
import security from './modules/security'

import automaticStation from './modules/automaticStation'
import ThreeDLaboratory from './modules/ThreeDLaboratory'
Vue.use(Vuex)

const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters,
  map,
  security,
  automaticStation,
  ThreeDLaboratory
})

export default store
