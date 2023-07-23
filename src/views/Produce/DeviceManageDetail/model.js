import request from '@commons/request.js'

export default {
  getDetail: async data => {
    const result = request({
      url: 'aqscsbsslrto/getAqcsSbsslrByToId',
      data,
    })
    return result || {}
  },
  getConfig: async data => {
    const result = request({
      url: 'aqscsbssnrpz/getAqcsSbssnepzDetailByXxxlx',
      data
    })
    return result || {}
  },
  insertData: async data => {
    const result = request({
      url: 'aqscsbsslrto/insertAqcsSbsslr',
      data,
    })
    return result || {}
  },
  updateData: async data => {
    const result = request({
      url: 'aqscsbsslrto/editAqcsSbsslr',
      data,
    })
    return result || {}
  },
  getXfxxList: async data => {
    const result = await request({
      url: '/xfxx/getXfxxList',
      data: data
    })
    return result || {}
  },
  getEquipConfig: async data => {
    const result = await request({
      url: '/xfxxsz/getItemList',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },
  exportTable: async data => {
    const result = await request({
      responseType: 'blob',
      url: '/aqscsbssnrpz/exportAqcsSbssnepzDetailByXxxlx',
      data
    })
    return result || {}
  }
}