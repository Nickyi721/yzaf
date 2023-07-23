import request from '@commons/request.js'

export default {
  // 查询已有的评分表
  getList: async data => {
    const result = await request({
      url: '/finAssSet/getList',
      data: {
        isQuery: 1,
        cdId: '0004050201',
        requestData: {
          tcDwbm: data
        }
      }
    })
    return result || {}
  },
  // 保存勾选的评分表
  saveEvalList: async data => {
    const result = await request({
      url: 'finAssSet/save',
      data
    })
    return result || {}
  },
}
