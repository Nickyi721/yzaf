import request from '@commons/request.js'

export default {
  // 新增-续报
  addContinueList: async data => {
    const result = await request({
      url: 'xxglXxxb/addXxxb  ',
      data
    })
    return result || {}
  },
  // 修改-续报
  updateContinueList: async data => {
    const result = await request({
      url: 'xxglXxxb/addXxxb ',
      data
    })
    return result || {}
  },
  // 获取详情
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
  uploadFile:async data => {
    const result = await request({
      url: '/fileUploadDown/fileUpload',
      data: data
    })
    return result || {}
  },
}
