// 登录页
import './assets/bideo.js'

import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import init from './commons/init.js'
import bus from './utils/eventBus'

Vue.prototype.$bus = bus
Vue.config.productionTip = false

init(() => {
  window.$app = new Vue({
    router,
    render: h => h(App)
  })
  window.$app.$mount('#app')
})
