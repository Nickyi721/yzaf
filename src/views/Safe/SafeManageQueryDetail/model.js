import request from '@commons/request.js'

export default {
  // 安全检查报告详情
  getAqjcbgDetial: async data => {
    data.isQuery = 1
    const result = await request({
      url: 'aqjcAqjcbg/getAqjcjhjgDetailNew',
      data
    })
    return result || {}
  },
  // 生成隐患整改通知
  makeNotice: async data => {
    const result = await request({
      url: 'aqjcYhzgtz/tosaveYhzgtz',
      data
    })
    return result || {}
  },
  // 下发隐患整改通知
  sendNotice: async data => {
    const result = await request({
      url: 'aqjcYhzgtz/saveYhzgtz',
      data
    })
    return result || {}
  },
  // 获取隐患整改详情
  getNoticeDetail: async data => {
    const result = await request({
      url: '/aqjcAqjcbg/getYhzgDetial',
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
  },
}