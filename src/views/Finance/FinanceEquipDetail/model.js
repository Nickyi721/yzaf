import request from '@commons/request.js'

export default {
  getEquipConfig: async data => {
    const result = await request({
      url: '/safety/getjraqAfabszList',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },
  getEquipConfigAdd: async data => {
    const result = await request({
      url: '/safety/getjraqAfabszListadd',
      data: {
        isQuery: 1,
        requestData: data
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
  saveEquipData: async data => {
    const result = await request({
      commit: true,
      url: '/safety/saveAutoDevice',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
  deleteDetailData: async data => {
    const result = await request({
      url: '/safety/deleteAutoDevice',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
  uploadFile: async data => {
    const result = await request({
      url: '/fileUploadDown/fileUpload',
      data: data
    })
    return result || {}
  },
}
