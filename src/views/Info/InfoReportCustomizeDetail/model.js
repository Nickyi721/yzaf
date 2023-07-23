import request from '@commons/request.js'

export default {
  // 获取信息项列表
  getListData: async data => {
    const result = await request({
      url: '/template/getFormTemplateDetail',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },
  // 保存信息项
  saveListData: async data => {
    const result = await request({
      url: '/template/addFormTemplate',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
  // 更新信息项
  updateListData: async data => {
    const result = await request({
      url: '/template/updateFormTemplate',
      data: {
        requestData: data
      }
    })
    return result || {}
  }

}
