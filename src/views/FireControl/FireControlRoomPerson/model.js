import request from '@commons/request.js'

export default {
  getListData: async data => {
    const result = await request({
      url: 'abgl/getXfkzsRyList',
      data
    })
    return result || {}
  },
  getFormData: async data => {
    const result = await request({
      url: 'ryxxgj/getRyxxList',
      data
    })
    return result || {}
  },
  saveFormData: async data => {
    const result = await request({
      url: 'ryxxgj/insertRyxxgj',
      data
    })
    return result || {}
  },
  getNote: async data => {
    const result = await request({
      url: 'ryxxgj/updateRyxxBz',
      data
    })
    return result || {}
  },
  deletePerson: async data => {
    const result = await request({
      url: 'ryxxgj/deleteRyxxgj',
      data
    })
    return result || {}
  },
  exportTable: async data => {
    const result = await request({
      responseType: 'blob',
      url: 'ryxxgj/exportRyxxList',
      data
    })
    return result || {}
  }
}
