import request from '@commons/request.js'

export default {
  // 获取检查表详情
  getFormDetail: async data => {
    const result = await request({
      url: '/safeCheck/getAqjcDetail',
      data: data
    })
    return result || {}
  },
  // 保存检查表
  saveFormData: async data => {
    const result = await request({
      url: '/safeCheck/saveAqjcList',
      data: data
    })
    return result || {}
  },
  getDataList: async data => {
    const result = await request({
      url: '/yhct/queryYhctList',
      data
    })
    return result || {}
  },
  deleteData: async data => {
    const result = await request({
      url: '/yhct/deleteYhct',
      data
    })
    return result || {}
  },
  getJcfsTypes: async data => {
    const result = await request({
      url: '/yhct/getSjzdJcfslx',
      data
    })
    return result || {}
  },
  getSslbTypes: async data => {
    const result = await request({
      url: '/yhct/getSjzdSslblx',
      data
    })
    return result || {}
  },
  getSshjTypes: async data => {
    const result = await request({
      url: '/yhct/getSjzdSshjlx',
      data
    })
    return result || {}
  },
  getYwtxTypes: async data => {
    const result = await request({
      url: '/yhct/getSjzdYwtxlx',
      data: data
    })
    return result || {}
  }
}
