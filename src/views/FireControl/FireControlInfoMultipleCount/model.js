import request from '@commons/request.js'

export default {
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
  // 获取是否加密
  getSfjm: async data => {
    const result = await request({
      url: '/system/checkUserId',
      data
    })
    return result || {}
  },

}
