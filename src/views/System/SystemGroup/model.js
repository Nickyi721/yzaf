import request from '@commons/request.js'

export default {
  // 获取工作组列表
  getWorkGroupList: async data => {
    const result = await request({
      url: '/workGroup/getWorkGroupList',
      data: data
    })
    return result || {}
  },
  deleteWorkGroup: async data => {
    const result = await request({
      url: '/workGroup/deleteWorkGroup',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
}
