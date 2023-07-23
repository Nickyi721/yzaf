import request from '@commons/request.js'

export default {
  getEquipConfig: async data => {
    const result = await request({
      url: '/xfxxsz/getItemList',
      data: {
        isQuery: 1,
        requestData: data
      }
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
  uploadFile: async data => {
    const result = await request({
      url: '/fileUploadDown/fileUpload',
      data: data
    })
    return result || {}
  },
  getEquipData: async data => {
    const result = await request({
      url: '/xfxx/getXfxxDetail',
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
      url: '/xfxx/saveXfxx',
      data: {
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
  // deleteDetailData: async data => {
  //   const result = await request({
  //     url: '/safety/deleteAutoDevice',
  //     data: {
  //       requestData: data
  //     }
  //   })
  //   return result || {}
  // },
}
