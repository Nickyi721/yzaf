import request from '@commons/request.js'

export default {
  getEquipConfig: async data => {
    const result = await request({
      url: 'xjjbxx/getxjjbxxszList',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },
  getEquipData: async data => {
    const result = await request({
      url: 'xjjbxx/getXjjbxxist',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },
  saveEquipData: async data => {
    const result = await request({
      commit: true,
      url: 'xjjbxx/saveXjjbxx',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
  deleteDetailData: async data => {
    const result = await request({
      url: 'xjjbxx/deleteXjjbxx',
      data: {
        requestData: data
      }
    })
    return result || {}
  }
}
