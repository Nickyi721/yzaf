import request from '@commons/request.js'

export default {
  addData: async data => {
    const result = await request({
      url: '/aqscsbssnrpz/insertAqcsSbssnepz',
      data: data
    })
    return result || {}
  },
  getDetail: async data => {
    const result = await request({
      url: '/aqscsbssnrpz/getAqcsSbssnepzDetailById',
      data
    })
    return result || {}
  },
  getXfmx: async data => {
    const result = await request({
      url: '/xfxxsz/getItemList',
      data
    })
    return result || {}
  },
  updateData: async data => {
    const result = await request({
      url: '/aqscsbssnrpz/updateAqcsSbssnepz',
      data
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
  getRelatedOptions: async data => {
    const result = await request({
      url: '/xfxxsz/getXxxlxList',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },
}
