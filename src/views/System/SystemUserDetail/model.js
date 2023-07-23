import request from '@commons/request.js'

export default {
  addUser: async data => {
    const result = await request({
      url: '/system/addUser',
      data: {
        isQuery: 0,
        requestData: data
      }
    })
    return result || {}
  },
  // 获取用户
  getUserDetail: async data => {
    const result = await request({
      url: '/system/getUserDetail',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },
  updateUser: async data => {
    const result = await request({
      url: '/system/updateUser',
      data: {
        isQuery: 0,
        requestData: data
      }
    })
    return result || {}
  },
  
  // 重置密码
  ButtonResetPsd: async data =>{
    const result = await request({
      url:'/system/resetPassword',
      data: {
        requestData: data
      }
    })
    return result || {}
  }
}
