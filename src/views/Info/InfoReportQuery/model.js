import request from '@commons/request.js'

export default {
  // 获取信息上报列表
  getInfoList: async data => {
    const result = await request({
      url: 'info/getInfoList',
      data
    })
    return result || {}
  },

  // 上报报表查询
  getBbsbList: async data => {
    const result = await request({
      url: 'rwzt/queryBbsbList',
      isQuery: '1',
      cdID: '0004030304',
      data: data
    })
    return result || {}
  },
  // 申请重填
  applyData: async data => {
    const result = await request({
      url: '/rwzt/cxsb',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
  // 查询是否已经填报
  queryRwzt: async data => {
    const result = await request({
      url: 'rwzt/queryBBtbList',
      data
    })
    return result || {}
  },
}
