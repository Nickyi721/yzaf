import request from '@commons/request.js'

export default {
  // 保存时间
  saveTimeSet: async data => {
    const result = await request({
      url: 'rcjcsz/updatercjcsjsz',
      data: data
    })
    return result || {}
  },
  getSetTime: async data => {
    const result = await request({
      url: 'rcjcsz/getrcjcsjsz',
      data: data
    })
    return result || {}
  },
  deleteTimeSet: async data => {
    const result = await request({
      url: 'rcjcsz/deletercaqjcsjsz',
      data: data
    })
    return result || {}
  }
}