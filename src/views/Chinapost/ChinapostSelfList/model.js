import request from '@commons/request.js'

export default {
  // 获取自评列表
  getList: async data => {
    const result = await request({
      url: 'payzNzkp/getNzkpList',
      data
    })
    return result || {}
  },
  // 新增当前年份自评记录
  addYear: async data => {
    const result = await request({
      url: 'payzNzkp/insertZkp',
      data
    })
    return result || {}
  }
}
