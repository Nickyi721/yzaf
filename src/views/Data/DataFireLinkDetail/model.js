import request from '@commons/request.js'

export default {
  getEvalList: async data => {
    const result = await request({
      url: 'xjjbxx/getxjmxxx',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },
  getFacilityList: async data => {
    const result = await request({
      url: 'xjjbxx/getxjmxxx',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },
  // 获取信息项列表
  getLinkList: async data => {
    const result = await request({
      url: '/glxxx/getglxx',
      data: {
        isQuery: 1,
        requestData: {
          tcPgxxxlx: data
        }
      }
    })
    return result || {}
  },
  // 保存信息项
  saveListData: async data => {
    const result = await request({
      url: 'xjjbxx/savexjglxx',
      data: {
        requestData: data
      }
    })
    return result || {}
  }
}
