import request from '@commons/request.js'

export default {
  // 获取详情
  getDetailList: async data => {
    const result = await request({
      url: '/aqjcto/getAqjcXxxDetail',
      data
    })
    return result || {}
  },

}
