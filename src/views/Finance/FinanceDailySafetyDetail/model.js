import request from '@commons/request.js'

export default {
  getDetail: async data => {
    const result = await request({
      url: 'rcaqjc/getdetail',
      data: data
    })
    return result || {}
  },
  saveList: async data => {
    const result = await request({
      url: 'rcaqjc/updatercjcti',
      data: data
    })
    return result || {}
  },
  exportTable: async data => {
    const result = await request({
      responseType: 'blob',
      url: 'rcaqjc/exportdetail',
      data
    })
    return result || {}
  }
}