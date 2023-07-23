import request from '@commons/request.js'

export default {
  getQrcodeDetail: async data => {
    const result = await request({
      url: '/qrcode/getQrcodeDetail',
      data: data
    })
    return result || {}
  },
  saveQrCodeItem: async data => {
    const result = await request({
      url: '/qrcode/saveQrCodeItem',
      data: data
    })
    return result || {}
  }, 
  getXfxxList: async data => {
    const result = await request({
      url: '/xfxx/getXfxxList',
      data: data
    })
    return result || {}
  },
  getXfEquipConfig: async data => {
    const result = await request({
      url: '/xfxxsz/getItemList',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
  getJrEquipConfig: async data => {
    const result = await request({
      url: '/safety/getjraqAfabszList',
      data: data
    })
    return result || {}
  },
  getJrEquipData: async data => {
    const result = await request({
      url: '/safety/getAutoDeviceList',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
}
