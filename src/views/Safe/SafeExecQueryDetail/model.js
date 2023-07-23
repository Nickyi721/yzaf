import request from '@commons/request.js'

export default {
  // 获取信息上报列表
  getAqjcbgDetial: async data => {
    const result = await request({
      url: 'aqjcAqjcbg/getAqjcbgDetial',
      data
    })
    return result || {}
  },
  // 导出安全检查报告
  exportReport: async data => {
    const result = await request({
      url: '/aqjcAqjcbg/scAqjcbgs',
      data
    })
    return result || {}
  },
}
