import request from '@commons/request.js'

export default {
  getEvalList: async data => {
    const result = await request({
      url: 'xjjbxx/getxjglxx',
      data: {
        isQuery: 1,
        requestData: {
          tcXxxlx: data
        }
      }
    })
    return result || {}
  },
  // 删除检查表
  deleteItems: async data => {
    const result = await request({
      url: 'xjjbxx/deleteRcxjgj ',
      data
    })
    return result || {}
  },
  getFacilityList: async data => {
    const result = await request({
      url: '/safety/getItemList',
      data: {
        isQuery: 1,
        requestData: {
          tcXxxlx: data
        }
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
      data
    })
    return result || {}
  }
}
