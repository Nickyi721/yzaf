import request from '@commons/request.js'

export default {
  // 获取信息项列表
  getListData: async data => {
    const result = await request({
      url: 'rcjcsz/getrcjcszList',
      data
    })
    return result || {}
  },
  // 保存信息项
  saveListData: async data => {
    const result = await request({
      url: 'rcjcsz/savercjcsz',
      data
    })
    return result || {}
  }

}
