import request from '@commons/request.js'

export default {
  getTemplateList: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/template/getFormTemplateList',
      data
    })
    return result || {}
  },
  deleteData: async data => {
    const result = await request({
      url: '/template/deleteFormTemplateList',
      data: {
        requestData: data
      }
    })
    return result || {}
  }
}
