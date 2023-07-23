import request from '@commons/request.js'
import { async } from 'q'

export default {
  getLogList: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/xtrz/getList',
      data
    })
    return result || {}
  },
  exportTable: async data => {
    const result = await request({
      responseType: 'blob',
      url: 'xtrz/exportList',
      data
    })
    return result || {}
  },
  getSjscList: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/xtsjsc/getList',
      data
    })
    return result || {}
  },
  exportSjscTable: async data => {
    const result = await request({
      responseType: 'blob',
      url: 'xtsjsc/exportList',
      data
    })
    return result || {}
  },
  getfwqyxList: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/xtfwqyxqk/getList',
      data
    })
    return result || {}
  },
  exportFwqyxTable: async data => {
    const result = await request({
      responseType: 'blob',
      url: 'xtfwqyxqk/exportList',
      data
    })
    return result || {}
  }
}
