// import Mock from 'mockjs'
// import Config from '@commons/config.js'
import request from '@commons/request.js'

export default {
  // 获取下级机构列表
  addFnOrg: async data => {
    const result = await request({
      url: '/org/saveDwgns',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
  deleteFnOrg: async data => {
    const result = await request({
      url: '/org/deleteDwgns',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
}
