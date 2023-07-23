import request from '@commons/request.js'

export default {
  getEquipConfig: async data => {
    const result = await request({
      url: '/safety/getjraqAfabszList',
      data: {
        isQuery: 1,
        requestData: {
          tnDllx: 0,
        }
      }
    })
    return result || {}
  },
  getEquipData: async data => {
    const result = await request({
      url: '/safety/getAutoDeviceList',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },
  deleteEquipData: async data => {
    const result = await request({
      url: '/safety/deleteAutoDevice',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
  deleteEquipDataAsDetail: async data => {
    const result = await request({
      url: '/safety/deleteycxx',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
}
