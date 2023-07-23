import request from '@commons/request.js'

export default {
  // 获取用户列表
  getDetail: async data => {
    const result = await request({
      url: '',
      data: data
    })
    return result || {}
  },
  addData: async data => {
    const result = await request({
      url: '/abgl/saveAbgzry',
      data: data
    })
    return result || {}
  },
  updateData: async data => {
    const result = await request({
      url: '/abgl/saveAbgzry',
      data: data
    })
    return result || {}
  },
  getDetail: async data => {
    const result = await request({
      url: '/abgl/getAbgzryList',
      data: data
    })
    return result || {}
  },
}
