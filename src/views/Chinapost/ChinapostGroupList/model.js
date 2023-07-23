import request from '@commons/request.js'

export default {
  // 获取集团审核列表
  getList: async data => {
    const result = await request({
      url: 'payzNzkp/getJtkpList',
      data
    })
    return result || {}
  },
}
