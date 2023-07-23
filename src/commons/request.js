import axios from 'axios'
import config from './config.js'
import utils from './utils.js'
import { Loading } from 'element-ui'

let lock = false
const unlock = () => {
  setTimeout(() => {
    lock = false
  }, 500)
}

// http请求通用错误处理函数
let oldError = ''
const errorHandle = (networkError, dataError) => {
  unlock()
  // 请求及响应错误，根据http状态码做出处理
  if (networkError) {
    const error = networkError.toString()
    if (error !== oldError && !error.match('Cancel')) {
      globalAlert(error)
      oldError = error

      !error.match('timeout') && redirectSign()
    }
  } else {
    globalAlert(dataError)
  }
}

let c
const globalAlert = errorMsg => {
  c && clearTimeout(c)
  c = setTimeout(() => {
    window.$app.$msgbox({
      message: errorMsg,
      type: 'alert'
    })
  }, 300)
}

// 退出并重定向到登录
const redirectSign = () => {
  delete window.sessionStorage.user
  delete window.sessionStorage.sessionId
  delete window.sessionStorage.menuIds
  delete window.sessionStorage.boardIds
  window.$app.$router.push('/sign')
}

const createCancelToken = url => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()
  window.$request = window.$request || {}
  window.$request[url] = source
  return source.token
}

// 发起Http请求函数，返回Promise对象
const request = options => {
  // 去除非查询请求服务请求体中的空格
  if (options.data && !options.data.isQuery) {
    let requestData = options.data.requestData
    for (let k in requestData) {
      if (typeof requestData[k] === 'string' && requestData[k] && requestData[k].trim() === '') {
        window.$app.$msgbox(`未填写完整，请重新填写后提交`)
        return
      }
      if (typeof requestData[k] === 'string') {
        requestData[k] = requestData[k].trim()
      }
    }
  }
  // 根据options.commit参数开启状态，防止重复提交
  if (lock) return
  if (options.commit) lock = true

  // 定义加载动画实例
  let loadingInstance

  options.method = options.method || 'post'
  options.loader = typeof options.loader !== 'undefined' ? options.loader : true
  options.cancelToken = createCancelToken(options.url)
  options.data = options.data || {}
  options.headers = options.headers || {
    'content-type': 'application/x-www-form-urlencoded'
    // 'Content-Type': 'multipart/form-data'
  }

  if (options.url === 'httpPostLogin') {
    axios.defaults.withCredentials = false
  } else {
    axios.defaults.withCredentials = true
  }
  if (window.sessionStorage.sessionId) {
    options.data.sessionId = window.sessionStorage.sessionId
    options.data.lylx = '0'
  }

  options.data.cdId = options.data.cdId || utils.getMenuId()
  options.data.isQuery = options.data.isQuery || 0
  const httpInstance = axios.create({
    baseURL: config.host + config.api,
    timeout: 30000000
  })

  // 请求拦截
  httpInstance.interceptors.request.use(function (config) {
    if (options.url === '/fileUploadDown/fileUpload' || options.url === 'zlk/zlkDownload' || options.url === 'zlk/zlkUpload') {
      Reflect.deleteProperty(config, 'timeout')
      // config.headers = {
      //   'Content-Type': 'multipart/form-data'
      // }
      // config.onUploadProgress = (progress) => {
      //   console.log(progress)
      // }
    }
    if (options.loader) {
      loadingInstance = Loading.service({
        lock: true,
        target: '.custom-view',
        text: '数据加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.3)'
      })
    }
    console.log(config)
    return config
  }, function (error) {
    console.error('request error')
    loadingInstance && loadingInstance.close()
    errorHandle(error)
  })

  // 响应拦截
  httpInstance.interceptors.response.use(function (response) {
    loadingInstance && loadingInstance.close()
    if (typeof response.data === 'string') {
      response.data = JSON.parse(response.data)
    }
    if (response.data.status === '-99') {
      errorHandle(null, '登录信息失效，请您重新登录！')
      redirectSign()
    } else if (response.data.state === '0') {
      // 业务处理失败
      errorHandle(null, response.data.msg)
    } else if (['6', '2', '-1', '7', '3', '4', '-98', '11', '12', '15', '16'].indexOf(response.data.state) > -1) {
      //  === '2' || response.data.state === '3' || response.data.state === '4')
      // 登录信息返回状态2：账户停用3：缺少参数4：账号或者密码错误11:账户锁定，请十分钟后重试!12:账户锁定15:账号或者密码错误16:缺少参数
      errorHandle(null, response.data.message)
    } else {
      unlock()
      // 登录成功状态：5  业务处理成功：1
      return response.data
    }
  }, function (error) {
    loadingInstance && loadingInstance.close()
    errorHandle(error, '网络故障或用户已通过其他方式登录！')
  })

  return httpInstance(options)
}

export default request
