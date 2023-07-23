import request from '@commons/request.js'

export default {
  getListData: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/xxglQzgl/getQzglList',
      data: data
    })
    return result || {}
  },
  deleteData: async data => {
    const result = await request({
      url: '/xxglQzgl/deleteQzgl',
      data: data
    })
    return result || {}
  }
}
