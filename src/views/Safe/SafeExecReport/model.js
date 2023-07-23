import request from '@commons/request.js'

export default {
  // 获取检查计划
  getDataList: async data => {
    const result = await request({
      url: '/aqjcto/getAqjcbList',
      data
    })
    return result || {}
  },
  // 生成报告书
  getReportBook: async data => {
    const result = await request({
      url: '/aqjcAqjcbg/tosaveAqjcbg',
      data
    })
    return result || {}
  },


}
