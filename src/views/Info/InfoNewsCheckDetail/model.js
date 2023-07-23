import request from '@commons/request.js'
// import Mock from 'mockjs'
// import Config from '@/commons/config.js'
export default {
  updateStatus: async data => {
    const result = await request({
      url: '/fbxx/updateSpzt',
      data: data
    })
    return result || {}
  },
  getInfoTypes: async data => {
    const result = await request({
      url: '/fbxx/getSjzdXxfblx',
      data: data
    })
    return result || {}
  },
  getDetail: async data => {
    const result = await request({
      url: '/fbxx/getXxfbDetail',
      data: data
    })
    return result || {}
  }

}
