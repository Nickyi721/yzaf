import request from '@commons/request.js'

export default {
  getEquipConfig: async data => {
    const result = await request({
      url: '/safety/getjraqAfabszList',
      data: {
        isQuery: 1,
        requestData: {
          tnDllx: 0
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
  getDetail: async data => {
    const result = await request({
      url: '/jraqGzbs/getJraqgzsbDetail',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },
  saveJraqgzsb: async data => {
    const result = await request({
      url: 'jraqGzbs/saveJraqgzsb',
      data: {
        isQuery: 0,
        requestData: {
          tnDllx: 0,
          ...data
        }
      }
    })
    return result || {}
  },
  saveYwx: async data => {
    const result = await request({
      url: 'jraqGzbs/saveYwx',
      data: {
        isQuery: 0,
        requestData: data
      }
    })
    return result || {}
  },
  saveSb: async data => {
    const result = await request({
      url: 'jraqGzbs/saveSb',
      data: {
        isQuery: 0,
        requestData: {
          tnDllx: 0,
          ...data
        }
      }
    })
    return result || {}
  }
}
