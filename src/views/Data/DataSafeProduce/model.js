import request from '@commons/request.js'

export default {
  getDataList: async data => {
    const result = await request({
      url: 'aqscsbssnrpz/selectAqcsSbssnepz',
      data
    })
    return result || {}
  },
  deleteData: async data => {
    const result = await request({
      url: 'aqscsbssnrpz/deleteAqcsSbssnepz',
      data
    })
    return result || {}
  },
}
