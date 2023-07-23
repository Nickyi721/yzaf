import request from '@commons/request.js'

export default {
    // 获取信息上报列表
    getPlanList: async data => {
        const result = await request({
            url: 'aqjcAqjcbg/getAqjcbgList',
            data
        })
        return result || {}
    },

}