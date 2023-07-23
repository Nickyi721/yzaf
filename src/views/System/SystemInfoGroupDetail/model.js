import request from '@commons/request.js'

export default {
  getData: async data => {
    const result = await request({
      url: '/xxglQzgl/getQzglDetail',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },
  updateData: async data => {
    const result = await request({
      url: '/xxglQzgl/updateQzgl',
      data: data
    })
    return result || {}
  }
}
