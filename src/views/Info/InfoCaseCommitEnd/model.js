import request from '@commons/request.js'

export default {
  // 完结保存
  saveEndList: async data => {
    const result = await request({
      url: 'xxglXxcb/endXxcb',
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
  uploadFile:async data => {
    const result = await request({
      url: '/fileUploadDown/fileUpload',
      data: data
    })
    return result || {}
  },
}
