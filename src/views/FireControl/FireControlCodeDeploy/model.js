import request from '@commons/request.js'

export default {
  getQrcodeList: async data => {
    const result = await request({
      url: '/qrcode/getQrcodeList',
      data: data
    })
    return result || {}
  },
  deleteQrCodeItem: async data => {
    const result = await request({
      url: '/qrcode/deleteQrCodeItem',
      data: data
    })
    return result || {}
  }, 
  refreshQrCodeStatusItem: async data => {
    const result = await request({
      url: '/qrcode/refreshQrCodeStatusItem',
      data: data
    })
    return result || {}
  }, 
  loadQrCodeItem: async data => {
    const result = await request({
      url: '/qrcode/loadQrCodeItem',
      data: data
    })
    return result || {}
  }, 
  downloadQrCodeItem: async data => {
    const result = await request({
      url: '/qrcode/donwloadQrCode',
      data: data
    })
    return result || {}
  }, 
  donwloadQrCodeZip: async data => {
    const result = await request({
      url: '/qrcode/donwloadQrCodeZip',
      data: data
    })
    return result || {}
  }, 
}