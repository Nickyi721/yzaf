import request from '@commons/request.js'

export default {
  addData: async data => {
    const result = await request({
      url: '/yhct/addYhct',
      data: data
    })
    return result || {}
  },
  getJcfsTypes: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/yhct/getSjzdJcfslx',
      data
    })
    return result || {}
  },
  getSslbTypes: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/yhct/getSjzdSslblx',
      data
    })
    return result || {}
  },
  getSshjTypes: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/yhct/getSjzdSshjlx',
      data
    })
    return result || {}
  },
  getYwtxTypes: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/yhct/getSjzdYwtxlx',
      data
    })
    return result || {}
  }
}
