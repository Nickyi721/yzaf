import request from '@commons/request.js'

export default {
  editOrgData: async data => {
    const result = await request({
      url: '/dwxx/editOrg',
      data: {
        isQuery: 0,
        cdId: '00040102',
        requestData: data
      }
    })
    return result || {}
  },
  getOrgDetail: async data => {
    const result = await request({
      url: '/dwxx/getOrgDetail',
      data
    })
    return result || {}
  },
  getAreaSheng: async data => {
    const result = await request({
      url: '/dwxx/getAllsheng',
      data: {
        isQuery: 1,
        cdId: '00040102',
        requestData: {}
      }
    })
    return result || {}
  },
  getAreaShi: async data => {
    const result = await request({
      url: '/dwxx/getAllshi',
      data
    })
    return result || {}
  },
  getAreaXian: async data => {
    const result = await request({
      url: '/dwxx/getAllxian',
      data
    })
    return result || {}
  },
}
