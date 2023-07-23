import 'normalize.css/normalize.css'
import '@assets/icon/iconfont.css'
import '@assets/styles/global.scss'

import Vue from 'vue'
import './component.js'

import request from './request.js'

export default callback => {
  Vue.use({
    install (vm, options) {
      vm.prototype.$request = request
    }
  })
  callback && callback()
}
