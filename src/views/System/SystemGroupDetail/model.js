import request from '@commons/request.js'

export default {
  // 获取工作组详情
  getGroup: async data => {
    const result = await request({
      url: '/workGroup/toEditWorkGroup',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },
  // 获取工作组列表
  addGroup: async data => {
    const result = await request({
      url: '/workGroup/save',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
  updateGroup: async data => {
    const result = await request({
      url: '/workGroup/editWorkGroup',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
}
