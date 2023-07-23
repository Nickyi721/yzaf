import request from '@commons/request.js'
export default {
  updateData: async data => {
    const result = await request({
      url: '/fbxx/updateXxfb',
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
  },
  addData: async data => {
    const result = await request({
      url: '/fbxx/addXxfb',
      data: data
    })
    return result || {}
  },
}
