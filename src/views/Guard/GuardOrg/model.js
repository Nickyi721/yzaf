import request from '@commons/request.js'

export default {
  // 获取用户列表
  getSecurityOrgList: async data => {
    const result = await request({
      url: '/abgl/getAbjgList',
      data: data
    })
    return result || {}
  },
  deleteSecurityOrg: async data => {
    const result = await request({
      url: '/abgl/deleteAbjg',
      data: data
    })
    return result || {}
  },
}
