import request from '@commons/request.js'
export default {
  addData: async data => {
    const result = await request({
      url: '/fbxx/addXxfb',
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
}
