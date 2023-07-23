import request from '@commons/request.js'
// import Mock from 'mockjs'
// import Config from '@/commons/config.js'
export default {
  updateData: async data => {
    const result = await request({
      url: '/abgl/updateAbjg',
      data: data
    })
    return result || {}
  },
  getDetail: async data => {
    const result = await request({
      url: '/abgl/getAbjgDetial',
      data: data
    })
    return result || {}
  }
}
