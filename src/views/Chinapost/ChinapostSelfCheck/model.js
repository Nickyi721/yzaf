import request from '@commons/request.js'

export default {
  // 获取自评审核列表
  getList: async data => {
    const result = await request({
      url: '/payzNzkp/getshNzkpList',
      data
    })
    return result || {}
  }
}
