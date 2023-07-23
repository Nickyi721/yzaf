import Vue from 'vue'
import Router from 'vue-router'
import bus from '../utils/eventBus'
import flatten from './flatten.js'

import HeaderAsideLayout from '../layouts/HeaderAsideLayout/main.vue'
import SingleLayout from '../layouts/SingleLayout/main.vue'
import Home from '../views/Home/main.vue'
import Sign from '../views/Sign/main.vue'
import Password from '../views/Password/main.vue'

import systemRoutes from './route.system.js'
import infoRoutes from './route.info.js'
import guardRoutes from './route.guard.js'
import chinapostRoutes from './route.chinapost.js'
import documentRoutes from './route.document.js'
import dataRoutes from './route.data.js'
import financeRoutes from './route.finance.js'
import safeRoutes from './route.safe.js'
import produceRoutes from './route.produce.js'
import fireRoutes from './route.fire.js'

Vue.use(Router)

const routes = flatten([
  { path: '/', layout: HeaderAsideLayout, component: Home },
  { path: '/sign', layout: SingleLayout, component: Sign },
  { path: '/password', layout: HeaderAsideLayout, component: Password },
  systemRoutes,
  infoRoutes,
  guardRoutes,
  chinapostRoutes,
  documentRoutes,
  dataRoutes,
  financeRoutes,
  safeRoutes,
  produceRoutes,
  fireRoutes
])
const router = new Router({ routes })
let currentMenuList = []
let tips = 0
router.beforeEach((to, from, next) => {
  tips = 0
  // 获取传递的参数并进行操作 每次路由加载时读取上次操作后的数组
  bus.$on('switchPage', (params) => {  
    currentMenuList = params
  })
  if (Object.keys(to.meta).length !== 0) {
    currentMenuList.forEach(item => {
      if (item.name === to.meta.name) {
        tips = 1
      }
    })
    let obj = {
      title: to.meta.title,
      name: to.meta.name,
      isMenu: to.meta.isMenu,
      path: to.fullPath
    }
    if (tips === 0) {
      currentMenuList.unshift(obj)
      // currentMenuList.push(obj)
    }
    bus.$emit('switchPage', currentMenuList)
  }
  // 路由跳转时取消当前页面的请求
  if (window.$request) {
    // for (let url in window.$request) {
    //   const source = window.$request[url]
    //   source.cancel('current request canceled')
    // }
    // window.$request = {}
  }
  if (to.path !== '/sign') {
    if (window.sessionStorage.user) {
      next()
    } else {
      next('/sign')
    }
  } else {
    if (window.sessionStorage.user) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
