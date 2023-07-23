import request from '@commons/request.js'

export default {
  addRecord: async data => {
    const result = await request({
      url: '/trainingRecord/save',
      data
    })
    return result || {}
  },
  getDetail: async data => {
    const result = await request({
      url: '/trainingRecord/getDetail',
      data
    })
    return result || {}
  },
  updateRecord: async data => {
    const result = await request({
      url: '/trainingRecord/update',
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
