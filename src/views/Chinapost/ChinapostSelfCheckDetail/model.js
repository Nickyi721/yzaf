import request from '@commons/request.js'

export default {
  // 获取自评详情
  getDetailList: async data => {
    const result = await request({
      url: 'payzNzkp/getNzzpDetail',
      data
    })
    return result || {}
  },
  // 审核
  checkItem: async data => {
    const result = await request({
      url: 'payzNzkp/shNzkp',
      data
    })
    return result || {}
  },
}
