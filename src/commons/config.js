// 开发模式配置
// // window.host = 'http://192.168.0.177'
// window.host = 'http://192.168.0.124:8080'
window.host = 'http://192.168.0.152:7070'
window.api = '/SecurityBackend'

// window.host = 'http://200.200.200.51'
// window.api = ''
window.report = 'http://200.200.200.51:7001/WebReport/ReportServer?'
const dev = {
  host: window.host,
  api: window.api,
  report: window.report
}
// 生产环境配置
const prod = {
  host: window.host,
  api: window.api,
  report: window.report
}

const config = process.env.NODE_ENV === 'development' ? dev : prod

export default config
