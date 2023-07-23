import request from '@commons/request.js'

export default {
  // 获取角色列表
  getDataRoleList: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/system/getRoleList',
      data
    })
    return result || {}
  },
  getRoleDetail: async data => {
    const result = await request({
      url: '/system/getRoleDetail',
      data: {
        isQuery: 1,
        requestData: {
          tnJsid: data
        }
      }
    })
    return result || {}
  },
  // 修改角色详情
  updateRole: async data => {
    const result = await request({
      url: 'system/updateRole',
      data
    })
    return result || {}
  },
  // 新增保存角色
  saveDataRoleItem: async data => {
    const result = await request({
      url: '/system/addRole',
      data
    })
    return result || {}
  },
  // 删除角色管理元素
  deleteRoleItem: async data => {
    const result = await request({
      url: '/system/deleteRole',
      data
    })
    return result || {}
  }
}
