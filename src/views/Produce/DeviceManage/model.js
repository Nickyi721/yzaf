import request from '@commons/request.js'

export default {
  // 获取列表
  getDeviceList: async data => {
    const result = await request({
      url: 'aqscsbsslrto/selectAqcsSbsslr',
      data: data
    })
    return result || {}
  },
  // 删除
  deleteDevice: async data => {
    const result = await request({
      url: 'aqscsbsslrto/deleteAqcsSbsslr',
      data: data
    })
    return result || {}
  },
  // 设置停用启用状态
  setStatus: async data => {
    const result = await request({
      url: 'aqscsbsslrto/updateAqcsSbsslrStatus',
      data: data
    })
    return result || {}
  },
}