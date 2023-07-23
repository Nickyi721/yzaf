import request from '@commons/request.js'

export default {
  // 获取是否加密
  getSfjm: async data => {
    const result = await request({
      url: '/system/checkUserId',
      data
    })
    return result || {}
  },
}