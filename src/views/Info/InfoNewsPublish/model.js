import request from '@commons/request.js'
// import Mock from 'mockjs'
// import Config from '@/commons/config.js'
export default {
  getDataList: async data => {
    const result = await request({
      url: '/fbxx/findXxfbList',
      data: data
    })
    return result || {}
  },
  deleteData: async data => {
    const result = await request({
      url: '/fbxx/deleteXxfb',
      data: data
    })
    return result || {}
  },
  getInfoTypes: async data => {
    const result = await request({
      url: '/fbxx/getSjzdXxfblx',
      data: data
    })
    return result || {}
  },
  getInfoStates: async data => {
    const result = await request({
      url: '/fbxx/getSjzdSpztlx',
      data: data
    })
    return result || {}
  },
}
