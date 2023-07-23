import request from '@commons/request.js'

export default {
  // 新增初报
  saveAddList: async data => {
    const result = await request({
      url: 'xxglXxcb/addXxcb',
      data
    })
    return result || {}
  },
  // 编辑初报
  updateCbList: async data => {
    const result = await request({
      url: 'xxglXxcb/addXxcb ',
      data
    })
    return result || {}
  },
  // 获取初报详情
  getDetail: async data => {
    const result = await request({
      url: 'xxglXxcb/getDetail',
      data
    })
    return result || {}
  },
  // 获取下级单位
  getOrg: async data => {
    const result = await request({
      url: 'xxglXxcb/getXjdwList',
      data
    })
    return result || {}
  },
  uploadFile: async data => {
    const result = await request({
      url: '/fileUploadDown/fileUpload',
      data: data
    })
    return result || {}
  }
}
