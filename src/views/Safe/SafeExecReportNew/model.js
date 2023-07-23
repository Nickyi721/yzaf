import request from '@commons/request.js'

export default {
  // 获取检查计划
  saveSafeReport: async data => {
    const result = await request({
      url: '/aqjcAqjcbg/saveAqjcbg',
      data
    })
    return result || {}
  }
}
