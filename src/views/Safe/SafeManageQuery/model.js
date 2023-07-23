import request from '@commons/request.js'

export default {

  // 获取列表
  getAqjcbList: async data => {
    data.isQuery = 1
    data.cdId = '0004060205'
    const result = await request({
      url: 'aqjcAqjcbg/getAqjcjgList',
      data
    })
    return result || {}
  },
  // 获取数据字典树
  getDataDictTree: async data => {
    const result = await request({
      url: '/params/getSjzdListTree',
      data
    })
    return result || {}
  },
  // 获取数据字典列表
  getDataDictList: async data => {
    const result = await request({
      url: '/params/getSjzdList',
      data
    })
    return result || {}
  },
  // 保存数据字典元素
  saveDataDictItem: async data => {
    const result = await request({
      url: '/params/saveParam',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
  // 保存数据字典元素
  deleteDataDictItem: async data => {
    const result = await request({
      url: '/params/deleteParam',
      data: {
        requestData: {
          sjbm: data
        }
      }
    })
    return result || {}
  },
}
