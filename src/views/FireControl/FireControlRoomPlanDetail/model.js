import request from '@commons/request.js'

export default {
  getPearson: async data => {
    const result = await request({
      url: 'ryxxgj/getRyxxList',
      data
    })
    return result || {}
  },
  getClassTime: async data => {
    const result = await request({
      url: 'rybcb/getRybcbList',
      data
    })
    return result || {}
  },
  getWorkTime: async data => {
    const result = await request({
      url: 'rybcb/getRybcbList',
      data
    })
    return result || {}
  },
  saveClass: async data => {
    const result = await request({
      url: 'rypbxq/insertRypbxq',
      data
    })
    return result || {}
  },
  deleteClass: async data => {
    const result = await request({
      url: 'rypbxq/deleteRypbxq',
      data
    })
    return result || {}
  },
  getClass: async data => {
    const result = await request({
      url: 'rypbxq/getRypbxqList',
      data
    })
    return result || {}
  },
  exportTable: async data => {
    const result = await request({
      responseType: 'blob',
      url: 'rypbxq/exportRypbxqList',
      data
    })
    return result || {}
  }
}
