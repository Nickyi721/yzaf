import request from '@commons/request.js'

export default {
  // 获取信息项列表
  getListData: async data => {
    const result = await request({
      url: '/xfxxsz/getItemList',
      data: {
        isQuery: 1,
        requestData: {
          tcXxxlx: data
        }
      }
    })
    return result || {}
  },
  // 保存信息项
  saveListData: async data => {
    const result = await request({
      url: '/xfxxsz/saveSafetyItem',
      data: {
        requestData: data
      }
    })
    return result || {}
  },

}
