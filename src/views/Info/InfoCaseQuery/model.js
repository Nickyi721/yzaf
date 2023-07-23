import request from '@commons/request.js'

export default {
  // 获取信息上报列表
  getInfoList: async data => {
    const result = await request({
      url: 'xxglXxcb/getXxcbCxlb',
      data
    })
    return result || {}
  },
  // 编辑信息初报
  updateXxcb: async data => {
    const result = await request({
      url: 'xxglXxcb/updateXxcb',
      data
    })
    return result || {}
  },
  // 同意解锁
  tyjs: async data => {
    const result = await request({
      url: 'xxglXxcb/tyjs',
      data
    })
    return result || {}
  },
  // 导出Excel
  export: async data => {
    const result = await request({
      url: 'xxglXxcb/exportXxcb',
      data
    })
    return result || {}
  },
}
