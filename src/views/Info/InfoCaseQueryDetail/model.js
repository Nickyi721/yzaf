import request from '@commons/request.js'

export default {
  // 获取信息上报列表
  getDetail: async data => {
    const result = await request({
      url: 'xxglXxcb/getDetail',
      data
    })
    return result || {}
  },
  // 编辑信息初报
  updateXxcb: async data => {
    const result = await request({
      url: 'xxglXxcb/updateXxcb',
      data
    })
    return result || {}
  },
  // 编辑信息续报
  updateXxxb: async data => {
    const result = await request({
      url: 'xxglXxxb/updateXxxb',
      data
    })
    return result || {}
  },
  // 信息 继续上报
  addJxxxcb: async data => {
    const result = await request({
      url: 'xxglXxcb/addJxxxcb',
      data
    })
    return result || {}
  },
  uploadFile:async data => {
    const result = await request({
      url: '/fileUploadDown/fileUpload',
      data: data
    })
    return result || {}
  }
}
