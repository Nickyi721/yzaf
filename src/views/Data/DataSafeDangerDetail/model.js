import request from '@commons/request.js'

export default {
  getDetail: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/yhct/getYhctDetail',
      data: data
    })
    return result || {}
  },
  updateData: async data => {
    const result = await request({
      url: '/yhct/updateYhct',
      data: data
    })
    return result || {}
  },
  getJcfsTypes: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/yhct/getSjzdJcfslx',
      data: data
    })
    return result || {}
  },
  getSslbTypes: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/yhct/getSjzdSslblx',
      data: data
    })
    return result || {}
  },
  getSshjTypes: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/yhct/getSjzdSshjlx',
      data: data
    })
    return result || {}
  },
  getYwtxTypes: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/yhct/getSjzdYwtxlx',
      data: data
    })
    return result || {}
  },
  getCtztTypes: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/yhct/getSjzdCtztlx',
      data: data
    })
    return result || {}
  }
}
