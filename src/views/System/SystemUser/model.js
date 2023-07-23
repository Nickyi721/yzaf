import request from '@commons/request.js'

export default {
  // 获取用户列表
  getUserList: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/system/getUserList',
      data
    })
    return result || {}
  },
  deleteUser: async data => {
    const result = await request({
      url: '/system/deleteUser',
      data: {
        isQuery: 0,
        requestData: data
      }
    })
    return result || {}
  },
  deleteUser2: async data => {
    const result = await request({
      url: '/system/deleteUser2',
      data: {
        isQuery: 0,
        requestData: data
      }
    })
    return result || {}
  },
  exportTable: async data => {
    const result = await request({
      responseType: 'blob',
      url: 'system/exportUserList', 
      data
    })
    return result || {}
  }
}
