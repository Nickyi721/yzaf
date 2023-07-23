import request from '@commons/request.js'

export default {
  // 获取用户列表
  getDetail: async data => {
    const result = await request({
      url: '/abgl/getAbglryList',
      data: data
    })
    return result || {}
  },
  addData: async data => {
    const result = await request({
      url: '/abgl/saveAbglry',
      data: data
    })
    return result || {}
  },
  updateData: async data => {
    const result = await request({
      url: '/abgl/saveAbglry',
      data: data
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
