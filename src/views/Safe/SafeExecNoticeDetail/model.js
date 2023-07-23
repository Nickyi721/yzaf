import request from '@commons/request.js'

export default {
  // 获取隐患整改详情
  getNoticeDetail: async data => {
    const result = await request({
      url: '/aqjcAqjcbg/getYhzgDetial',
      data
    })
    return result || {}
  },
  // 新增隐患整改回复书
  addNoticeReply: async data => {
    const result = await request({
      url: '/aqjcYhzgtz/insertYhzghf',
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
  // 导出隐患整改通知
  exportNotice: async data => {
    const result = await request({
      url: '/aqjcAqjcbg/scYhzgtz',
      data
    })
    return result || {}
  },
  // 导出隐患整改回复
  exportNoticeReply: async data => {
    const result = await request({
      url: '/aqjcAqjcbg/scYhzghf',
      data
    })
    return result || {}
  }
}
