import request from '@commons/request.js'

export default {
  // 获取用户列表
  getSecurityOrgList: async data => {
    const result = await request({
      url: '/abgl/getAbglryList',
      data: data
    })
    return result || {}
  },
  deleteSecurityOrg: async data => {
    const result = await request({
      url: '/abgl/deleteAbglry',
      data: data
    })
    return result || {}
  },
}
