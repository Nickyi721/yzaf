import request from '@commons/request.js'

export default {
  // 获取检查表列表
  getSafeFormList: async (data = {}) => {
    data.isQuery = 1
    const result = await request({
      url: '/safeCheck/getAqjcList',
      data
    })
    return result || {}
  },
  // 删除
  deleteSafeForm: async data => {
    const result = await request({
      url: '/safeCheck/deleteAqjcList',
      data
    })
    return result || {}
  }
}
