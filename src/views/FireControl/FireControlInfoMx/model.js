import request from '@commons/request.js'

export default {
  getEquipType: async data => {
    const result = await request({
      url: '/xfxxsz/getXxxlxList',
      data: {}
    })
    return result || {}
  },
  getXfxxList: async data => {
    const result = await request({
      url: '/xfxx/getXfxxList',
      data: data
    })
    return result || {}
  },
  getEquipConfig: async data => {
    const result = await request({
      url: '/xfxxsz/getItemList',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },
  deleteXfxxList: async data => {
    const result = await request({
      url: '/xfxx/deleteXfxxList',
      data: {
        isQuery: 0,
        requestData: data
      }
    })
    return result || {}
  },
}
