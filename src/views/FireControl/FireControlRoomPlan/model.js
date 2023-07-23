import request from '@commons/request.js'

export default {
  setClassTime: async data => {
    const result = await request({
      url: 'rybcb/insertRybcxx',
      data
    })
    return result || {}
  },
  gettdPbrq: async data => {
    const result = await request({
      url: 'rypbxq/getRypbxxCountList',
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
  controlClass: async data => {
    const result = await request({
      url: 'rybcb/enableOrDisableRybcb',
      data
    })
    return result || {}
  }
}
